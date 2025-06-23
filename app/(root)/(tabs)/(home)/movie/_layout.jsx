import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const CastLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='[movieId]' options={{headerShown : false}} />
      <Stack.Screen name='ratings' options={{headerShown : false}} />
    </Stack>
  )
}

export default CastLayout

const styles = StyleSheet.create({})