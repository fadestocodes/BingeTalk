import { View, Text, Modal, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { Image } from 'expo-image'

const WhatsNewModal = ({handleClose}) => {
  return (
      <Modal  animationType="slide" transparent={false}>
        <View className="flex-1 pt-14 pb-36 p-6 " style={{backgroundColor:Colors.mainGrayDark}}> 
            <ScrollView contentContainerStyle={{  gap:10 }} showsVerticalScrollIndicator={false}>

                    <View className="gap-2 pb-6">
                        <Text className="text-3xl font-bold mb-4 text-white pt-[50px]" >🎉 What’s New in v.1.3.0</Text>
                        <Text className="text-white mb-3  font-medium">• NEW FEATURE: You can now write Reviews! Just rate a title like before, then add a Review to it.</Text>
                        <Text className="text-white mb-3  font-medium">• NEW FEATURE: Submit feedback. Under Profile > Account > Submit your feedback, you can write to us if you have any thoughts on how to improve Bingeable.</Text>
                        <Text className="text-white mb-3  font-medium">• NEW: Browse and watch new movie trailers in the Search tab.</Text>
                        <Text className="text-white mb-3  font-medium">• NEW: Discover users with a distinct taste in the Search tab.</Text>
                        <Text className="text-white mb-3  font-medium">• Improved performance</Text>
                        <Text className="text-white mb-3  font-medium">• UI enhancements and bug fixes</Text>
                    </View>  
                    <View style={{ width: 300, height: 250, overflow: 'hidden', borderRadius:15 }}>
                        <Image
                        source={require('../../assets/images/screenshots/ratingToReview.jpg')}
                        contentFit="cover"
                        style={{
                            width: 300,
                            height: 300, // Taller than the container
                            marginTop: -30, // Push content up inside the box
                        }}
                        />
                    </View>
                    <View style={{ width: 300, height: 400, overflow: 'hidden', borderRadius:15 }}>
                        <Image
                        source={require('../../assets/images/screenshots/reviewPage.jpg')}
                        contentFit="cover"
                        style={{
                            width: 300,
                            height: 500, // Taller than the container
                            marginTop: 0, // Push content up inside the box
                        }}
                        />
                    </View>

            {/* Add as many features as needed */}
            </ScrollView>

        <View className="absolute bottom-16 left-0 right-0 px-6">
          <TouchableOpacity onPress={handleClose} className="bg-secondary py-4  items-center" style={{borderRadius:25}}>
            <Text className="text-primary font-semibold text-lg">Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>    
      </Modal>
  )
}

export default WhatsNewModal