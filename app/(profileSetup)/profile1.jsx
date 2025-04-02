import { StyleSheet, Text, View, TextInput,  Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Image, ImageBackground } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useRouter } from 'expo-router'
import { useUser, useSignUp } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors'
import { signupSchema, signupConfirmPasswordSchema } from '../../lib/zodSchemas'
import { useLocalSearchParams } from 'expo-router'
import { pickSingleImage } from '../../lib/pickImage'
import { PlusIcon } from '../../assets/icons/icons'
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'
import { useUserDB } from '../../lib/UserDBContext'
import Animated, { Easing, withTiming, useSharedValue, withDelay } from 'react-native-reanimated';




const profile1 = () => {

    const { user } = useUser();
    const { userDB, updateUserDB } = useUserDB();
    const router = useRouter()
    const [ image, setImage ] = useState('');
    const [ loadingImage, setLoadingImage ] = useState(false);
    const [ inputs, setInputs] = useState({
        bio : '',
        bioLink : ''
    })


    const textOpacity = useSharedValue(0);
    const textTranslateY = useSharedValue(60);

    const text2Opacity = useSharedValue(0);
    const text2TranslateY = useSharedValue(60);
  
    const inputOpacity = useSharedValue(0);
    const inputTranslateY = useSharedValue(60);

    useEffect(() => {
      textOpacity.value = withTiming(1, { duration: 400, easing: Easing.ease });
      textTranslateY.value = withTiming(0, { duration: 400, easing: Easing.ease });
  
      text2Opacity.value = withDelay(  800,withTiming(1, { duration: 400, easing: Easing.ease }));
      text2TranslateY.value = withDelay(  800,withTiming(0, { duration: 400, easing: Easing.ease }));
  
      inputOpacity.value = withDelay(1600, withTiming(1, { duration: 400, easing: Easing.ease }));
      inputTranslateY.value = withDelay(1600, withTiming(0, { duration: 400, easing: Easing.ease }));
    }, []);
  

    const navigation = useNavigation();

    const handleUpload = () => {
      pickSingleImage( setImage, setLoadingImage );
    }

    const handleContinue = () => {

      let normalizedURL = ''
      if (inputs.bioLink !== ''){

        let bioLink = inputs.bioLink.trim(); // Trim any leading/trailing spaces
  
        // Step 1: Check if URL has a protocol (http:// or https://)
        if (!/^https?:\/\//i.test(bioLink)) {
            // Step 2: Check if the URL has 'www.' prefix
            if (/^www\./i.test(bioLink)) {
                // If 'www.' is present, prepend 'https://'
                bioLink = 'https://' + bioLink;
            } else {
                // Otherwise, prepend 'https://'
                bioLink = 'https://www.' + bioLink;
            }
        }
        normalizedURL = new URL(bioLink).toString();
      }
        
        router.push({
            pathname:'/profile2',
            params : {  bio:inputs.bio, bioLink:normalizedURL , image }
          })
        }

    const handleInputs = (name, value) => {
        setInputs( prev => ({
            ...prev,
            [name] : value
        }) )

    }



  return (
    <KeyboardAvoidingView
   style={{ flex: 1, width:'100%', height:'100%' }}
   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
 >
   <ScrollView  className='bg-primary ' style={{ width:'100%', height:'100%' }}>
   <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} style={{width:'100%', height:'100%'}}>
    <View>
    { image ? (
      <View className='justify-center items-center flex gap-3 relative'>
       <ImageBackground
          className='top-0'
          style={{width : '100%', height: 400, position:'absolute', top:0}}
          source={{ uri:image }}
          resizeMethod='cover'
          
          >
          <LinearGradient 
              colors={[ 'transparent',Colors.primary]} 
              style={{height : '100%', width : '100%'}}>
          </LinearGradient>
      </ImageBackground>
      <TouchableOpacity  onPress={handleUpload} className='opacity-80' style={{ position:'absolute', top:80, right:30, backgroundColor:Colors.lightBlack, paddingHorizontal:15, paddingVertical:5, borderRadius:10 }}>
        <Text className='text-mainGray font-psemibold '>Change picture</Text>
      </TouchableOpacity>
      <View className='px-4 items-center ' style={{marginTop:245, gap:15, marginBottom:50}}>
                    {/* <Image
                        source={require('../assets/images/drewcamera.jpg')}
                        style={{ width:100, height:100, borderRadius:50, marginBottom:18 }}
                        resizeMethod='cover'
                        className='w-full mt-20'
                        /> */}
                    <View className='items-center' style={{gap:15}}>
                        <View className='items-center justify-center gap-0'>
                            <Text className='text-secondary font-pblack text-2xl'>{user.firstName} {user.lastName}</Text>
                        <Text className='text-white font-pbold '>@{user.username}</Text>
                        </View>
                        <TextInput
                            value={inputs.bio}
                            onChangeText={(text) => handleInputs('bio', text)}
                            placeholder='Tap to edit your bio'
                            placeholderTextColor={Colors.mainGray}
                            multiline
                            maxLength={150}
                            style={{ fontFamily:'courier', backgroundColor:Colors.lightBlack, paddingHorizontal:20, paddingVertical:20, borderRadius:10, color:'white', width:250  }}
                        />
                       
                    </View>
                    <TextInput
                            value={inputs.bioLink}
                            onChangeText={(text) => handleInputs('bioLink', text)}
                            placeholder='Add a link (optional)'
                            inputMode='url'
                            autoCapitalize='none'
                            keyboardType='url'
                            placeholderTextColor={Colors.mainGray}
                            style={{  backgroundColor:Colors.lightBlack, paddingHorizontal:20, paddingVertical:8, borderRadius:10, color:'white', width:200  }}
                        />
                   
                </View>
                <View className='justify-center items-center gap-10 px-14'>
                   
                    <TouchableOpacity onPress={handleContinue} style={{ paddingVertical:10, paddingHorizontal:15, backgroundColor:Colors.secondary, borderRadius:10 }}    >
                        <Text className='text-primary  font-pbold'>One step left</Text>
                    </TouchableOpacity>
                </View>

      </View>
     
    ) : (

          <View  style={{ justifyContent:'center', alignItems:'center', height:'100%', height:'100%', paddingTop:150,paddingHorizontal:50 ,  backgroundColor:Colors.primary, gap:15 }} >
                <Animated.View style={[styles.animatedText, { opacity: textOpacity, transform: [{ translateY: textTranslateY }] , justifyContent:'center', alignItems:'center', gap:10, marginBottom:20}]}>

                <View className='justify-center items-center gap-3 mb-5' >
                    <Text className='text-xl text-secondary font-pcourier  uppercase'>Bingeable</Text>
                    <Text className='font-pcourier text-white ' >Welcome aboard {user.firstName}!</Text>
                </View>
                </Animated.View>

                <Animated.View style={[styles.animatedText, { opacity: text2Opacity, transform: [{ translateY: text2TranslateY }] , justifyContent:'center', alignItems:'center', gap:10, marginBottom:50}]}>

                <View className='justify-center items-center gap-3 mb-10' >
                    <Text className='text-xl text-secondary font-pcourier uppercase '>Bingeable (cont.)</Text>
                    <Text className='font-pcourier text-white' >Let's go through a few steps to setup your profile, it won't take long. Let's start with adding a profile picture</Text>
                </View>


                <View className='w-full justify-center items-center'>
                  {  loadingImage ?  (
                    <View>
                      <ActivityIndicator></ActivityIndicator>
                    </View>
                  ) : (
                    

                      <TouchableOpacity onPress={handleUpload}  style={{ paddingHorizontal:20, paddingVertical:10, backgroundColor:Colors.secondary, borderRadius:10 }} >
                        {/* <PlusIcon color={Colors.secondary} size={50} ></PlusIcon> */}
                        <Text className='text-primary font-pbold '>Add profile picture</Text>
                      </TouchableOpacity>
                  ) }
                </View>
                </Animated.View>
                  
            </View>

    ) }
    </View>
    </TouchableWithoutFeedback>
</ScrollView>
</KeyboardAvoidingView>

  )
}

export default profile1

const styles = StyleSheet.create({})