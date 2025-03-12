import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const RecommendedFromHome = () => {
  return (
    <Stack>
      <Stack.Screen name='[userId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default RecommendedFromHome

const styles = StyleSheet.create({})