import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ReviewLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='[reviewId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default ReviewLayout

const styles = StyleSheet.create({})