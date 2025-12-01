import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../../../../../../constants/Colors'

const MovieLayout = () => {
  return (
    <Stack screenOptions={{contentStyle:{backgroundColor : Colors.primary}}}>
      <Stack.Screen name='[ratingsId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default MovieLayout

const styles = StyleSheet.create({})