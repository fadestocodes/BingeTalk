import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'

const HelpPage = () => {
  return (
    <SafeAreaView className='w-full h-full bg-primary' style={{borderRadius:30}}>
    <ScrollView>
<View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20, alignSelf:'center' }} />
<View style={{paddingHorizontal:30, paddingBottom:150, paddingTop:70, gap:12, borderRadius:30}}>

<View className='gap-3 '>
    <Text className='text-white font-pbold text-3xl'>Help</Text>
    <Text className='text-white'>For support please reach out via email: hello@bingeable.app</Text>
  
</View>
</View>
</ScrollView>
</SafeAreaView>
  )
}

export default HelpPage

const styles = StyleSheet.create({})