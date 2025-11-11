import { StyleSheet, Text, View, TextInput,  Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useUser, useSignUp } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors'
import {  usernameSchema } from '../../lib/zodSchemas'
import { useLocalSearchParams } from 'expo-router'
import { checkUsername } from '../../api/user'
import debounce from 'lodash.debounce'
import Animated, { Easing, withTiming, useSharedValue, withDelay } from 'react-native-reanimated';
import { useSignUpContext } from '../../lib/SignUpContext'
import ArrowNextButton from '../../components/ui/ArrowNextButton'
import ArrowBackButton from '../../components/ui/ArrowBackButton'


const step2 = () => {

const { signUpData, updateSignUpData } = useSignUpContext()
const [ errors, setErrors ] = useState({});
const [ usernameTakenError, setUsernameTakenError ] = useState('')
const router = useRouter();
const textOpacity = useSharedValue(0);
const textTranslateY = useSharedValue(60);

const inputOpacity = useSharedValue(0);
const inputTranslateY = useSharedValue(60);

useEffect(() => {
  textOpacity.value = withTiming(1, { duration: 400, easing: Easing.ease });
  textTranslateY.value = withTiming(0, { duration: 400, easing: Easing.ease });

  inputOpacity.value = withDelay(800, withTiming(1, { duration: 400, easing: Easing.ease }));
  inputTranslateY.value = withDelay(800, withTiming(0, { duration: 400, easing: Easing.ease }));
}, []);

const checkUsernameAvailability = debounce(async ( value ) => {
  if (value.length > 3){
    try {
      const response = await checkUsername(value);
      if (!response.available){
        setUsernameTakenError(response.message)
      } else {
        setUsernameTakenError('')
      }
    } catch (err) {
      console.log(err)
    }
  }
}, 300)

const handleInputs = ( name, value ) => {
  updateSignUpData(prev => ({
    ...prev,
    [name]: value
  }))
  const results = usernameSchema.safeParse( { username: signUpData.username } )
  if (!results.success) {
    const errorObj = results.error.format();
    setErrors( prev => ({
        ...prev,
        [name]: errorObj.username ? errorObj.username._errors : undefined,
      }) )
      
    } else {
      setErrors( prev => ({
        ...prev,
        [name] : undefined
    }) )
    checkUsernameAvailability(value);
  }




}


const onSetup2Press = async () => {
  const res = await checkUsername(signUpData.username)
  if (res.available){
    setUsernameTakenError('')
    router.push('/step3-email');
  }
}



  return (
    <SafeAreaView className='w-full h-full flex-1 flex  bg-primary' style ={{height:'100%', width:'100%' , justifyContent:'center', alignItems:'center'}}>
      <KeyboardAvoidingView
        style={{ flex: 1, width:'100%', height:'100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView  className='bg-primary' style={{ width:'100%', height:'100%' }}>
          <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} style={{width:'100%', height:'100%'}}>
            <View className='w-full justify-center items-center' >

            <View  style={{ justifyContent:'center', alignItems:'center', height:'100%', height:'100%', paddingTop:100,paddingHorizontal:50 ,  backgroundColor:Colors.primary, gap:15 }} >
            <Animated.View style={[styles.animatedText, { opacity: textOpacity, transform: [{ translateY: textTranslateY }] , justifyContent:'center', alignItems:'center', gap:10, marginBottom:50}]}>
                  
                  <View className='justify-center items-center gap-3 ' >
                      <Text className='text-xl text-secondary font-pcourier  uppercase'>Bingeable</Text>
                      <Text className='font-pcourier text-white ' >Alright {signUpData.firstName}, let's create your unique username</Text>
                  </View>
                  </Animated.View>

            <Animated.View style={[styles.animatedText, { opacity: inputOpacity, transform: [{ translateY: inputTranslateY }] , gap:10}]}>

                 
                  <Text className='text-white font-pbold text-2xl self-center '>Create your username.</Text>
        <View className='items-start'>

        { errors.username && errors.username.map( (item, index) => (
            <View key={index} >
                <Text className='text-red-400 text-sm text-start'>* {item}</Text>
            </View>
            )) 
        }
        { usernameTakenError && (
           <View  >
            <Text className='text-red-400 text-sm text-start'>* {usernameTakenError}</Text>
           </View>
        ) }
        </View>
            <TextInput
              value={signUpData.username}
              autoCapitalize='none'
              autoCorrect={false}
              placeholder="Enter username"
              placeholderTextColor={Colors.mainGray}
              style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
              onChangeText={(text) => handleInputs('username', text)}
            />

              {/* <TouchableOpacity onPress={onSetup2Press}   disabled={Object.values(errors).some((error) => error?.length > 0) || !signUpData.username || !!usernameTakenError } >
                <Text className='text-secondary text-lg font-psemibold self-center'>Next</Text>
              </TouchableOpacity> */}

              <View className='pt-10 flex-row self-center gap-3'>
                <ArrowBackButton onPress={()=>router.back()} />
                <ArrowNextButton onPress={onSetup2Press} disabled={Object.values(errors).some((error) => error?.length > 0) || !signUpData.username || !!usernameTakenError }/>
              </View>
              </Animated.View>
            </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>

  )
}

export default step2

const styles = StyleSheet.create({})