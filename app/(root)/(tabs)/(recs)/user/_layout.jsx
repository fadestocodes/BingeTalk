import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { Colors } from '../../../../../constants/Colors'

const RecsUserLayout = () => {
  return (
    <Stack  >
        <Stack.Screen name='recommendations' options={{headerShown : false}} />
        <Stack.Screen name='dialogues' options={{headerShown : false}} />
        <Stack.Screen name='[userId]' options={{headerShown : false}} />
        <Stack.Screen name='lists' options={{headerShown : false}} />
        <Stack.Screen name='recentlyWatched' options={{headerShown : false}} />
        <Stack.Screen name='userRatings' options={{headerShown : false}} />
        <Stack.Screen name='followersPage' options={{headerShown : false}} />
        <Stack.Screen name='account' options={{headerShown : false}} />
        <Stack.Screen name='blockUserModal' options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:400  , borderRadius:30, backgroundColor:Colors.primary }}}  />

    
    </Stack>
  )}

  export default RecsUserLayout