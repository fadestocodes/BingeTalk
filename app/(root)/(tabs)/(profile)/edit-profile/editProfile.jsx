import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Platform, Keyboard, FlatList , ImageBackground, TouchableOpacity, TextInput, ActivityIndicator, Linking} from 'react-native'
import { Image } from 'expo-image'
import React, { useState, useRef, useEffect } from 'react'
import { useFetchOwnerUser, useFetchUser } from '../../../../../api/user'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../../../../../constants/Colors'
import { CloseIcon, BackIcon } from '../../../../../assets/icons/icons'
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { router, useRouter } from 'expo-router'
import { updateUser } from '../../../../../api/user'
import { pickSingleImage } from '../../../../../lib/pickImage'
import { urlSchema } from '../../../../../lib/zodSchemas'
import { useGetUser, useGetUserFull } from '../../../../../api/auth'
import { avatarFallbackCustom } from '../../../../../constants/Images'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUserContext } from '../../../../../lib/UserContext'



const editProfile = () => { 
    const {user} = useGetUser()
    const {userFull:fetchedUser, refetch} = useGetUserFull(user?.id)
    const router = useRouter();
    console.log('fetched user...', fetchedUser)
    const [ image, setImage ] = useState(fetchedUser?.profilePic);
    const [ loadingImage, setLoadingImage] = useState(false) 
    const [ inputs, setInputs ] = useState({
        firstName : fetchedUser?.firstName || '',
        lastName : fetchedUser?.lastName || '',
        bio : fetchedUser?.bio || '',
        bioLink : fetchedUser?.bioLink || ''
    })
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const [error, setError] = useState('')
    const {updateUser:updateUserContext} = useUserContext()

    useEffect(() => {
        if (fetchedUser) {
          setInputs({
            firstName: fetchedUser.firstName || '',
            lastName: fetchedUser.lastName || '',
            bio: fetchedUser.bio || '',
            bioLink: fetchedUser.bioLink || '',
          });
      
          setImage(fetchedUser.profilePic || null);
        }
      }, [fetchedUser]);

    const [ focusedInput, setFocusedInput ] = useState(null)
    const keyboard = useAnimatedKeyboard();

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateY: shouldAnimate ? -keyboard.height.value+100 : 0 }],
    }));

    const handleInputChange = ( name, text ) => {

        // if ( name === 'bioLink'){
        //     const results = urlSchema.safeParse( inputs.bioLink )
        //     // console.log('results from validation', results)
        //     if (!results.success){
        //         const errorObj = results.error.format();
        //         setError(errorObj._errors[0])
        //         console.log('errorObj', errorObj)
        //     }
        // }

        setInputs( prev => ({
            ...prev,
            [name] : text
        }) )  
    }

    const handleClearInput = (name) => {
        setInputs( prev => ({
            ...prev,
            [name] : ''
        }) )
    }

    const handleSave = async () => {
        console.log("handling save")
        console.log('inputs biuo link', inputs.bioLink)

        let normalizedURL = ''
        
        if (inputs.bioLink ){
            let bioLink = inputs.bioLink.trim(); // Trim any leading/trailing spaces

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


        const params = {
            id : fetchedUser?.id,
            email : fetchedUser.email,
            firstName : inputs.firstName,
            lastName : inputs.lastName,
            bio : inputs.bio,
            bioLink :normalizedURL,
            profilePic : image
        }
        const updatedUser = await updateUser( params , fetchedUser?.email);
        if (updatedUser){
            updateUserContext(updatedUser.simplifiedUser)
        }
        

        refetch();
        router.back();


    }

    const handleEditRotation = () => {
        router.push('/edit-profile/editRotation')
    }


    const handleImageUpload = () => {
        pickSingleImage( setImage, setLoadingImage );
      }

      if (!fetchedUser){
        return (
            <View className='w-full h-full bg-primary justify-center items-center'>
                <ActivityIndicator />
            </View>

        )
      }

    
  return (
    <SafeAreaView className='h-full bg-primary w-full'>
    <Animated.View  style={[{ flex: 1 }, animatedStyles]}  >
        
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}  >
        <ScrollView className="bg-primary">
            
            <TouchableOpacity onPress={()=>router.back()} style={{position:'absolute', top:10, left:20}}>
                <BackIcon size={26} color={Colors.mainGray}/>
            </TouchableOpacity>
            <View style={{   justifyContent: 'start', alignItems: 'center', paddingBottom:0, gap:15, paddingTop:50 }}>
            
                <View className='relative w-full justify-center items-center gap-3' >
                    { loadingImage ? (
                        <View style = {{ width:'100%', height:250, position:'absolute', top:0 }} >
                            <ActivityIndicator></ActivityIndicator>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={handleImageUpload}>
                            <Image
                            source={{ uri: image ? image : avatarFallbackCustom}}
                            height={75}
                            width={75}
                            style={{borderRadius:50}}
                            />
                        </TouchableOpacity>
                ) }
                    <TouchableOpacity onPress={handleImageUpload} style={{backgroundColor:Colors.mainGrayDark, borderRadius:15, paddingHorizontal:10, paddingVertical:5, opacity:.7}}>
                        <Text className='text-mainGray font-pbold text-xs'>Change profile pic</Text>
                    </TouchableOpacity>
                </View>
                <View className="w-full" style={{ paddingTop:10, paddingHorizontal:20, gap:10 }} >
                    <View className='flex-row w-full  justify-start items-center ' >
                        <Text className='text-mainGray font-semibold ' style={{ width:110, paddingHorizontal:15, paddingVertical:8}}  >First name:</Text>
                        <View className='relative' style={{ width:220 }}  >
                            <TextInput
                                placeholder='First Name'
                                value={ inputs.firstName }
                                placeholderTextColor={Colors.lightBlack}
                                onChangeText={(text)=>handleInputChange('firstName', text)}
                                onFocus={()=> {setFocusedInput('firstName'); }}
                                onBlur={ ()=>{setFocusedInput(null); setShouldAnimate(false)} }
                                className='bg-primaryDark text-mainGray px-4 rounded-2xl py-4'
                                // style={{ fontSize:16, paddingVertical:0, justifyContent:'center', alignItems:'center', textAlignVertical:'center', color:Colors.mainGray, borderWidth: focusedInput === 'firstName' ? 1 : 1, borderColor:Colors.mainGray, paddingHorizontal:15, paddingVertical:8, borderRadius:10  }}

                            />
                        
                        </View>

                    </View>
                    <View className='border-t-[2px] border-primaryLight mt-3' />
                    <View className='flex-row w-full  justify-start items-start ' >
                        <Text className='text-mainGray font-semibold  ' style={{ width:110, paddingHorizontal:15, paddingVertical:8}}  >Last name:</Text>
                        <View className='relative' style={{ width:220 }}  >
                            <TextInput
                                placeholder='Last Name'
                                value={ inputs.lastName }
                                placeholderTextColor={Colors.lightBlack}
                                onFocus={()=> setFocusedInput('lastName')}
                                onChangeText={(text)=>{handleInputChange('lastName', text); }}
                                onBlur={ ()=>{setFocusedInput(null); setShouldAnimate(false)} }
                                // style={{ fontSize:16, paddingVertical:0, justifyContent:'center', alignItems:'center', textAlignVertical:'center', color:Colors.mainGray, borderWidth: focusedInput ==='lastName' ? 1 : 1, borderColor:Colors.mainGray, paddingHorizontal:15, paddingVertical:8, borderRadius:10  }}
                                className='bg-primaryDark text-mainGray px-4 rounded-2xl py-4'

                            />
                        
                        </View>
                    </View>
                    <View className='border-t-[2px] border-primaryLight mt-3' />
                    <View className='flex-row w-full  justify-start items-center ' >
                        <Text className='text-mainGray font-semibold justify-center items-center ' style={{ width:110, paddingHorizontal:15, paddingVertical:8}}  >Link in bio (optional) :</Text>
                        <View className='relative ' style={{width:220}}  >
                            <TextInput
                                placeholder='www.example.com'
                                autoCapitalize='none'
                                inputMode='url'
                                value={ inputs.bioLink }
                                placeholderTextColor={Colors.lightBlack}
                                onChangeText={(text)=>handleInputChange('bioLink', text)}
                                onFocus={()=> {setFocusedInput('bioLink'); }}
                                onBlur={ ()=>{setFocusedInput(null); setShouldAnimate(false)} }
                                // style={{  fontSize:16, paddingVertical:0, justifyContent:'center', alignItems:'center', textAlignVertical:'center', color:Colors.mainGray, borderWidth: focusedInput ==='lastName' ? 1 : 1, borderColor:Colors.mainGray, paddingHorizontal:15, paddingVertical:8, borderRadius:10  }}
                                className='bg-primaryDark text-mainGray px-4 rounded-2xl py-4'

                            />
                        
                        </View>
                    </View>
                    <View className='border-t-[2px] border-primaryLight mt-3' />
                </View>
                <View className='w-full' style={{paddingHorizontal:20, paddingVertical:10}} >
                    <View className='flex-row justify-start items-center w-full'>

                        <Text className='text-mainGray font-semibold' style={{ width:65, paddingHorizontal:15, paddingVertical:8 }} >Bio: </Text>
                        <View className='relative py-3' style={{ width:270 }}  >
                            <TextInput
                                placeholder='Edit bio...'
                                value={ inputs.bio }
                                multiline
                                defaultValue={ fetchedUser.bio }
                                onChangeText={(text)=> handleInputChange('bio', text)  }
                                placeholderTextColor={Colors.lightBlack}
                                maxLength={150}
                                onFocus={()=> {setFocusedInput('bio'); setShouldAnimate(true)}}
                                onBlur={ ()=>{setFocusedInput(null); setShouldAnimate(false)} }
                                // style={{ fontSize:16, minHeight:120, paddingVertical:0, justifyContent:'center', alignItems:'center', textAlignVertical:'top', color:Colors.mainGray, borderWidth: focusedInput ==='bio' ? 1 : 1, borderColor:Colors.mainGray, paddingHorizontal:15, paddingVertical:8, borderRadius:10  }}
                                className='bg-primaryDark font-pcourier text-mainGray px-4 rounded-2xl pt-4 pb-14 h-[100px]'

                            />
                            <Text className='absolute bottom-5 right-5 text-mainGray '>{inputs?.bio.length}/150</Text>
                            
                        </View>
                    </View>

                </View>

                

                
                <TouchableOpacity onPress={handleSave}  style={{ marginTop:30, backgroundColor:Colors.secondary, paddingHorizontal:20, paddingVertical:10, borderRadius:30 }} >
                    <Text className='font-pbold'>Save changes</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    </TouchableWithoutFeedback>
    </Animated.View>
    </SafeAreaView>
  )
}

export default editProfile

const styles = StyleSheet.create({})