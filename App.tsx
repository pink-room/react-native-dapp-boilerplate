import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello World</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
