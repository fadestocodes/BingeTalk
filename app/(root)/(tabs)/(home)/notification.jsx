import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'

const Notification = () => {


  return (
    <SafeAreaView className='w-full h-full bg-primary'>
     
    <View className='w-full  pt-3 px-6 gap-5' style={{paddingBottom:200}}>
      <View className="gap-3">
          <View className='flex-row gap-2 justify-start items-center'>

            {/* <TVIcon size={30} color='white' /> */}
            <Text className='text-white font-pbold text-3xl'>Notifications</Text>
          </View>
          <Text className='text-mainGray font-pmedium'>Check out the most bingeable shows right now.</Text>
      </View>
      {/* <TouchableOpacity  style={{ position:'absolute', top:0, right:30 }}>
        <Image
          source={{ uri: ownerUser.profilePic }}
          contentFit='cover'
          style={{ width:30, height:30, borderRadius:50 }}
        />
      </TouchableOpacity> */}

      <View className='w-full my-2 gap-3' style={{paddingBottom:100}}>
        </View>
        </View>
        </SafeAreaView>
  )
}

export default Notification

const styles = StyleSheet.create({})