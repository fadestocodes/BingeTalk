import { StyleSheet, Text, View, TextInput,  Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, {useState} from 'react'
import { useRouter } from 'expo-router'
import { useUser, useSignUp } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors'
import { signupSchema, signupConfirmPasswordSchema } from '../../lib/zodSchemas'
import { useLocalSearchParams } from 'expo-router'
import { pickSingleImage } from '../../lib/pickImage'
import { PlusIcon } from '../../assets/icons/icons'


const step6 = () => {

    const { user } = useUser();
    console.log(user)

    const [ image, setImage ] = useState('');
    const [ loadingImage, setLoadingImage ] = useState(false);

    const handleUpload = () => {
      pickSingleImage( setImage, setLoadingImage );
    }



  return (
    <SafeAreaView className='w-full h-full   bg-primary' style ={{height:'100%', height:'100%' , justifyContent:'center', alignItems:'center'}}>
    <KeyboardAvoidingView
   style={{ flex: 1, width:'100%', height:'100%' }}
   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
 >
   <ScrollView  className='bg-primary' style={{ width:'100%', height:'100%' }}>
 <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} style={{width:'100%', height:'100%'}}>
   <View  style={{ justifyContent:'center', alignItems:'center', height:'100%', height:'100%', paddingTop:150,paddingHorizontal:50 ,  backgroundColor:Colors.primary, gap:15 }} >
        <View className='justify-center items-center gap-3 mb-5' >
            <Text className='text-xl text-secondary font-pcourier  uppercase'>BingeTalk</Text>
            <Text className='font-pcourier text-white ' >Welcome aboard {user.firstName}!</Text>
        </View>
        <View className='justify-center items-center gap-3' >
            <Text className='text-xl text-secondary font-pcourier uppercase '>BingeTalk (cont.)</Text>
            <Text className='font-pcourier text-white' >Let's go through a few steps to setup your profile, it won't take long.</Text>
        </View>
        <View className='w-full justify-center items-center'>
          { image ? (
            <Image
              source={{ uri: image }} style={{ width: 300, height:200, borderRadius:10,  }} resizeMode="cover" 
            />           
          ) : loadingImage ?  (
            <View>
              <ActivityIndicator></ActivityIndicator>
            </View>
          ) : (
            <View className='w-full' style={{ justifyContent:'center', alignItems:'center' }}>
              <TouchableOpacity onPress={handleUpload}   >
                <PlusIcon color={Colors.secondary} size={50} ></PlusIcon>
              </TouchableOpacity>
            </View>
          ) }
        </View>

    </View>
</TouchableWithoutFeedback>
</ScrollView>
</KeyboardAvoidingView>
</SafeAreaView>

  )
}

export default step6

const styles = StyleSheet.create({})