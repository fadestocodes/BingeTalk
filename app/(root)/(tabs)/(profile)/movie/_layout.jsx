import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const MovieLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='[movieId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default MovieLayout

const styles = StyleSheet.create({})