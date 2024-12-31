import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const profile = () => {
  return (
    <SafeAreaView className='flex justify-center items-center w-full h-full bg-primary' >
      <View className='flex justify-center items-center'>
          <Text className='text-secondary font-pblack text-3xl'>BingeTalk</Text>
          <Text className='text-third font-psemibold leading-8'>Discover, share, binge.</Text>
      </View>
    </SafeAreaView>
  )
}

export default profile
