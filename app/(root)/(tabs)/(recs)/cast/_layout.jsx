import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../../../../../constants/Colors'

const CastLayout = () => {
  return (
    <Stack screenOptions={{contentStyle:{backgroundColor : Colors.primary}}}>
      <Stack.Screen name='[castId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default CastLayout

const styles = StyleSheet.create({})