import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../../../../../../constants/Colors'

const InterestedFromProfile = () => {
  return (
    <Stack screenOptions={{contentStyle:{backgroundColor : Colors.primary}}}>
      <Stack.Screen name='[userId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default InterestedFromProfile

const styles = StyleSheet.create({})