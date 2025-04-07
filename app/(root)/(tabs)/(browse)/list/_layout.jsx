import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const ListLayoutBrowse = () => {
  return (
    <Stack  >
        <Stack.Screen name='[listId]' options={{headerShown : false}} />
        <Stack.Screen name='interested' options={{headerShown : false}} />
        <Stack.Screen name='recently-watched' options={{headerShown : false}} />
        <Stack.Screen name='watchlist' options={{headerShown : false}} />
        <Stack.Screen name='recommended' options={{headerShown : false}} />
    </Stack>
  )
}

export default ListLayoutBrowse

const styles = StyleSheet.create({})