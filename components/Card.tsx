import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = (props: any) => {
    return (
    <View style={[styles.card, styles.shadow, styles.alignCenter]}>
        {props.children}
      </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '45%',
        height: 160,
        padding: 8,
        backgroundColor: '#e7a61a',
        borderRadius: 18,
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
      alignCenter: {
        alignItems: 'center',
        justifyContent: 'center',
      },
});

export default Card;