import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const ProfileLayout = () => {
  return (
    <Stack  >
        <Stack.Screen name='[movieId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default ProfileLayout

const styles = StyleSheet.create({})