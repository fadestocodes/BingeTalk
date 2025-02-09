import {  Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import {BackIcon} from '../../../../assets/icons/icons'

const CastIdPage = () => {

    const params = useLocalSearchParams();
    const castId = params.castId;
    console.log('cast id is ', castId);
    const router = useRouter();

    const backPress = () => {
        console.log('pressed')
        router.back()
    }

  return (
    <SafeAreaView className='bg-primary h-full px-8 pt-4 flex gap-4' >
        <TouchableOpacity className='border-white border-2 rounded-lg w-12 flex items-center'  onPress={backPress}>
            <BackIcon className='' color='white'  size='24'/>
        </TouchableOpacity>
      <View>
        <Text className='text-third text-3xl font-pbold'>CastIdPage</Text>
    </View>
    </SafeAreaView>
  )
}

export default CastIdPage


CastIdPage.options = {
    headerShown: false,  // Optional: Hide header if not needed
  };