import React from 'react'
import { SafeAreaView, StyleSheet, Text } from 'react-native'

export default function App() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Hello World</Text>
      </SafeAreaView>
    )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333138',
    alignItems: 'center',
    justifyContent: 'center',
  },})
