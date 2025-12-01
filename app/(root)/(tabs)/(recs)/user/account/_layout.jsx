import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
// import { Colors } from '../../../../../../constants/Colors'
import { Colors } from '../../../../../../constants/Colors'

const UserLayoutProfile = () => {
  return (
    <Stack screenOptions={{contentStyle:{backgroundColor : Colors.primary}}}>
      <Stack.Screen name='accountHome' options={{headerShown : false}} />
      <Stack.Screen name='about' options={{headerShown : false}} />
      <Stack.Screen name='privacy' options={{headerShown : false}} />
      <Stack.Screen name='blockedUsers' options={{headerShown : false}} />
      <Stack.Screen name='blockUserModal' options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:200  , borderRadius:30, backgroundColor:Colors.primary }}} />
      <Stack.Screen name='deleteAccount'  options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:400  , borderRadius:30, backgroundColor:Colors.primary }}} />
      <Stack.Screen name='help'  options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:400  , borderRadius:30, backgroundColor:Colors.primary }}} />

    </Stack>
  )
}

export default UserLayoutProfile

const styles = StyleSheet.create({})