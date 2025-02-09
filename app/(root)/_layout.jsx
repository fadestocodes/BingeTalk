import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const RootLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='(tabs)' options={{headerShown : false}} />
        {/* <Stack.Screen name='(profile)' options={{headerShown : false}} /> */}
        {/* <Stack.Screen name='movie' options={{headerShown : false}} /> */}
        {/* <Stack.Screen name='castOrCrew' options={{headerShown : false, tabBarStyle : {display : 'flex'}}  } /> */}
        
    </Stack>
  )
}

export default RootLayout

const styles = StyleSheet.create({})