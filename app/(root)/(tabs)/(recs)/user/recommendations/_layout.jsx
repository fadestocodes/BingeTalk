

import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const RecsUserRecommendationsLayout = () => {
  return (
    <Stack  >
        <Stack.Screen name='[recommendationId]' options={{headerShown : false}} />
    </Stack>
  )}

  export default RecsUserRecommendationsLayout