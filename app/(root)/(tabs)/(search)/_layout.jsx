import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const ProfileLayout = () => {
  return (
    <Stack  >
        <Stack.Screen name='searchHome' options={{headerShown : false}} />
        <Stack.Screen name='movie' options={{headerShown : false}} />
        <Stack.Screen name='tv' options={{headerShown : false}} />
        <Stack.Screen name='cast' options={{headerShown : false}} />
        <Stack.Screen name='threads' options={{headerShown : false}} />
        <Stack.Screen name='explore' options={{headerShown : false}} />
        <Stack.Screen name='user' options={{headerShown : false}} />
    </Stack>
  )
}

export default ProfileLayout

const styles = StyleSheet.create({})