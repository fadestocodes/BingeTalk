import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ThreadsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='[threadsId]' options={{headerShown : false}} />
      <Stack.Screen name='discover' options={{headerShown : false}} />
    </Stack>
  )
}

export default ThreadsLayout

const styles = StyleSheet.create({})