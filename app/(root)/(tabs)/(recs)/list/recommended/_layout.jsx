import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const RecommendedFromProfile = () => {
  return (
    <Stack>
      <Stack.Screen name='[userId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default RecommendedFromProfile

const styles = StyleSheet.create({})