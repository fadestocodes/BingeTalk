import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../../../../../../constants/Colors'

const EditList = () => {
  return (
    <Stack screenOptions={{contentStyle:{backgroundColor : Colors.primary}}}>
      <Stack.Screen name='[listId]' options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:0  , borderRadius:30, backgroundColor:Colors.primary }}} />
    </Stack>
  )
}

export default EditList

const styles = StyleSheet.create({})