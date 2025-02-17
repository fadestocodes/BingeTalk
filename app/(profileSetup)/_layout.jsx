import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const ProfileSetup = () => {
  return (
    <Stack >
      <Stack.Screen name='profile1' options={{headerShown : false, gestureEnabled:false}} />
      <Stack.Screen name='profile2' options={{headerShown : false}} />
    </Stack>
  )
}

export default ProfileSetup

const styles = StyleSheet.create({})