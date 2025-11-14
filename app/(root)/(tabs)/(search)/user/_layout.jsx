import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../../../../../constants/Colors'

const UserIdPage = () => {
  return (
    <Stack screenOptions={{contentStyle:{backgroundColor : Colors.primary}}}>
      <Stack.Screen name='[userId]' options={{headerShown : false}} />
      <Stack.Screen name='dialogues' options={{headerShown : false}} />
      <Stack.Screen name='lists' options={{headerShown : false}} />
      <Stack.Screen name='recentlyWatched' options={{headerShown : false}} />
      <Stack.Screen name='followersPage' options={{headerShown : false}} />
      <Stack.Screen name='account' options={{headerShown : false}} />
      <Stack.Screen name='userRatings' options={{headerShown : false}} />
    </Stack>
  )
}

export default UserIdPage

const styles = StyleSheet.create({})