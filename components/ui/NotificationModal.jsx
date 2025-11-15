import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../../constants/Colors'
import { Image } from 'expo-image'
const NotificationModal = ({ darkenBg, showLogo, title, description, yesText, handleYes, noText, handleNo }) => {
  return (
    
    <View style={{ backgroundColor: darkenBg ? 'rgba(0,0,0,0.6)' : 'transparent' }} className="absolute inset-0  justify-center items-center pt-6">
    <View style={{backgroundColor: darkenBg ? Colors.primary : Colors.primaryDark}} className="bg-primary rounded-3xl gap-3 pt-12 w-10/12 max-w-md relative items-center">

        { showLogo && (
          <LinearGradient
              colors={['#454242', '#171717']}
              style={{
              width: 75,
              height: 75,
              borderRadius: 37.5,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
              marginBottom: 20, // push content below
              }}
          >
              <Image
              source={require('../../assets/images/icon-adaptive.png')}
              width={50}
              height={50}
              alt="bingeable-logo"
              />
          </LinearGradient>

        ) }
        
        { title && (
            <Text className="text-2xl font-bold text-mainGray px-8 text-center">{title}</Text>
        ) }

        { description && (
          <Text className="text-newLightGray px-8  mb-6 text-center">
              {description}
          </Text>
        ) }          


          <View className="w-full">
              <View className="h-[1px] w-full bg-primaryLight" />
                  <TouchableOpacity onPress={handleYes} className="py-6">
                  <Text className="text-secondary font-bold self-center">{yesText}</Text>
              </TouchableOpacity>

                {noText && (
                    <>
                        <View className="h-[1px] w-full bg-primaryLight" />
                        <TouchableOpacity onPress={handleNo} className="py-6">
                        <Text className="text-mainGray self-center">{noText}</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
      </View>
  </View>
  )
}

export default NotificationModal

const styles = StyleSheet.create({})