import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const WatchListFromProfile = () => {
  return (
    <Stack>
      <Stack.Screen name='[userId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default WatchListFromProfile

const styles = StyleSheet.create({})