import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../../../../../constants/Colors'

const ListLayout = () => {
  return (
    <Stack screenOptions={{contentStyle:{backgroundColor : Colors.primary}}}>
      <Stack.Screen name='[listId]' options={{headerShown : false}} />
      <Stack.Screen name='recently-watched' options={{headerShown : false}} />
      <Stack.Screen name='interested' options={{headerShown : false}} />
      <Stack.Screen name='watchlist' options={{headerShown : false}} />
      <Stack.Screen name='recommended' options={{headerShown : false}} />
      <Stack.Screen name='edit' options={{headerShown : false}} />
    </Stack>
  )
}

export default ListLayout

const styles = StyleSheet.create({})