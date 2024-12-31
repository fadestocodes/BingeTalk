import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const search = () => {
  return (
    <SafeAreaView className='w-full h-full justify-center items-center bg-primary'>
      <Text className='text-white'>Search</Text>
    </SafeAreaView>
  )
}

export default search
