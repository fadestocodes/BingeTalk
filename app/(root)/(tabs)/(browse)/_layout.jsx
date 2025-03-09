import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { Colors } from '../../../../constants/Colors'

const BrowseLayout = () => {
  return (
    <Stack  >
        <Stack.Screen name='browseHome' options={{headerShown : false}} />
        <Stack.Screen name='movie' options={{headerShown : false}} />
        <Stack.Screen name='list' options={{headerShown : false}} />
        <Stack.Screen name='tv' options={{headerShown : false}} />
        <Stack.Screen name='cast' options={{headerShown : false}} />
        <Stack.Screen name='optionsModal'  options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:200  , borderRadius:30, backgroundColor:Colors.primary }}} />
        <Stack.Screen name='moreInteractions'  options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:400  , borderRadius:30, backgroundColor:Colors.primary }}} />
      <Stack.Screen name='commentsModal'  options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:400  , borderRadius:30, backgroundColor:Colors.primary }}} />
      <Stack.Screen name='addToListModal'  options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:200  , borderRadius:30, backgroundColor:Colors.primary }}} />
      <Stack.Screen name='recommendationModal'  options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:200  , borderRadius:30, backgroundColor:Colors.primary }}} />
      <Stack.Screen name='ratingModal'  options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:100  , borderRadius:30, backgroundColor:Colors.primary }}} />
    
    </Stack>
  )
}

export default BrowseLayout

const styles = StyleSheet.create({})