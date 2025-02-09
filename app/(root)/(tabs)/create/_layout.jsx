import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const CreateLayout = () => {
  return (
    <Stack  >
        <Stack.Screen name='createHome' options={{headerShown : false}} />
    </Stack>
  )
}

export default CreateLayout

const styles = StyleSheet.create({})