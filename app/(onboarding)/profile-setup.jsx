import { StyleSheet, Text, View , SafeAreaView, TouchableOpacity, TextInput} from 'react-native'
import React, {useState} from 'react'
import { Colors } from '../../constants/Colors'
import { Wrench, Popcorn, ArrowRight, ArrowLeft } from 'lucide-react-native'
import { avatarFallbackCustom } from '../../constants/Images'
import { Image } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'


const ProfileSetup = () => {
    const {role, dept, accountType} = useLocalSearchParams()
    console.log(role)

  return (
    <SafeAreaView className='w-full h-full bg-primary'>
         <View className='px-10 pt-20 gap-3 w-full'>
            <Text className='text-3xl font-bold text-white'>Let's setup your profile</Text>
            <View className=''>
                <TouchableOpacity>
                    <Image
                        source={{ uri:  avatarFallbackCustom }}
                        contentFit='cover'
                        style={{ width:60, height:60, borderRadius:50 }}
                    />
                </TouchableOpacity>
                <View className='gap-10 pt-10'>
                    <View className='flex flex-row gap-3 justify-start items-center'>
                        <TextInput
                             placeholder="Enter first name"
                             placeholderTextColor={Colors.mainGray}
                             style={{backgroundColor:Colors.primaryLight, width:200, paddingVertical:10, paddingHorizontal:15, borderRadius:15}}
                        />
                    </View>
                    <View className='flex flex-row gap-3 justify-start items-center'>
                        <TextInput
                             placeholder="Enter last name"
                             placeholderTextColor={Colors.mainGray}
                             style={{backgroundColor:Colors.primaryLight, width:200, paddingVertical:10, paddingHorizontal:15, borderRadius:15}}
                        />
                    </View>
                    <View className='flex flex-row gap-3 justify-start items-center'>
                        <TextInput
                             placeholder="@username"
                             placeholderTextColor={Colors.mainGray}
                             style={{backgroundColor:Colors.primaryLight, width:200, paddingVertical:10, paddingHorizontal:15, borderRadius:15}}
                        />
                    </View>
                    <View className='flex flex-row gap-3 justify-start items-center'>
                        <TextInput
                             placeholder="Enter city"
                             placeholderTextColor={Colors.mainGray}
                             style={{backgroundColor:Colors.primaryLight, width:200, paddingVertical:10, paddingHorizontal:15, borderRadius:15}}
                        />
                    </View>
                </View>


            </View>
            <TouchableOpacity   style={{opacity : 1}} className='mt-10  self-center rounded-full bg-primaryLight w-[45px] h-[45px] relative justify-center items-center'>
                <View className=''>
                    <ArrowRight color={Colors.newLightGray} />
                </View>
            </TouchableOpacity>
         </View>
    </SafeAreaView>

  )
}

export default ProfileSetup

const styles = StyleSheet.create({})