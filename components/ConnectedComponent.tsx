import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import Web3 from 'web3';
import {Picker} from '@react-native-picker/picker';
import Card from './Card';

// Types
import WalletConnect from '@walletconnect/client';
import {Contract} from 'web3-eth-contract';
import {ITxData} from '@walletconnect/types';

// Constants
import {CONTRACT_ADDRESS} from '../config';
const contractABI = require('../contracts/PeanutButterFactory.json');

interface OwnProps {
  account: string;
  connector: WalletConnect;
}

interface Jar {
  extraIngredient: string[];
  paidValue: number;
  creator: string;
}

const COLORS = [
  '#75633C',
  '#DB6D18',
  '#51E0CA',
  '#02A860',
  '#2EDB90',
  '#A002DB',
];

const ConnectedComponent = ({account, connector}: OwnProps) => {
  const [peanutButterContract, setPeanutButterContract] = useState<Contract>();
  const [ingredients, setIngredients] = useState<string[]>();
  const [ingredient, setIngredient] = useState('');
  const [jars, setJars] = useState<Jar[]>();

  // Replace this by your web3 node URL. We used and recommend Alchemy
  const ALCHEMY_URL =
    'https://eth-goerli.alchemyapi.io/v2/i-MBCd60cuXWyU7GEZqRV0vEujw1ygiT';

  const web3 = new Web3(ALCHEMY_URL);

  useEffect(() => {
    async function load() {
      const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
      setPeanutButterContract(contract);
    }
    load();
  }, [web3.eth.Contract]);

  const getJars = async () => {
    if (peanutButterContract) {
      const fetchedJars = await peanutButterContract.methods.getJars().call();

      let parsedJars: Jar[] = fetchedJars
        .filter((jar: string[]) => jar[0] !== '')
        .map((jar: string[]) => {
          const parsedJar: Jar = {
            extraIngredient: parseExtraIngredients(jar[0]),
            paidValue: Number(web3.utils.fromWei(jar[1], 'ether')),
            creator: jar[2],
          };

          return parsedJar;
        });
      setJars(parsedJars);
    }
  };

  const getIngredients = async () => {
    const ingredientList = await peanutButterContract?.methods
      .getExtraIngredients()
      .call();
    console.log(ingredientList);
    setIngredients(ingredientList);
  };

  const parseExtraIngredients = (extraIngredients: string) => {
    let splittedIngredients = extraIngredients
      .split(',')
      .filter((item: string) => item !== '')
      .map(item => item.trim());
    return splittedIngredients;
  };

  const createJar = async () => {
    if (peanutButterContract) {
      const encodedRequest = await peanutButterContract.methods
        .create(ingredient)
        .encodeABI();

      const transactionData: ITxData = {
        from: account,
        to: CONTRACT_ADDRESS,
        value: web3.utils.toHex(web3.utils.toWei('0.001')),
        data: encodedRequest,
      };

      await connector.sendTransaction(transactionData);
    }
  };

  return (
    <View style={styles.mainView}>
      <Card>
        <TouchableOpacity onPress={getJars}>
          <Text style={styles.buttonTextStyle}>Get Jars</Text>
        </TouchableOpacity>
      </Card>

      <Card>
        <TouchableOpacity onPress={getIngredients} style={styles.jarButton}>
          <Text style={styles.buttonTextStyle}>Get Ingredients</Text>
        </TouchableOpacity>

        {ingredients && (
          <Picker
            selectedValue={ingredient}
            onValueChange={itemValue => setIngredient(itemValue)}
            style={styles.picker}>
            {ingredients.map((item: string, index: number) => {
              return <Picker.Item key={index} label={item} value={item} />;
            })}
          </Picker>
        )}
      </Card>
      {ingredients != null && ingredients.length !== 0 && (
        <Card>
          <TouchableOpacity onPress={createJar} style={styles.jarButton}>
            <Text style={styles.buttonTextStyle}>Create Jar</Text>
          </TouchableOpacity>

          {ingredients && (
            <Picker
              selectedValue={ingredient}
              onValueChange={itemValue => setIngredient(itemValue)}
              style={styles.picker}>
              {ingredients.map((item: string, index: number) => {
                return <Picker.Item key={index} label={item} value={item} />;
              })}
            </Picker>
          )}
        </Card>
      )}
      {jars && (
        <View style={[styles.jarsView, styles.shadow]}>
          <Text style={styles.buttonTextStyle}>Jars</Text>
          <ScrollView style={styles.scrollView}>
            {jars?.map((jar: Jar, index: number) => {
              return (
                <View key={index} style={styles.jar}>
                  <View
                    style={{
                      ...styles.coloredBox,
                      backgroundColor:
                        COLORS[Math.floor(Math.random() * (5 - 0 + 1) + 0)],
                    }}
                  />
                  <View style={styles.infoView}>
                    <View style={styles.infoViewContent}>
                      <View style={styles.infoViewTextContainer}>
                        <Text style={styles.jarNumberText}>#{index}</Text>
                      </View>
                      <Text style={styles.paidValueText}>{jar.paidValue}</Text>
                    </View>

                    <Text style={styles.extraIngredientText}>
                      {jar.extraIngredient}
                    </Text>
                    <Text style={styles.jarCreatorText}>{jar.creator}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoView: {
    backgroundColor: '#e7a61a',
    width: '90%',
  },
  infoViewContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e7a61a',
  },
  coloredBox: {
    width: 12,
    height: 24,
    borderRadius: 6,
    marginRight: 12,
  },
  jar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#e7a61a',
  },
  shadow: {
    shadowColor: '#8d6125',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 8,
  },
  mainView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    backgroundColor: '#e7a61a',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 12,
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  jarsView: {
    width: '100%',
    minHeight: 80,
    height: 'auto',
    padding: 8,
    paddingLeft: 12,
    backgroundColor: '#e7a61a',
    borderRadius: 18,
    marginTop: 12,
  },
  jarButton: {
    marginBottom: 12,
  },
  picker: {
    height: 30,
    width: '80%',
    backgroundColor: '#d29616',
    color: 'white',
  },
  scrollView: {
    maxHeight: 200,
  },
  jarCreatorText: {
    fontSize: 12,
  },
  extraIngredientText: {
    fontSize: 16,
    fontWeight: '700',
  },
  paidValueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  infoViewTextContainer: {
    flexGrow: 1,
    backgroundColor: '#e7a61a',
  },
  jarNumberText: {
    fontSize: 12,
    color: '#333',
  },
});

export default ConnectedComponent;
