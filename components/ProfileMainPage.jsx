import {  Text, View, FlatList, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import { ImageBackground,  } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React, {useState} from 'react'
import {feed} from '../lib/fakeData'
import { RepostIcon, UpIcon, DownIcon, PrayingHandsIcon, MessageIcon, ArrowUpIcon, ArrowDownIcon } from '../assets/icons/icons'
import { Colors } from '../constants/Colors'
import { useClerk, useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { useRouter } from 'expo-router'
import { LinkIcon } from '../assets/icons/icons'
import { useUserDB } from '../lib/UserDBContext'
import { fetchUser } from '../api/user'
import { formatDate } from '../lib/formatDate'
import DialogueCard from './Screens/DialoguePage'
import { useFetchDialogues } from '../api/dialogue'
import { useFetchUser } from '../api/user'


    const ProfileMainPage = ( ) => {


        const { signOut } = useClerk();
        const { user:clerkUser } = useUser();
        const router = useRouter();
        const posterURL = 'https://image.tmdb.org/t/p/original';
        const { data:userDB, refetch: refetchUser, isFetching:isFetchingUser } = useFetchUser( clerkUser.emailAddresses[0].emailAddress )


        const [ refreshing, setRefreshing ] = useState(false)
        
        const { data: dialogues, refetch, isFetching } = useFetchDialogues();

        if (isFetchingUser){
            return <ActivityIndicator></ActivityIndicator>
        }

        const handleSignOut = async () => {
            try {
                await signOut();
                router.replace('/')
            } catch (err) {
                console.log(err)
            } 
        }
        const handleRotationPress = (item) => {
            console.log(item)
            if (item.movie) {
                router.push(`/movie/${item.movieTMDBId}`)
            } else if (item.tv) {
                router.push(`/tv/${item.tvTMDBId}`)
            }
        }

        

        const handleDialoguePress = (dialogue) => {
            router.push(`/dialogue/${dialogue.id}`)
        }

        const handleEditProfile = () => {
            router.push('/edit-profile')
        }

  return (
   
    <View>
        <FlatList
            data={dialogues}
            refreshControl={
                <RefreshControl
                tintColor={Colors.secondary}
                refreshing={isFetchingUser}
                onRefresh={()=>{refetch(); refetchUser()}} 
                />
                }
            keyboardShouldPersistTaps="handled" 
            keyExtractor={ (item) => item.id }
            ListHeaderComponent={(
               
                <View className='justify-center items-center flex gap-3 ' style={{  marginTop:0}}>
                    <ImageBackground
                        className='top-0'
                        style={{width : '100%', height: 400, position:'absolute', top:0}}
                        source={{ uri:userDB?.profilePic }}
                        resizeMethod='cover'
                        
                        >
    
                        <LinearGradient 
                            colors={[ 'transparent',Colors.primary]} 
                            style={{height : '100%', width : '100%'}}>
                        </LinearGradient>
                    </ImageBackground>
                    <View className='px-4 items-center ' style={{marginTop:275, gap:15}}>
                        {/* <Image
                            source={require('../assets/images/drewcamera.jpg')}
                            style={{ width:100, height:100, borderRadius:50, marginBottom:18 }}
                            resizeMethod='cover'
                            className='w-full mt-20'
                            /> */}
                        <View className='items-center' style={{gap:10}}>
                            <View className='gap-1 justify-center items-center mb-5'>
                                <Text className='text-secondary font-pblack text-2xl'>{userDB.firstName} {userDB.lastName}</Text>
                                <Text className='text-white font-pbold '>@{userDB.username}</Text>
                            </View>
                            <Text className='text-third font-pcourier leading-5 ' style={{paddingHorizontal:20}}>{userDB.bio}</Text>
                        </View>
                        { userDB.bioLink && (
                        <TouchableOpacity className='flex-row gap-2 opacity-60'  style={{backgroundColor:'black', paddingVertical:5, paddingHorizontal:20, borderRadius:10}}>
                            <LinkIcon size={16} color={Colors.mainGray} />
                            <Text className='text-mainGray text-sm  font-psemibold' >{userDB.bioLink}</Text>
                        </TouchableOpacity>
                        ) }
                        <View className='flex-row gap-6' style={{marginTop:0}}>
                            <View className='flex-row gap-2 justify-center items-center'>
                                <Text className='text-gray-400 text-lg font-pblack'>210</Text>
                                <Text className='text-gray-400 text-sm font-psemibold'>Followers</Text>
                            </View>
                            <View className='flex-row gap-2 justify-center items-center'>
                                <Text className='text-gray-400 text-lg font-pblack'>186</Text>
                                <Text className='text-gray-400 text-sm font-psemibold'>Following</Text>
                            </View>
                            <View className='flex-row gap-2 justify-center items-center'>
                                <Text className='text-gray-400 text-lg font-pblack'>21</Text>
                                <Text className='text-gray-400 text-sm font-psemibold'>Credits</Text>
                            </View>
                        </View>
                        <View className='w-full justify-center items-center mt-4' >
                            <Text className='font-pbold text-mainGray'>Current Rotation</Text>
                            <FlatList
                                data={userDB.currentRotation}
                                horizontal
                              
                                contentContainerStyle={{ width:'100%', height:100, justifyContent:'center', alignItems:'center' }}
                                scrollEnabled={false}
                                keyExtractor={item => item.id}
                                renderItem={ ({item}) => {
                                    return (
    
                                    <TouchableOpacity onPress={() => handleRotationPress(item)} style={{ marginRight:10 }}>
                                        <Image
                                            source={{uri: item.movie ? `${posterURL}${item.movie.posterPath}` : item.tv ? `${posterURL}${item.tv.posterPath}` : null }}
                                            resizeMode='cover'
                                            style={{ width:50, height:80, borderRadius:10, overflow:'hidden' }}
                                        />
                                    </TouchableOpacity>
                                ) }}
                            >
    
                            </FlatList>
                        </View>
                    </View>
                    <View className='flex-row gap-2 mb-10'>
                        <TouchableOpacity onPress={handleEditProfile} style={{ paddingVertical:6, paddingHorizontal:10, borderWidth:1.5, borderColor:Colors.mainGray, borderRadius:10 }} >
                            <Text className='text-mainGray'>Edit profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSignOut}  style={{ paddingVertical:6, paddingHorizontal:10, borderWidth:1.5, borderColor:Colors.mainGray, borderRadius:10 }} >
                                <Text className='text-mainGray'>Sign Out</Text>
                        </TouchableOpacity>

                    </View>
    
                   
    
                </View>
            )}
    
            renderItem={({item}) => (
            
                <TouchableOpacity key={item.id} onPress={()=>handleDialoguePress(item)}  style={{ paddingHorizontal:15 }}>
                    <DialogueCard  dialogue={item}  />
                </TouchableOpacity>
            ) }
            >
    
    
    
        </FlatList>
    </View>
  )
}

export default ProfileMainPage
