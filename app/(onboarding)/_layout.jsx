import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const Onboarding = () => {
  return (
    <Stack>
      <Stack.Screen name='step1' options={{headerShown : false}} />
      <Stack.Screen name='step2' options={{headerShown : false}} />
      <Stack.Screen name='step3' options={{headerShown : false}} />
    </Stack>
  )
}

export default Onboarding

const styles = StyleSheet.create({})