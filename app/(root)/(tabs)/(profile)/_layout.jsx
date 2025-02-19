import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { Colors } from '../../../../constants/Colors'

const ProfileLayout = () => {
  return (
    <Stack  >
        <Stack.Screen name='[userId]' options={{headerShown : false}} />
        <Stack.Screen name='settings' options={{headerShown : false}} />
        <Stack.Screen name='movie' options={{headerShown : false}} />
        <Stack.Screen name='tv' options={{headerShown : false}} />
        <Stack.Screen name='cast' options={{headerShown : false}} />
        <Stack.Screen name='threads' options={{headerShown : false}} />
        <Stack.Screen name='dialogue' options={{headerShown : false}} />
        <Stack.Screen name='commentsModal'  options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:200  , borderRadius:30, backgroundColor:Colors.primary }}} />
    </Stack>
  )
}

export default ProfileLayout

const styles = StyleSheet.create({})