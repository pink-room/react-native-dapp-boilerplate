import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Image, View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {useWalletConnect} from '@walletconnect/react-native-dapp';

import ConnectedComponent from './components/ConnectedComponent';

export default function App() {
  const [account, setAccount] = useState('NOT CONNECTED');

  const connector = useWalletConnect();

  const connectWallet = useCallback(() => {
    return connector.connect();
  }, [connector]);

  useEffect(() => {
    if (connector.accounts != null && connector.accounts[0] != null) {
      setAccount(connector.accounts[0]);
    }
  }, [connector]);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(
      address.length - 4,
      address.length,
    )}`;
  };

  const killSession = useCallback(() => {
    connector.killSession();
    setAccount('NOT CONNECTED');
  }, [connector]);

  return (
    <SafeAreaProvider style={styles.container}>
      {!connector.connected && account === 'NOT CONNECTED' ? (
        <>
          <Image source={require('./assets/images/peanut_butter.png')} />
          <View style={styles.mainContainer}>
            <View style={styles.maxWidth}>
              <Text style={styles.title}>Welcome to</Text>
              <Text style={[styles.title, styles.bold]}>Whip & Slip</Text>
            </View>
            <TouchableOpacity
              onPress={connectWallet}
              style={styles.buttonStyle}>
              <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.connectedContainer}>
            <View>
              <Image source={require('./assets/images/peanut_butter.png')} />
            </View>
            <View style={styles.connectedContent}>
              <Text style={[styles.userAccount, styles.bold]}>Account</Text>
              <Text style={[styles.userAccount]}>
                {shortenAddress(account)}
              </Text>
              <TouchableOpacity
                onPress={killSession}
                style={styles.buttonStyle}>
                <Text style={styles.buttonTextStyle}>Kill session</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mainContainer}>
            <ConnectedComponent account={account} connector={connector} />
          </View>
        </>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: '#333138',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  mainContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#e7a61a',
    height: '80%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
  },
  userAccount: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonStyle: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    marginTop: 12,
  },
  buttonTextStyle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
  },
  maxWidth: {
    maxWidth: 250,
  },
  connectedContainer: {
    flexDirection: 'row',
  },
  connectedContent: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
