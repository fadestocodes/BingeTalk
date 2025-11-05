import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FacebookIcon, GoogleIcon } from '../assets/icons/icons'
import { Colors } from '../constants/Colors'
import { User } from 'lucide-react-native'

const SigninComponent = () => {
  return (
    <View className='flex flex-col gap-2'>
      <TouchableOpacity className='w-[300px] px-4 py-3 rounded-2xl bg-primary flex flex-row justify-center items-center gap-3 relative'>
        <FacebookIcon color={Colors.lightGray} size={20}  className='absolute left-5'/>
        <Text className='text-mainGray font-semibold'>Continue with Facebook</Text>
      </TouchableOpacity>
     
      <TouchableOpacity className='w-[300px] px-4 py-3 rounded-2xl bg-primary flex flex-row justify-center items-center gap-3 relative'>
        <GoogleIcon color={Colors.lightGray} size={20} className='absolute left-5'/>
        <Text className='text-mainGray font-semibold'>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity className='w-[300px] px-4 py-3 rounded-2xl bg-primary flex flex-row justify-center items-center gap-3 relative'>
        <User color={Colors.lightGray} size={20} style={{position:'absolute', left:14}}/>
        <Text className='text-mainGray font-semibold'>Use email or username</Text>
      </TouchableOpacity>
        <TouchableOpacity className='pt-6 justify-center items-center'>
            <Text className='text-mainGray'>Don't have an account? Sign up</Text>
        </TouchableOpacity>
    </View>
  )
}

export default SigninComponent

const styles = StyleSheet.create({})