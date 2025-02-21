import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const EditProfileLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='editProfile' options={{headerShown : false}} />
      <Stack.Screen name='editRotation' options={{headerShown : false}} />
    </Stack>
  )
}

export default EditProfileLayout

const styles = StyleSheet.create({})