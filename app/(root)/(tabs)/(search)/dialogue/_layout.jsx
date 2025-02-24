import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const DialogueLayout = () => {
  return (
    <Stack  >
        <Stack.Screen name='[dialogueId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default DialogueLayout

const styles = StyleSheet.create({})