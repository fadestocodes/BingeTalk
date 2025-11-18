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
import { signupNameSchema, urlSchema } from '../../../../../lib/zodSchemas'
import { useGetUser, useGetUserFull } from '../../../../../api/auth'
import { avatarFallbackCustom } from '../../../../../constants/Images'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUserContext } from '../../../../../lib/UserContext'
import { autocompleteLocationSearch } from '../../../../../api/location'
import { ArrowLeft, ChevronDown, Clapperboard, Popcorn } from 'lucide-react-native'
import { filmRoles } from '../../../../../lib/FilmDeptRoles'
import { parseDept, unparseDept } from '../../../../../lib/parseFilmDept'



const editProfile = () => { 
    const {user} = useGetUser()
    const {userFull:fetchedUser, refetch} = useGetUserFull(user?.id)
    const router = useRouter();
    const [ image, setImage ] = useState(fetchedUser?.profilePic);
    const [ loadingImage, setLoadingImage] = useState(false) 
    const [ inputs, setInputs ] = useState({
        firstName : fetchedUser?.firstName || '',
        lastName : fetchedUser?.lastName || '',
        bio : fetchedUser?.bio || '',
        bioLink : fetchedUser?.bioLink || '',
        accountType : fetchedUser?.accountType || '',
        location : fetchedUser?.locationFormatted || "",
        filmRole : '',
        filmDept : ''
    })
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const [errors, setErrors] = useState('')
    const {updateUser:updateUserContext} = useUserContext()
    const [locationResults, setLocationResults] = useState([])
    const [selectedLocation, setSelectedLocation] = useState( '')
    const [ showAccountTypeDropdown, setShowAccountTypeDropdown ] = useState(false)
    const [ showFilmDept, setShowFilmDept ] = useState(false)
    const [ hasSelectedDept, setHasSelectedDept ] = useState(false)
    const [selectedFilmDept, setSelectedFilmDept] = useState('')




    useEffect(() => {
        if (fetchedUser) {
          setInputs({
            firstName: fetchedUser.firstName || '',
            lastName: fetchedUser.lastName || '',
            bio: fetchedUser.bio || '',
            bioLink: fetchedUser.bioLink || '',
            accountType : fetchedUser.accountType || '',
            location : fetchedUser.locationFormatted || '',
            filmRole : fetchedUser?.filmRole?.role || '',
            filmDept : fetchedUser?.filmDept?.department || ''
          });
      
          setImage(fetchedUser.profilePic || null);
        }
      }, [fetchedUser]);

    const [ focusedInput, setFocusedInput ] = useState(null)
    const keyboard = useAnimatedKeyboard();

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateY: shouldAnimate ? -keyboard.height.value + 75 : 0 }],
    }));

    const departments = Object.entries(filmRoles.department).map(([name, info]) => ({
        name,
        roles: info.roles,
        emoji: info.emoji,
        numRoles : info.roles.length
      }));

    const handleInputChange = async ( name, text ) => {

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
        if (name === 'location'){
                const locations = await autocompleteLocationSearch(text)
                setLocationResults(locations)
        }

        if (name === 'firstName' || name === 'lastName'){

            const results = signupNameSchema.safeParse( { ...inputs, [name] : text } )
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
        }

    }

    const handleLocationSelect = (location) => {
        setSelectedLocation({
            city : location.properties.city,
            country : location.properties.country,
            state : location.properties.state,
            countryCode : location.properties.country_code,
            locationFormatted : location.properties.formatted
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

    const handleClearInput = (name) => {
        setInputs( prev => ({
            ...prev,
            [name] : ''
        }) )
    }

    const handleSave = async () => {

        if (!inputs.location){
            setErrors(prev => ({
                ...prev,
                location : "Location is required"
            }))
            return 
        }

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
            profilePic : image,
            city : selectedLocation.city,
            country : selectedLocation.country,
            state : selectedLocation.state,
            countryCode : selectedLocation.countryCode,
            locationFormatted : selectedLocation.locationFormatted,
            accountType : inputs.accountType,
            filmRole : inputs.filmRole,
            filmDept : inputs.filmDept

        }
        const updatedUser = await updateUser( params , fetchedUser?.email);
        if (updatedUser.success){
            updateUserContext(updatedUser.data)
        }
        

        await refetch();
        router.back();


    }

    const handleEditRotation = () => {
        router.push('/edit-profile/editRotation')
    }


    const handleImageUpload = () => {
        pickSingleImage( setImage, setLoadingImage );
      }

    const handleAccountType = (type) => {
        if (inputs.accountType === 'FILMMAKER' && type === 'FILMLOVER'){
            setErrors(prev => ({
                ...prev,
                accountType : "We recommend not changing your account type from FILMMAKER to FILMLOVER as this may result in loss of account data and progress."
            }))
        } else {
            setErrors(prev => ({
                ...prev,
                accountType : ''
            }))
        }
        setInputs(prev => ({
            ...prev,
            accountType : type
        }))
        if (type === 'FILMLOVER'){
            setInputs(prev => ({
                ...prev,
                filmRole : fetchedUser?.filmRole?.role || '',
                filmDept : fetchedUser?.filmDept?.department || ''
            }))
        }
        setShowAccountTypeDropdown(false)
    }

    const handleDeptSelect = (dept) => {
        const parsed = parseDept(dept.name)
        setInputs(prev => ({
            ...prev,
            filmDept : parsed
        }))
        setSelectedFilmDept(dept)
        setHasSelectedDept(true)

    }

    const handleRoleSelect = (role) => {
        const parsed = parseDept(role)
        setInputs(prev => ({
            ...prev,
            filmRole : parsed
        }))
        setShowFilmDept(false)
        setHasSelectedDept(false)
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
                { errors?.firstName?.[0] && (
                            <View >
                                <Text className='text-red-400 text-sm text-start'>{`* ${errors.firstName[0]}`}</Text>
                            </View>
                        )
                            
                        }
                    <View className='flex-row w-full  justify-start items-center ' >
                        <Text className='text-mainGray font-semibold text-sm' style={{ width:110, paddingHorizontal:0, paddingVertical:8}}  >First name:</Text>
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
                    { errors?.lastName?.[0] && (
                            <View >
                                <Text className='text-red-400 text-sm text-start'>{`* ${errors.lastName[0]}`}</Text>
                            </View>
                        )
                            
                        }
                    <View className='flex-row w-full  justify-start items-start ' >
                        <Text className='text-mainGray font-semibold  text-sm' style={{ width:110, paddingHorizontal:0, paddingVertical:8}}  >Last name:</Text>
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
                        <Text className='text-mainGray font-semibold justify-center items-center text-sm' style={{ width:110, paddingHorizontal:0, paddingVertical:8}}  >Link in bio (optional) :</Text>
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
                
                <View className='w-full' style={{paddingHorizontal:20, paddingVertical:0}} >
                    <View className='flex-row justify-start items-center w-full'>

                        <Text className='text-mainGray font-semibold text-sm' style={{ width:65, paddingHorizontal:0, paddingVertical:8 }} >Bio: </Text>
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
                    <View className='border-t-[2px] border-primaryLight mt-3' />


                </View>
                <View className='w-full' style={{paddingHorizontal:20, paddingVertical:0}} >
                { errors?.location && (
                            <View >
                                <Text className='text-red-400 text-sm text-start'>{`* ${errors.location}`}</Text>
                            </View>
                        )
                            
                        }
                    <View className='flex-row justify-start items-center w-full'>

                        <Text className='text-mainGray font-semibold text-sm' style={{ width:65, paddingHorizontal:0, paddingVertical:8 }} >Location: </Text>
                        <View className='relative py-3' style={{ width:270 }}  >
                            <TextInput
                                placeholder='Location'
                                value={ inputs.location }
                                defaultValue={fetchedUser?.locationFormatted}
                                autoCorrect={false}
                                onChangeText={(text)=> handleInputChange('location', text)  }
                                placeholderTextColor={Colors.lightBlack}
                                maxLength={150}
                                onFocus={()=> {setFocusedInput('location'); setShouldAnimate(true)}}
                                onBlur={ ()=>{setFocusedInput(null); setShouldAnimate(false)} }
                                // style={{ fontSize:16, minHeight:120, paddingVertical:0, justifyContent:'center', alignItems:'center', textAlignVertical:'top', color:Colors.mainGray, borderWidth: focusedInput ==='bio' ? 1 : 1, borderColor:Colors.mainGray, paddingHorizontal:15, paddingVertical:8, borderRadius:10  }}
                                className='bg-primaryDark  text-mainGray px-4 rounded-2xl py-4 h-[50px]'

                            />
                            <TouchableOpacity onPress={handleResetLocation} className='absolute top-6 right-2 bg-primary rounded-full p-1'>
                                <CloseIcon color={Colors.newLightGray} size={20}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    { locationResults?.length > 0 && (
                        <View className='gap-5 '>
                        { locationResults.map((item,index) => (
                            <TouchableOpacity onPress={()=>handleLocationSelect(item)} key={index}>
                                <Text className='text-mainGray text-lg'>{item.properties.formatted}</Text>
                            </TouchableOpacity>
                        ))}
                        </View>
                    ) }
                    <View className='border-t-[2px] border-primaryLight mt-3' />


                </View>
                <View className='w-full' style={{paddingHorizontal:20, paddingVertical:0}} >
               
                    { errors?.accountType && (
                            <View >
                                <Text className='text-mainGrayLight text-sm text-start'>{`* ${errors.accountType}`}</Text>
                            </View>
                        )
                            
                        }
                    <View className='flex-row justify-start items-center w-full'>

                        <Text className='text-mainGray font-semibold text-sm' style={{ width:65, paddingHorizontal:0, paddingVertical:8 }} >Account Type: </Text>
                        <View className='relative py-3' style={{ width:270 }}  >
                            {/* <View
                                placeholder='Location'
                                value={ inputs.accountType }
                                defaultValue={fetchedUser?.accountType}
                                autoCorrect={false}
                                onChangeText={(text)=> handleInputChange('accountType', text)  }
                                placeholderTextColor={Colors.lightBlack}
                                maxLength={150}
                                onFocus={()=> {setFocusedInput('accountType'); setShouldAnimate(true)}}
                                onBlur={ ()=>{setFocusedInput(null); setShouldAnimate(false)} }
                                // style={{ fontSize:16, minHeight:120, paddingVertical:0, justifyContent:'center', alignItems:'center', textAlignVertical:'top', color:Colors.mainGray, borderWidth: focusedInput ==='bio' ? 1 : 1, borderColor:Colors.mainGray, paddingHorizontal:15, paddingVertical:8, borderRadius:10  }}
                                className='bg-primaryDark  text-mainGray px-4 rounded-2xl py-4 h-[50px]'

                            /> */}
                            <Text className='bg-primaryDark text-mainGray rounded-2xl px-4 py-4 h-[50px] justify-center items-center' >{inputs.accountType}</Text>
                            <TouchableOpacity onPress={() => setShowAccountTypeDropdown(!showAccountTypeDropdown)} className='absolute top-6 right-2 bg-primary rounded-full p-1'>
                                <ChevronDown color={Colors.newLightGray} size={20}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    { showAccountTypeDropdown > 0 && (
                        <View className='gap-5  bg-primaryLight rounded-xl px-4 py-4 justify-center items-start'>
                            <TouchableOpacity onPress={()=>handleAccountType('FILMLOVER')} className='flex flex-row gap-2 justify-center items-center'  >
                                <Popcorn size={16} color={Colors.mainGray}/>
                                <Text className='text-mainGray text-lg'>Film Lover</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>handleAccountType('FILMMAKER')} className='flex flex-row gap-2 justify-center items-center'  >
                                <Clapperboard size={16} color={Colors.mainGray} />
                                <Text className='text-mainGray text-lg'>Filmmaker</Text>
                            </TouchableOpacity>
                        </View>
                    ) }
                    <View className='border-t-[2px] border-primaryLight mt-3' />


                </View>

                { inputs.accountType === 'FILMMAKER' && (

                <View className='w-full' style={{paddingHorizontal:20, paddingVertical:0}} >
                {/* { errors?.location && (
                            <View >
                                <Text className='text-red-400 text-sm text-start'>{`* ${errors.location}`}</Text>
                            </View>
                        )
                            
                        } */}
                    <View className='flex-row justify-start items-center w-full'>

                        <Text className='text-mainGray font-semibold text-sm' style={{ width:65, paddingHorizontal:0, paddingVertical:8 }} >Film role: </Text>
                        <View className='relative py-3' style={{ width:270 }}  >
                            {/* <View
                                placeholder='Location'
                                value={ inputs.accountType }
                                defaultValue={fetchedUser?.accountType}
                                autoCorrect={false}
                                onChangeText={(text)=> handleInputChange('accountType', text)  }
                                placeholderTextColor={Colors.lightBlack}
                                maxLength={150}
                                onFocus={()=> {setFocusedInput('accountType'); setShouldAnimate(true)}}
                                onBlur={ ()=>{setFocusedInput(null); setShouldAnimate(false)} }
                                // style={{ fontSize:16, minHeight:120, paddingVertical:0, justifyContent:'center', alignItems:'center', textAlignVertical:'top', color:Colors.mainGray, borderWidth: focusedInput ==='bio' ? 1 : 1, borderColor:Colors.mainGray, paddingHorizontal:15, paddingVertical:8, borderRadius:10  }}
                                className='bg-primaryDark  text-mainGray px-4 rounded-2xl py-4 h-[50px]'

                            /> */}
                            <Text className='bg-primaryDark text-mainGray rounded-2xl px-4 py-4 h-[50px] justify-center items-center' >{unparseDept(inputs.filmRole)}</Text>
                            <TouchableOpacity onPress={() => setShowFilmDept(!showFilmDept)} className='absolute top-6 right-2 bg-primary rounded-full p-1'>
                                <ChevronDown color={Colors.newLightGray} size={20}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    { showFilmDept && (
                        <View className='gap-5  bg-primaryLight rounded-xl px-4 py-4 justify-center items-start'>
                            { hasSelectedDept ? (
                                 <FlatList
                                 data={selectedFilmDept.roles}
                                 scrollEnabled={false}
                                 keyExtractor={(item,index) => index}
                                 showsVerticalScrollIndicator={false}
                                 contentContainerStyle={{gap:15, paddingTop:10, paddingBottom:30,paddingLeft:20, paddingRight:20, width:'100%', justifyContent:'', alignItems:''}}
                                 ListHeaderComponent={(
                                    <TouchableOpacity onPress={()=>setHasSelectedDept(false)}  style={{ }} className='mt-0  self-start  w-[45px] h-[45px] relative justify-center items-center'>
                                            <ArrowLeft color={Colors.newLightGray} />
                                    </TouchableOpacity>
            
                                )}
                                 renderItem={({item}) => {
                                     return (
                                         <TouchableOpacity onPress={()=>{handleRoleSelect(item)}} style={{width:'100%'}} className='  '>
                                             <Text className=' font-semibold text-newLightGray text-lg'>{item}</Text>
                                         </TouchableOpacity>
                                     )
                                 }
                             }
                             />
                            ) : (
                                <FlatList
                                data={departments}
                                keyExtractor={(item,index) => index}
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{gap:20, paddingTop:30, paddingBottom:30,paddingLeft:20, paddingRight:20, width:'100%', justifyContent:'', alignItems:''}}
                                renderItem={({item}) => (
                                    <TouchableOpacity onPress={() => handleDeptSelect(item)} style={{width:'100%'}} className='  '>
                                        <Text className='font-bold text-newLightGray text-xl'>{item.emoji} {item.name} ({item.numRoles})</Text>
                                    </TouchableOpacity>
                
                                )}
                            />
                            ) }
                        </View>
                    ) }
                    <View className='border-t-[2px] border-primaryLight mt-3' />


                </View>
                ) }

                

                
                <TouchableOpacity onPress={handleSave}  style={{ marginTop:30, backgroundColor:Colors.secondary, paddingHorizontal:20, paddingVertical:10, borderRadius:30 }} >
                    <Text className='font-pbold'>Save changes</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    </Animated.View>
    </SafeAreaView>
  )
}

export default editProfile

const styles = StyleSheet.create({})