import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../../../constants/Colors'
import { Stack } from 'expo-router'

const ListLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='[listId]' options={{headerShown : false}} />
      <Stack.Screen name='recently-watched' options={{headerShown : false}} />
      <Stack.Screen name='interested' options={{headerShown : false}} />
      <Stack.Screen name='watchlist' options={{headerShown : false}} />
      <Stack.Screen name='recommended' options={{headerShown : false}} />
      <Stack.Screen name='edit'options={{headerShown : false, contentStyle:{  marginTop:0  , borderRadius:30, backgroundColor:Colors.primary }}} />
    </Stack>
  )
}

export default ListLayout

const styles = StyleSheet.create({})