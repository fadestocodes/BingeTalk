import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const UserLayoutBrowse = () => {
  return (
    <Stack  >
        <Stack.Screen name='[userId]' options={{headerShown : false}} />
        <Stack.Screen name='followersPage' options={{headerShown : false}} />
        <Stack.Screen name='account' options={{headerShown : false}} />
        <Stack.Screen name='userRatings' options={{headerShown : false}} />
    </Stack>
  )
}

export default UserLayoutBrowse

const styles = StyleSheet.create({})