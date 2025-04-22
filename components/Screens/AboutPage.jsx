import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { BackIcon } from '../../assets/icons/icons'
import { useRouter } from 'expo-router'

const AboutPage = () => {
    const router = useRouter()
  return (
    <SafeAreaView className='w-full h-full bg-primary'>
    <ScrollView>
<View style={{paddingHorizontal:15, paddingBottom:150, gap:12}}>
<View className='gap-3 '>
     <TouchableOpacity onPress={()=>router.back()} style={{}}>
        <BackIcon size={22} color={Colors.mainGray} />
    </TouchableOpacity>
    <View className='flex w-full gap-2 justify-start items-start'>

      <Text className='text-white font-pbold text-3xl'>About</Text>
      <Text className='' style={styles.updatedText}></Text>

    </View>
</View>
<View className="">
  <Text className="text-white text-lg font-semibold mb-2">
    Bingeable connects film lovers in a fun, interactive way.
  </Text>

  <Text className="text-gray-300 text-base mb-4">
    Discover what to watch next, send recommendations, and discuss your favorite content with friends and a like-minded community.
  </Text>

  <Text className="text-white text-lg font-semibold mb-2">Features</Text>

  <Text className="text-gray-300 text-base mb-2">
    <Text className="font-semibold text-white">🎯 Personalized Recommendations:</Text> Send recommendations to your friends about your latest binge, which they can save to one of their lists.
  </Text>

  <Text className="text-gray-300 text-base mb-2">
    <Text className="font-semibold text-white">💬 Dialogues & Threads:</Text> Share your thoughts for your friends to see with Dialogue posts, or create a Thread about a particular film, show, or cast/crew member where anyone can join the conversation.
  </Text>

  <Text className="text-gray-300 text-base mb-4">
    <Text className="font-semibold text-white">⭐ Ratings:</Text> See ratings for a film/show based on the overall average, or from just your friends for a more relevant review.
  </Text>

  <Text className="text-white text-base">
    Bingeable makes it easy to stay updated, find new content, and engage with fellow fans. Whether you're catching up on a series or diving into a movie marathon, Bingeable has you covered.
  </Text>
</View>

</View>
</ScrollView>
</SafeAreaView>
  )
}

export default AboutPage

const styles = StyleSheet.create({})