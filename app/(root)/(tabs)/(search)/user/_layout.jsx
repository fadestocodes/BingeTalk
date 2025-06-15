import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const UserIdPage = () => {
  return (
    <Stack>
      <Stack.Screen name='[userId]' options={{headerShown : false}} />
      <Stack.Screen name='followersPage' options={{headerShown : false}} />
      <Stack.Screen name='account' options={{headerShown : false}} />
      <Stack.Screen name='userRatings' options={{headerShown : false}} />
    </Stack>
  )
}

export default UserIdPage

const styles = StyleSheet.create({})