import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Platform, Keyboard, FlatList , ImageBackground, TouchableOpacity, TextInput, ActivityIndicator, Linking} from 'react-native'
import { Image } from 'expo-image'
import React, { useState, useRef } from 'react'
import { useFetchOwnerUser, useFetchUser } from '../../../../../api/user'
import { useUser } from '@clerk/clerk-expo'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../../../../../constants/Colors'
import { CloseIcon, BackIcon } from '../../../../../assets/icons/icons'
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { router, useRouter } from 'expo-router'
import { updateUser } from '../../../../../api/user'
import { pickSingleImage } from '../../../../../lib/pickImage'
import { urlSchema } from '../../../../../lib/zodSchemas'



const editProfile = () => {

    const { user:clerkUser } = useUser()
    const router = useRouter();
    const { data : fetchedUser, refetch } = useFetchOwnerUser( {email:clerkUser?.emailAddresses[0].emailAddress} )
    const [ image, setImage ] = useState(fetchedUser?.profilePic);
    const [ loadingImage, setLoadingImage] = useState(false) 
    const [ inputs, setInputs ] = useState({
        firstName : fetchedUser?.firstName,
        lastName : fetchedUser?.lastName,
        bio : fetchedUser?.bio,
        bioLink : fetchedUser?.bioLink
    })
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const [error, setError] = useState('')


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


        console.log('here')
        const params = {
            id : fetchedUser?.id,
            email : clerkUser?.emailAddresses[0].emailAddress,
            firstName : inputs.firstName,
            lastName : inputs.lastName,
            bio : inputs.bio,
            bioLink :normalizedURL,
            profilePic : image
        }
        console.log('params', params)
        const updatedUser = await updateUser( params , fetchedUser?.emailAddress);
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
    
    <Animated.View  style={[{ flex: 1 }, animatedStyles]}  >
        
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}  >
        <ScrollView className="bg-primary">
            
        <View style={{   justifyContent: 'start', alignItems: 'center', paddingBottom:200 }}>
        
            <View className='relative w-full justify-center items-center' >
                { loadingImage ? (
                    <View style = {{ width:'100%', height:250, position:'absolute', top:0 }} >
                        <ActivityIndicator></ActivityIndicator>
                    </View>
                ) : (
                    <View className='w-full' style={{height:100}}>
                    <Image
                    style={{
                    width: '100%',
                    top:0,
                    height: 400,
                    position: 'absolute',
                    borderRadius:30
                    }}
                    source={{ uri: image }}
                    contentFit="cover" // Same as resizeMode='cover'
                    transition={300} // Optional: Adds a fade-in effect
                />

                <LinearGradient
                    colors={['transparent', Colors.primary]}
                    style={{
                    height: 400,
                    width: '100%',
                    position: 'absolute',
                    top:0,
                    }}
                />
                <TouchableOpacity onPress={()=>router.back()} style={{position:'absolute', top:60, left:20}}>
              <BackIcon size={26} color={Colors.mainGray}/>
            </TouchableOpacity>
                <TouchableOpacity onPress={handleImageUpload} style={{backgroundColor:Colors.mainGrayDark, position:'absolute', borderRadius:15, paddingHorizontal:10, paddingVertical:5, opacity:.7, top:60, right:20}}>
                    <Text className='text-mainGray font-pbold text-xs'>Change profile pic</Text>
                </TouchableOpacity>
                </View>
                ) }
            </View>
            <View className="w-full" style={{ paddingTop:270, paddingHorizontal:20, gap:10 }} >
                <View className='flex-row w-full  justify-start items-start ' >
                    <Text className='text-mainGray font-pbold ' style={{ width:110, paddingHorizontal:15, paddingVertical:8}}  >First name:</Text>
                    <View className='relative' style={{ width:220 }}  >
                        <TextInput
                            placeholder='First Name'
                            value={ inputs.firstName }
                            placeholderTextColor={Colors.lightBlack}
                            onChangeText={(text)=>handleInputChange('firstName', text)}
                            onFocus={()=> {setFocusedInput('firstName'); }}
                            onBlur={ ()=>{setFocusedInput(null); setShouldAnimate(false)} }
                            style={{ fontSize:16, paddingVertical:0, justifyContent:'center', alignItems:'center', textAlignVertical:'center', color:Colors.mainGray, borderWidth: focusedInput === 'firstName' ? 1 : 1, borderColor:Colors.mainGray, paddingHorizontal:15, paddingVertical:8, borderRadius:10  }}

                        />
                      
                    </View>

                </View>
                <View className='border-t-[2px] border-darkGray mt-3' />
                <View className='flex-row w-full  justify-start items-start ' >
                    <Text className='text-mainGray font-pbold  ' style={{ width:110, paddingHorizontal:15, paddingVertical:8}}  >Last name:</Text>
                    <View className='relative' style={{ width:220 }}  >
                        <TextInput
                            placeholder='Last Name'
                            value={ inputs.lastName }
                            placeholderTextColor={Colors.lightBlack}
                            onFocus={()=> setFocusedInput('lastName')}
                            onChangeText={(text)=>{handleInputChange('lastName', text); }}
                            onBlur={ ()=>{setFocusedInput(null); setShouldAnimate(false)} }
                            style={{ fontSize:16, paddingVertical:0, justifyContent:'center', alignItems:'center', textAlignVertical:'center', color:Colors.mainGray, borderWidth: focusedInput ==='lastName' ? 1 : 1, borderColor:Colors.mainGray, paddingHorizontal:15, paddingVertical:8, borderRadius:10  }}

                        />
                     
                    </View>
                </View>
                <View className='border-t-[2px] border-darkGray mt-3' />
                <View className='flex-row w-full  justify-start items-center ' >
                    <Text className='text-mainGray font-pbold justify-center items-center ' style={{ width:110, paddingHorizontal:15, paddingVertical:8}}  >Link in bio (optional) :</Text>
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
                            style={{  fontSize:16, paddingVertical:0, justifyContent:'center', alignItems:'center', textAlignVertical:'center', color:Colors.mainGray, borderWidth: focusedInput ==='lastName' ? 1 : 1, borderColor:Colors.mainGray, paddingHorizontal:15, paddingVertical:8, borderRadius:10  }}

                        />
                      
                    </View>
                </View>
                <View className='border-t-[2px] border-darkGray mt-3' />
            </View>
            <View className='w-full' style={{paddingHorizontal:20, paddingVertical:10}} >
                <View className='flex-row justify-start items-center w-full'>

                    <Text className='text-mainGray font-pbold' style={{ width:65, paddingHorizontal:15, paddingVertical:8 }} >Bio: </Text>
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
                            style={{ fontSize:16, minHeight:120, paddingVertical:0, justifyContent:'center', alignItems:'center', textAlignVertical:'top', color:Colors.mainGray, borderWidth: focusedInput ==='bio' ? 1 : 1, borderColor:Colors.mainGray, paddingHorizontal:15, paddingVertical:8, borderRadius:10  }}

                        />
                        
                    </View>
                </View>
                <View className='border-t-[2px] border-darkGray mt-3' />

            </View>

            <View className='gap-3 py-3 px-5  my-3 w-full justify-center items-center '>
                <Text className='text-mainGray font-pbold'>Current Rotation</Text>
                <TouchableOpacity onPress={handleEditRotation}  style={{ width:'100%', backgroundColor:Colors.mainGrayDark, paddingHorizontal:20, paddingVertical:10, height:120, borderRadius:15 }} >
                    <Text className='font-pbold text-white z-10 text-lg self-center' style={{position:'absolute', top:40, paddingHorizontal:45, paddingVertical:10 , backgroundColor:Colors.primary, borderRadius:20, opacity:0.8 }} >Edit</Text>
                    <FlatList
                        data={fetchedUser.currentRotation}
                        horizontal
                        
                        contentContainerStyle={{ width:'100%', height:100, justifyContent:'flex-start', gap:15, alignItems:'center', opacity:1 }}
                        scrollEnabled={false}
                        keyExtractor={item => item.id}
                        renderItem={ ({item}) => {
                            return (

                                <Image
                                    source={{uri: item.movie ? `${posterURL}${item.movie.posterPath}` : item.tv ? `${posterURL}${item.tv.posterPath}` : null }}
                                    contentFit='cover'
                                    style={{ width:50, height:80, borderRadius:10, overflow:'hidden'}}
                                />
                        ) }}
                    />
                </TouchableOpacity>
            </View>
            <View style={{paddingHorizontal:20, width:'100%'}} >

            {/* <View className='border-t-[2px]  border-darkGray my-3' /> */}
            </View>

            
            <TouchableOpacity onPress={handleSave}  style={{ marginTop:30, backgroundColor:Colors.secondary, paddingHorizontal:20, paddingVertical:10, borderRadius:30 }} >
                <Text className='font-pbold'>Save changes</Text>
            </TouchableOpacity>

        </View>
        </ScrollView>
    </TouchableWithoutFeedback>
    </Animated.View>
  )
}

export default editProfile

const styles = StyleSheet.create({})