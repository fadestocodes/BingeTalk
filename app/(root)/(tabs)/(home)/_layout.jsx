import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='homeIndex' options={{headerShown : false}} />
      <Stack.Screen name='movie' options={{headerShown : false}} />
      <Stack.Screen name='tv' options={{headerShown : false}} />
      <Stack.Screen name='cast' options={{headerShown : false}} />
      <Stack.Screen name='threads' options={{headerShown : false}} />
    </Stack>
  )
}

export default HomeLayout

const styles = StyleSheet.create({})