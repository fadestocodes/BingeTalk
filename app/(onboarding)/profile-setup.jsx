import { StyleSheet, Text, View , SafeAreaView, TouchableOpacity, ScrollView, TextInput,Keyboard, TouchableWithoutFeedback,KeyboardAvoidingView, Platform, ViewBase, ActivityIndicator,} from 'react-native'
import React, {useState, useRef} from 'react'
import { Colors } from '../../constants/Colors'
import { Wrench, Popcorn, ArrowRight, ArrowLeft } from 'lucide-react-native'
import { avatarFallbackCustom } from '../../constants/Images'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {  usernameSchema, signupNameSchema } from '../../lib/zodSchemas'
import { checkUsername } from '../../api/user'
import debounce from 'lodash.debounce'
import { autocompleteLocationSearch } from '../../api/location'
import { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated'
import Animated, { Easing, withTiming, useSharedValue, withDelay } from 'react-native-reanimated';
import { CloseIcon } from '../../assets/icons/icons'
import {  createOauthUser, useGetUser } from '../../api/auth'
import { useCreateContext } from '../../lib/CreateContext'
import { useSignUpContext } from '../../lib/SignUpContext'
// import {useCreateContext} from '../../lib/CreateContext'





const ProfileSetup = () => {

    const { signUpData, updateSignUpData } = useSignUpContext()
    const [ inputs, setInputs ] = useState({
        firstName : '',
        lastName : '',
        username : '',
        location : '',
    })
    const [profilePicUrl, setProfilePicUrl] = useState('')
    const {oauthProvider} = useLocalSearchParams()
    const {createUserData, updateCreateUserData} = useCreateContext()
    const [locationResults, setLocationResults] = useState([])
    const [selectedLocation, setSelectedLocation] = useState('')
    const [uploading, setUploading] = useState(false)
    const [errors, setErrors] = useState({})
    const [ usernameTakenError, setUsernameTakenError ] = useState('')
    const keyboard = useAnimatedKeyboard();
    const translateStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: -keyboard.height.value * .6}],
        };
    });

  
    
    
    // const {createUserData,updateCreateUserData} = useCreateContext()



    const missingInputs = Object.values(inputs)?.some(value => value?.trim() === '');
    const hasErrors = Object.values(errors)?.some(
        value => Array.isArray(value) ? value.length > 0 : !!value
      );
    const router = useRouter()

    useEffect(()=>{
        const getGlobalStateInfo = async () => {
            // const fullNameData = await AsyncStorage.getItem('apple-fullName')
            // const fullName = JSON.parse(fullNameData)
            // if (fullName){

            //     setInputs(prev => ({
            //         ...prev,
            //         firstName : fullName.givenName,
            //         lastName:fullName.familyName
            //     }))
            // }
            const {firstName:firstNameState, lastName:lastNameState, profilePic:profilePicState} = createUserData
            setInputs(prev => ({
                ...prev,
                firstName:firstNameState,
                lastName:lastNameState,
            }))
            setProfilePicUrl(profilePicState)

        }
        getGlobalStateInfo()
    }, [])


    const handleInputs = async ( name, value ) => {
        console.log(name,value)
        setInputs(prev => ({
        ...prev,
        [name]: value
        }))

        if (name === 'firstName' || name === 'lastName'){
            const results = signupNameSchema.safeParse( { ...inputs, [name] : value } )
            if (!results.success) {
                const errorObj = results.error.format();
                setErrors( prev => ({
                    ...prev,
                    firstName: errorObj.firstName ? errorObj.firstName._errors : [],
                    lastName: errorObj.lastName ? errorObj.lastName._errors : [],
                  }) )
                  
                } else {
                  setErrors( prev => ({
                    ...prev,
                    [name] : []
                  }) )
                }

        } else if (name === 'location'){
            const locations = await autocompleteLocationSearch(value)
            setLocationResults(locations)


        } else {

            const results = usernameSchema.safeParse( { username: inputs.username } )
            if (!results.success) {
            const errorObj = results.error.format();
            setErrors( prev => ({
                ...prev,
                [name]: errorObj.username ? errorObj.username._errors : undefined,
                }) )
                
            } else {
                setErrors( prev => ({
                    ...prev,
                    [name] : []
                }) )
            checkUsernameAvailability(value);
            }
        }

    }

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

    const handleLocationSelect = (location) => {
        setSelectedLocation({
            city : location.properties.city,
            country : location.properties.country,
            state : location.properties.state,
            countryCode : location.properties.country_code
        })
        setInputs(prev =>({
            ...prev,
            location : location.properties.formatted
        }))
        setLocationResults([])
    }

    const handleResetLocation = () => {
        setSelectedLocation(null)
        setInputs(prev => ({
            ...prev,
            location : ''
        }))
        setLocationResults([])
    }

    const handleNext = async () => {
        // const appleId = await AsyncStorage.getItem('appleId')
        // const fullNameData = await AsyncStorage.getItem('apple-fullName')
        // const fullName = JSON.parse(fullNameData)
        // const emailData = await AsyncStorage.getItem('apple-email')

        updateSignUpData(prev => ({
            ...prev,
            firstName : inputs.firstName,
            lastName : inputs.lastName,
            username : inputs.username.trim(),
            city : selectedLocation?.city || null,
            country : selectedLocation?.country || null,
            countryCode: selectedLocation?.countryCode || null,
            accountType : signUpData?.accountType ? signUpData.accountType : 'FILMLOVER',
            filmDept : signUpData?.filmDept ? signUpData.filmDept : null,
            filmRole : signUpData?.filmRole ? signUpData.filmRole : null,
            image : profilePicUrl || null
        }))

        const userParams = {
            appleId: createUserData?.appleId || null,
            googleId : createUserData?.googleId || null,
            email : createUserData?.email || null,
            firstName : inputs.firstName,
            lastName: inputs.lastName,
            username : inputs.username.trim(),
            city : selectedLocation?.city || null,
            country : selectedLocation?.country || null,
            countryCode: selectedLocation?.countryCode || null,
            accountType : signUpData?.accountType ? signUpData.accountType : 'FILMLOVER',
            filmDept : signUpData?.filmDept ? signUpData.filmDept : null,
            filmRole : signUpData?.filmRole ? signUpData.filmRole : null,
            profilePic : profilePicUrl || null
        }
        // const createUserData = {
        //     appleId,
        //     email : emailData,
        //     firstName : fullName.givenName,
        //     lastName: fullName.lastName || null,
        //     username : inputs.username.trim(),
        //     city : selectedLocation?.city || null,
        //     country : selectedLocation?.country || null,
        //     countryCode: selectedLocation?.countryCode || null,
        //     accountType : accountType ? accountType : 'FILMLOVER',
        //     filmDept : dept ? dept : null,
        //     filmRole : role ? role : null,
        //     profilePic : inputs?.profilePic || null
        // }


        if (oauthProvider){
            try {
                setUploading(true)
                const successfulUser = await createOauthUser(userParams)
                router.replace('(onboarding)/recentlyWatched')
            } catch(err) {
                console.error(err)
            } finally {
                setUploading(false)
            }
        } else {
            router.push('(onboarding)/step3-email')
        }

    }
  

  return (
    <SafeAreaView className='bg-primary flex-1'>
        {/* <KeyboardAvoidingView
            style={{ flex: 1, width:'100%', height:'100%' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={30}
         >  */}
        {/* <TouchableWithoutFeedback style={{flex:1}} onPress={()=>Keyboard.dismiss()} > */}
        <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            // ref={scrollViewRef}

        >
        
        { uploading ? (
            <ActivityIndicator />
        ) : (

        <Animated.View style={translateStyle}>


         <View  className='px-10 pt-20 gap-3 w-full flex-1'>
            <Text className='text-3xl font-bold text-white pb-10'>Let's setup your profile</Text>
            <View className=''>
                <TouchableOpacity>
                    <Image
                        source={{ uri:  avatarFallbackCustom }}
                        contentFit='cover'
                        style={{ width:60, height:60, borderRadius:50 }}
                    />
                </TouchableOpacity>
                <View className='gap-10 pt-10'>


                    <View className='flex flex-col gap-3 justify-start items-start'>
                        { errors?.firstName?.[0] && (
                            <View >
                                <Text className='text-red-400 text-sm text-start'>{`* ${errors.firstName[0]}`}</Text>
                            </View>
                        )
                            
                        }
                        <Text className='text-mainGray '>First name</Text>
                        <TextInput
                             placeholder="Enter first name"
                             autoCorrect={false}
                             value={inputs.firstName}
                             onChangeText={(text) => handleInputs('firstName', text)}
                             placeholderTextColor={Colors.lightBlack}
                             style={{backgroundColor:Colors.primaryLight, width:200, paddingVertical:10, paddingHorizontal:15, borderRadius:15,color:Colors.mainGray}}
                        />
                    </View>
                    <View className='flex flex-col gap-3 justify-start items-start'>
                        { errors?.lastName?.[0] &&  (
                            <View >
                                <Text className='text-red-400 text-sm text-start'>{`* ${errors.lastName[0]}`}</Text>
                            </View>
                            )
                        }
                        <Text className='text-mainGray '>Last name</Text>
                        <TextInput
                             placeholder="Enter last name"
                             value={inputs.lastName}
                             autoCorrect={false}
                             placeholderTextColor={Colors.lightBlack}
                             onChangeText={(text) => handleInputs('lastName', text)}
                             style={{backgroundColor:Colors.primaryLight, width:200, paddingVertical:10, paddingHorizontal:15, borderRadius:15, color:Colors.mainGray}}
                        />
                    </View>
                    <View className='flex flex-col gap-3 justify-start items-start'>
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
                        <Text className='text-mainGray '>Username</Text>
                        <TextInput
                             placeholder="@username"
                             autoCapitalize='none'
                             autoCorrect={false}
                             onChangeText={(text) => handleInputs('username', text)}
                             value={inputs.username}
                             placeholderTextColor={Colors.lightBlack}
                             style={{backgroundColor:Colors.primaryLight, width:250, paddingVertical:10, paddingHorizontal:15, borderRadius:15, color:Colors.mainGray}}
                        />
                    </View>
                    <View
                    className='flex flex-col gap-3 justify-start items-start '>
                        <Text className='text-mainGray '>Location</Text>
                        <View className='relative'>
                            <TextInput
                                 placeholder="Enter location"
                                 value={inputs.location}
                                //  ref={locationInputRef}
                                //  onFocus={() => {
                                //     scrollViewRef.current?.scrollTo({ y: locationInputY - 80, animated: true });
                                //  }}
                                 onChangeText={(text) => handleInputs('location', text)}
                                autoCorrect={false}
                                 placeholderTextColor={Colors.lightBlack}
                                 style={{backgroundColor:Colors.primaryLight, width:300, paddingVertical:10, paddingHorizontal:15, borderRadius:15, color:Colors.mainGray}}
                            />
                            <TouchableOpacity onPress={handleResetLocation} className='absolute top-1 right-2 bg-primary rounded-full p-1'>
                                <CloseIcon color={Colors.newLightGray} size={20}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


            { locationResults?.length > 0 && (
                <View className='gap-5 pt-4'>
                { locationResults.map((item,index) => (
                    <TouchableOpacity onPress={()=>handleLocationSelect(item)} key={index}>
                        <Text className='text-mainGray text-lg'>{item.properties.formatted}</Text>
                    </TouchableOpacity>
                ))}
                </View>
            ) }
            <View className='flex flex-row gap-3 justify-center items-center flex-1 flex-grow'>
                <TouchableOpacity onPress={()=>router.back()} style={{ }} className='mt-10  self-center rounded-full bg-primaryLight w-[45px] h-[45px] relative justify-center items-center'>
                    <View className=''>
                        <ArrowLeft color={Colors.newLightGray} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity disabled={missingInputs || hasErrors} onPress={handleNext} style={{opacity : missingInputs || hasErrors ? 0.3: 1}} className='mt-10  self-center rounded-full bg-primaryLight w-[45px] h-[45px] relative justify-center items-center'>
                    <View className=''>
                        <ArrowRight color={Colors.newLightGray} />
                    </View>
                </TouchableOpacity>
            </View>
            </View>
         </View>
      </Animated.View>
        ) }



        </ScrollView>
         {/* </TouchableWithoutFeedback> */}
        {/* </KeyboardAvoidingView> */}
    </SafeAreaView>

  )
}

export default ProfileSetup

const styles = StyleSheet.create({})