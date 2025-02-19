import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const DialogueLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='[dialogueId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default DialogueLayout

const styles = StyleSheet.create({})