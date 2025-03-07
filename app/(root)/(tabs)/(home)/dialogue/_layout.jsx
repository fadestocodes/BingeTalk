import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const DialogueLayoutProfile = () => {
  return (
    <Stack>
      <Stack.Screen name='[dialogueId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default DialogueLayoutProfile

const styles = StyleSheet.create({})