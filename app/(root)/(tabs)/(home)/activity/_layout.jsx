import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ActivityLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='[activityId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default ActivityLayout

const styles = StyleSheet.create({})