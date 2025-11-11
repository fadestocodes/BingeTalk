import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { Colors } from '../../constants/Colors'

const Onboarding = () => {
  return (
    <Stack>
      <Stack.Screen name='step1' options={{headerShown : false}} />
      <Stack.Screen name='profile-setup' options={{headerShown : false}} />
      <Stack.Screen name='recentlyWatched' options={{headerShown : false}} />
      <Stack.Screen name='film-role' options={{headerShown : false}} />
      <Stack.Screen name='step1-firstName' options={{headerShown : false}} />
      <Stack.Screen name='step2-username' options={{headerShown : false}} />
      <Stack.Screen name='step3-email' options={{headerShown : false}} />
      <Stack.Screen name='step4-password' options={{headerShown : false}} />
      <Stack.Screen name='step5-confirmPassword' options={{headerShown : false}} />
      <Stack.Screen name='termsPage'  options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:100  , borderRadius:30, backgroundColor:Colors.primary }}} />
      <Stack.Screen name='privacyPage'  options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:100  , borderRadius:30, backgroundColor:Colors.primary }}} />

    </Stack>
  )
}

export default Onboarding

const styles = StyleSheet.create({})