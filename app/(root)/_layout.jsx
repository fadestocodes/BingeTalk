import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../../constants/Colors'

const RootLayout = () => {
  return (
<Stack screenOptions={{contentStyle:{backgroundColor : Colors.primary}}}>
        <Stack.Screen name='(tabs)' options={{headerShown : false, contentStyle : {backgroundColor:Colors.primary}}}  />
        {/* <Stack.Screen name='(profile)' options={{headerShown : false}} /> */}
        {/* <Stack.Screen name='movie' options={{headerShown : false}} /> */}
        {/* <Stack.Screen name='castOrCrew' options={{headerShown : false, tabBarStyle : {display : 'flex'}}  } /> */}
        
    </Stack>
  )
}

export default RootLayout

const styles = StyleSheet.create({})