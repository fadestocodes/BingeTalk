import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../../../../../constants/Colors'

const UserLayoutHome = () => {
  return (
    <Stack>
      <Stack.Screen name='[userId]' options={{headerShown : false}} />
      <Stack.Screen name='followersPage' options={{headerShown : false}} />
      <Stack.Screen name='account' options={{headerShown : false}} />
      <Stack.Screen name='userRatings' options={{headerShown : false}} />
      <Stack.Screen name='recommendations' options={{headerShown : false}} />
      <Stack.Screen name='blockUserModal' options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:400  , borderRadius:30, backgroundColor:Colors.primary }}}  />

    </Stack>
  )
}

export default UserLayoutHome

const styles = StyleSheet.create({})