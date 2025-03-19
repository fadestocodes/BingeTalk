import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const UserLayoutProfile = () => {
  return (
    <Stack>
      <Stack.Screen name='[userId]' options={{headerShown : false}} />
      <Stack.Screen name='followersPage' options={{headerShown : false}} />
    </Stack>
  )
}

export default UserLayoutProfile

const styles = StyleSheet.create({})