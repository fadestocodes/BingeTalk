import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const ListLayoutBrowse = () => {
  return (
    <Stack  >
        <Stack.Screen name='[listId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default ListLayoutBrowse

const styles = StyleSheet.create({})