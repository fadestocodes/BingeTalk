import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { Colors } from '../../../../../constants/Colors'

const ProfileLayout = () => {
  return (
    <Stack screenOptions={{contentStyle:{backgroundColor : Colors.primary}}} >
        <Stack.Screen name='[movieId]' options={{headerShown : false}} />
        <Stack.Screen name='discover' options={{headerShown : false}} />
        <Stack.Screen name='ratings' options={{headerShown : false}} />
    </Stack>
  )
}

export default ProfileLayout

const styles = StyleSheet.create({})