import {  Text, View, FlatList, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard , Linking} from 'react-native'
import { ImageBackground,  } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import React, {useEffect, useState} from 'react'
import {feed} from '../lib/fakeData'
import { RepostIcon, UpIcon, DownIcon, PrayingHandsIcon, MessageIcon, ArrowUpIcon, ArrowDownIcon } from '../assets/icons/icons'
import { Colors } from '../constants/Colors'
import { useClerk, useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { useRouter } from 'expo-router'
import { LinkIcon } from '../assets/icons/icons'
import { useUserDB } from '../lib/UserDBContext'
import { fetchUser, useFetchOwnerUser } from '../api/user'
import { formatDate } from '../lib/formatDate'
import DialogueCard from './DialogueCard'
import { useFetchDialogues } from '../api/dialogue'
import { useFetchUser } from '../api/user'
import { followUser, unfollowUser } from '../api/user'
import { UserCheck, UserPlus,Send, UserPen,  LogOut } from 'lucide-react-native'; // Example icons

    const ProfileMainPage = ( { user, refetchUser, isFetchingUser } ) => {

        if (!user || isFetchingUser) {
            
            refetchUser();
            return (
                <View className='w-full h-full bg-primary'>
            <ActivityIndicator></ActivityIndicator>  
                </View>

            )
        } 

        console.log('user', user)
        // useEffect(()=> {
        //     refetchUser();
        // }, [ user ])

        const { signOut } = useClerk();
        const { user:clerkUser } = useUser();
        const router = useRouter();
        const posterURL = 'https://image.tmdb.org/t/p/original';


        const [ refreshing, setRefreshing ] = useState(false)
       

        const { data: dialogues, refetch, isFetching } = useFetchDialogues( Number(user.id) );
        const { data:ownerUser } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })
        const isOwnersProfilePage = user.id === ownerUser.id
        const [ isFollowing, setIsFollowing ] = useState(null)

        useEffect(()=>{
            // const checkFollow = ownerUser.following.some( item => item.followingId === user.id );
            const checkFollow = user.followers.some( item => item.followingId === ownerUser.id );
            console.log('check follow', checkFollow)
        if (checkFollow){
            setIsFollowing(true);

        } else {
            setIsFollowing(false)
        }
        console.log(isFollowing)
        }, [])

       

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

        const handleFollow = async () => {

            const followData = {
                followerId : Number(ownerUser.id),
                followingId : Number(user.id)
            }
            if (isFollowing){
                const unfollow = await unfollowUser( followData )
            } else {
                const follow = await followUser( followData )
            }
            setIsFollowing(prev => !prev)
            await refetchUser();
        }
    
        const handleLinkPress = async (url) => {
            console.log('trying to open link', url)
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url); // Opens in default browser
            } else {
                Alert.alert("Can't open this URL", url);
            }
        };

        if (isFetchingUser){
            return (
            <View className="bg-primary w-full h-full">
                <ActivityIndicator></ActivityIndicator>
            </View>
            )
        }


  return (
   
    <View className='w-full h-full bg-primary'>
        <FlatList
            data={dialogues}
            refreshControl={
                <RefreshControl
                tintColor={Colors.secondary}
                refreshing={isFetching}
                onRefresh={()=>{refetch(); refetchUser()}} 
                />
                }
            keyboardShouldPersistTaps="handled" 
            keyExtractor={ (item) => item.id }
            ListHeaderComponent={(
               
                <View className='justify-center items-center flex gap-3 ' style={{  marginTop:0, overflow:'hidden'}}>
                    <Image
                        style={{
                        width: '100%',
                        top:0,
                        height: 400,
                        position: 'absolute',
                        borderRadius:30
                        }}
                        source={{ uri: user.profilePic }}
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
                    <View className='px-4 items-center ' style={{marginTop:275, gap:15}}>
                        
                        <View className='items-center' style={{gap:10}}>
                            <View className='gap-1 justify-center items-center mb-5'>
                                <Text className='text-secondary font-pblack text-2xl'>{user.firstName} {user.lastName}</Text>
                                <Text className='text-white font-pbold '>@{user.username}</Text>
                            </View>
                            <Text className='text-third font-pcourier leading-5 ' style={{paddingHorizontal:20}}>{user.bio}</Text>
                        </View>
                        { user.bioLink && (
                        <TouchableOpacity onPress={()=>handleLinkPress(user.bioLink)} className='flex-row gap-2 opacity-60'  style={{backgroundColor:'black', paddingVertical:5, paddingHorizontal:20, borderRadius:10}}>
                            <LinkIcon size={16} color={Colors.mainGray} />
                            <Text className='text-mainGray text-sm  font-psemibold' >{user.bioLink}</Text>
                        </TouchableOpacity>
                        ) }
                        <View className='flex-row gap-6' style={{marginTop:0}}>
                            <View className='flex-row gap-2 justify-center items-center'>
                                <Text className='text-gray-400 text-lg font-pblack'>{user.followers.length}</Text>
                                <Text className='text-gray-400 text-sm font-psemibold'>Followers</Text>
                            </View>
                            <View className='flex-row gap-2 justify-center items-center'>
                                <Text className='text-gray-400 text-lg font-pblack'>{user.following.length}</Text>
                                <Text className='text-gray-400 text-sm font-psemibold'>Following</Text>
                            </View>
                            {/* <View className='flex-row gap-2 justify-center items-center'>
                                <Text className='text-gray-400 text-lg font-pblack'>21</Text>
                                <Text className='text-gray-400 text-sm font-psemibold'>Credits</Text>
                            </View> */}
                        </View>
                        <View className='w-full justify-center items-center mt-4' >
                            <Text className='font-pbold text-mainGray'>Current Rotation</Text>
                            { user.currentRotation.length > 0 ? (
                            <FlatList
                                data={user.currentRotation}
                                horizontal
                              
                                contentContainerStyle={{ width:'100%', height:100, justifyContent:'center', alignItems:'center' }}
                                scrollEnabled={false}
                                keyExtractor={item => item.id}
                                renderItem={ ({item}) => {
                                    return (
    
                                    <TouchableOpacity onPress={() => handleRotationPress(item)} style={{ marginRight:10 }}>
                                        <Image
                                            source={{uri: item.movie ? `${posterURL}${item.movie.posterPath}` : item.tv ? `${posterURL}${item.tv.posterPath}` : null }}
                                            contentFit='cover'
                                            style={{ width:50, height:80, borderRadius:10, overflow:'hidden' }}
                                        />
                                    </TouchableOpacity>
                                ) }}
                            >
    
                            </FlatList>

                            ) : (
                                <Text className='text-mainGray text-sm mb-5'>(No titles added)</Text>
                            ) }
                        </View>
                    </View>

                    { isOwnersProfilePage ? (
                    <View className='flex-row gap-2 mb-10'>
                        <TouchableOpacity onPress={handleEditProfile} style={{ paddingVertical:6, paddingHorizontal:10, borderWidth:1.5, borderColor:Colors.mainGray, borderRadius:10, flexDirection:'row', gap:5, justifyContent:'center', alignItems:'center' }} >
                            <UserPen color={Colors.mainGray} size={16}/>
                            <Text style={{fontWeight:'bold', fontFamily:'Geist-Medium' ,color:Colors.mainGray  }}>Edit profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSignOut}  style={{ paddingVertical:6, paddingHorizontal:10, borderWidth:1.5, borderColor:Colors.mainGray, borderRadius:10, flexDirection:'row', gap:5, justifyContent:'center', alignItems:'center' }} >
                        <LogOut color={Colors.mainGray} size={16}/>
                                <Text className='' style={{fontWeight:'bold', fontFamily:'Geist-Medium' ,color:Colors.mainGray}}>Sign Out</Text>
                        </TouchableOpacity>

                    </View>
                    ) :(
                        <View className='flex-row gap-2 mb-10'>
                            <TouchableOpacity onPress={handleFollow} style={{ paddingVertical:6, paddingHorizontal:10, borderWidth:1.5, backgroundColor:isFollowing ? Colors.secondary : null , borderColor:Colors.secondary, borderRadius:10,  flexDirection:'row', justifyContent:'center', alignItems:'center', gap:5 }}>

                                 { isFollowing ? (
                                    < View className='flex-row gap-3'>
                                    <UserCheck strokeWidth={2.5} color={ isFollowing ? Colors.primary : Colors.secondary} size={18}/>
                                    <Text style={{fontWeight:'bold', fontFamily:'Geist-Medium' ,color:Colors.primary }} >Following</Text>
                                    </View>
                                ) : (
                                    <View className='flex-row gap-3'>
                                    <UserPlus strokeWidth={2.5} color={Colors.secondary} size={18} />
                                    <Text style={{fontWeight:'bold', fontFamily:'Geist-Medium' ,color:Colors.secondary }} >Follow</Text>
                                    </View>
                                ) } 
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={{ paddingVertical:6, paddingHorizontal:10, borderWidth:1.5, borderColor:Colors.secondary, borderRadius:10, flexDirection:'row', justifyContent:'center', alignItems:'center', gap:5 }}>
                                <Send color={Colors.secondary} size={18} ></Send><Text style={{ fontWeight:'bold', fontFamily:'Geist-Medium', color:Colors.secondary  }}>Message</Text>
                            </TouchableOpacity> */}
                        </View>
                    )}
    
                   
    
                </View>
            )}
            contentContainerStyle={{gap:15}}
            renderItem={({item}) => (
            
                <TouchableOpacity key={item.id} onPress={()=>handleDialoguePress(item)}  style={{ paddingHorizontal:15 }}>
                    <DialogueCard  dialogue={item} refetch={refetch} isBackground={true} />
                </TouchableOpacity>
            ) }
            >
    
    
    
        </FlatList>
    </View>
  )
}

export default ProfileMainPage
