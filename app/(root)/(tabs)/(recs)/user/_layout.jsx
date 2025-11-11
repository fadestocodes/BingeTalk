import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const RecsUserLayout = () => {
  return (
    <Stack  >
        <Stack.Screen name='recommendations' options={{headerShown : false}} />
        <Stack.Screen name='[userId]' options={{headerShown : false}} />
    </Stack>
  )}

  export default RecsUserLayout