import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../../../constants/Colors'
import { Stack } from 'expo-router'

const SetDayLayout = () => {
  return (
    <Stack screenOptions={{contentStyle:{backgroundColor : Colors.primary}}}>
      <Stack.Screen name='[setDayId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default SetDayLayout

const styles = StyleSheet.create({})