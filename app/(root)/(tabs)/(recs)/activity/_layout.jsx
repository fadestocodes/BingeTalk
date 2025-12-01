import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../../../../../constants/Colors'

const ActivityLayout = () => {
  return (
    <Stack screenOptions={{contentStyle:{backgroundColor : Colors.primary}}}>
      <Stack.Screen name='[activityId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default ActivityLayout

const styles = StyleSheet.create({})