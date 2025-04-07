import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const RecommendedFromBrowse = () => {
  return (
    <Stack>
      <Stack.Screen name='[userId]'  options={{headerShown : false}} />
    </Stack>
  )
}

export default RecommendedFromBrowse



const styles = StyleSheet.create({})