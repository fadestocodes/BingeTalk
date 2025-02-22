import { StyleSheet, Text, View } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { Colors } from '../../../../constants/Colors'
import { TagsProvider } from '../../../../lib/TagsContext'

const CreateLayout = () => {
  return (
    <TagsProvider>
    <Stack  >
        <Stack.Screen name='createHome' options={{headerShown : false}} />
        <Stack.Screen name='tagOptionsModal'options={{headerShown : false, presentation:'modal', contentStyle:{  marginTop:200  , borderRadius:30, backgroundColor:Colors.primary }}}  />
    </Stack>
    </TagsProvider>
  )
}

export default CreateLayout

const styles = StyleSheet.create({})