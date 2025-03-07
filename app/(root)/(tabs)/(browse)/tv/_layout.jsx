import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const TVLayoutBrowse = () => {
  return (
    <Stack  >
        <Stack.Screen name='[tvId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default TVLayoutBrowse

const styles = StyleSheet.create({})