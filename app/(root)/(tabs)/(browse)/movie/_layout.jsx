import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const MovieLayoutBrowse = () => {
  return (
    <Stack  >
        <Stack.Screen name='[movieId]' options={{headerShown : false}} />
    </Stack>
  )
}

export default MovieLayoutBrowse

const styles = StyleSheet.create({})