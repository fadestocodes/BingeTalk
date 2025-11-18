import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient';
import NotificationModal from '../ui/NotificationModal';


const NotificationPromptUI = ({handleNo, handleYes}) => {
  return (
    // <View style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} className="absolute inset-0  justify-center items-center pt-6">
    //   <View className="bg-primary rounded-3xl gap-3 pt-12 w-10/12 max-w-md relative items-center">
    //         {/* Circle */}
    //         <LinearGradient
    //             colors={['#454242', '#171717']}
    //             style={{
    //             width: 75,
    //             height: 75,
    //             borderRadius: 37.5,
    //             justifyContent: 'center',
    //             alignItems: 'center',
    //             shadowColor: '#000',
    //             shadowOffset: { width: 0, height: 4 },
    //             shadowOpacity: 0.3,
    //             shadowRadius: 4,
    //             elevation: 5,
    //             marginBottom: 20, // push content below
    //             }}
    //         >
    //             <Image
    //             source={require('../../assets/images/icon-adaptive.png')}
    //             width={50}
    //             height={50}
    //             alt="bingeable-logo"
    //             />
    //         </LinearGradient>

    //         {/* Text */}
    //         <Text className="text-2xl font-bold text-mainGray px-8 text-center">Turn On Notifications</Text>
    //         <Text className="text-newLightGray px-8  mb-6 text-center">
    //             We recommend you turn on notifications so you don't miss out when your friends send you a recommendation, have new followers, etc.
    //         </Text>

    //         {/* Buttons */}
    //         <View className="w-full">
    //             <View className="h-[1px] w-full bg-primaryLight" />
    //                 <TouchableOpacity onPress={handleYes} className="py-6">
    //                 <Text className="text-secondary font-bold self-center">Turn On</Text>
    //             </TouchableOpacity>

    //             <View className="h-[1px] w-full bg-primaryLight" />
    //                 <TouchableOpacity onPress={handleNo} className="py-6">
    //                 <Text className="text-mainGray self-center">Not Now</Text>
    //                 </TouchableOpacity>
    //         </View>
    //     </View>
    // </View>
    <NotificationModal 
        title="Turn On Notifications"
        description="We recommend you turn on notifications so you don't miss out when your friends send you a recommendation, have new followers, etc."
        yesText="Turn On"
        handleYes={handleYes}
        handleNo={handleNo}
        noText="Not Now"
        showLogo={true}
        darkenBg={true}
    />
  )
}

export default NotificationPromptUI

const styles = StyleSheet.create({})