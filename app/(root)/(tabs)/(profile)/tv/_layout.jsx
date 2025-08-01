import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const TVLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='[tvId]' options={{headerShown : false}} />
      <Stack.Screen name='ratings' options={{headerShown : false}} />
    </Stack>
  )
}

export default TVLayout

const styles = StyleSheet.create({})