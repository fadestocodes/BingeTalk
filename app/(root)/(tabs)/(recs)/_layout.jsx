import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { Colors } from '../../../../constants/Colors'

const ProfileLayout = () => {
  return (
    <Stack  >
        <Stack.Screen name='recsHome' options={{headerShown : false}} />
        <Stack.Screen name='movie' options={{headerShown : false}} />
        <Stack.Screen name='user' options={{headerShown : false}} />
        <Stack.Screen name='cast' options={{headerShown : false}} />
        <Stack.Screen name='activity' options={{headerShown : false}} />
        <Stack.Screen name='dialogue' options={{headerShown : false}} />
        <Stack.Screen name='list' options={{headerShown : false}} />
        <Stack.Screen name='review' options={{headerShown : false}} />
        <Stack.Screen name='tv' options={{headerShown : false}} />
    </Stack>
  )}