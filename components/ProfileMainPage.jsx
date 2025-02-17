import {  Text, View, FlatList, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import { ImageBackground,  } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React, {useState} from 'react'
import {feed} from '../lib/fakeData'
import { RepostIcon, UpIcon, DownIcon, PrayingHandsIcon, MessageIcon, ArrowUpIcon, ArrowDownIcon } from '../assets/icons/icons'
import { Colors } from '../constants/Colors'
import { useClerk } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { useRouter } from 'expo-router'
import { LinkIcon } from '../assets/icons/icons'
import { useUserDB } from '../lib/UserDBContext'
import { fetchUser } from '../api/user'


    const ProfileMainPage = ( ) => {


        const { signOut } = useClerk();
        const router = useRouter();
        const posterURL = 'https://image.tmdb.org/t/p/original';
        const [ refreshing, setRefreshing ] = useState(false)
        const { userDB, updateUserDB } = useUserDB()



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

        const refreshData = async () => {
            setRefreshing(true);
            try {
                const userDBFetch = await fetchUser(userDB.email); // Example of refetching by email
                updateUserDB(userDBFetch);
            } catch (err) {
                console.log('Error trying to fetch user from profile',err)
            }
            setRefreshing(false)
        }

  return (
   
        <FlatList
        data={feed}
        refreshControl={
            <RefreshControl
            tintColor={Colors.secondary}
            refreshing={refreshing}
            onRefresh={refreshData}
          />
        }
        keyExtractor={ (item) => item.id }
        ListHeaderComponent={(
           
            <View className='justify-center items-center flex gap-3 ' style={{  marginTop:0}}>
                <ImageBackground
                    className='top-0'
                    style={{width : '100%', height: 400, position:'absolute', top:0}}
                    source={{ uri:userDB.profilePic }}
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

                <TouchableOpacity onPress={handleSignOut}>
                        <Text>Sign Out</Text>
                </TouchableOpacity>
               
                <View  style={{ width:350, }}  className=' border-t-[.5px] mt-4 border-mainGray items-center self-center shadow-md shadow-black-200'/>

            </View>
        )}
        renderItem={({item}) => (
        <View className='px-6'>
            <View className='flex justify-center items-start gap-2 mt-4 mb-1 w-full '>
            <View className='flex-row justify-center items-center gap-4'>
                <Image
                source = {require( "../assets/images/drewcamera.jpg")}
                style = {{ width:30, height: 30, borderRadius:50 }}
                resizeMethod='cover'
                />
                <Text className='text-gray-400   font-pregular text-wrap flex-wrap flex-1'>{ item.notification } </Text>

            </View>
            { item.parentComment && (

                <View className='my-2 justify-center items-center w-full'>
                <Text className='text-secondary font-pcourier uppercase text-lg ' >{item.parentAuthor}</Text>

                    <Text className='text-third font-pcourier text-lg leading-5 px-6' numberOfLines={3}> { item.parentComment } </Text>
                </View>
            ) }
            { item.dialogue && (
                <View className='my-2 justify-center items-center w-full'>
                <Text className='text-secondary font-pcourier uppercase text-lg ' >{item.user}</Text>

                    <Text className='text-third font-pcourier text-lg leading-5 px-6'> { item.dialogue } </Text>
                </View>
            )  }

                { item.poster ? (
                <View className='w-full items-center'>
                <Image
                    source={{uri:item.poster}}
                    style={{ width:300, height:200, borderRadius:10 }}
                    resizeMethod='contain'
                    />
                </View>
                ) : (
                <View></View>
                )}
            <View className=' flex-row items-end justify-between  w-full my-2'>
                <View className='flex-row gap-4 items-center justify-center '>
                    <TouchableOpacity >
                    <View className='flex-row  justify-center items-center border-2 rounded-xl border-mainGray py-1 px-2 ' style={{height:32, borderColor:Colors.mainGray}}>
                        <ArrowUpIcon className=' ' size='18' color={Colors.mainGray} />
                        { item.upVotes && item.upVotes > 0 && (
                        <Text className='text-xs font-pbold text-gray-400  '> {item.upVotes}</Text>
                        )  }
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity >
                    <View  className='flex-row  justify-center items-center border-2 rounded-xl border-mainGray py-1 px-2 ' style={{height:32, borderColor:Colors.mainGray}}>
                        <ArrowDownIcon className=' ' size='18' color={Colors.mainGray} />
                        { item.downVotes && item.downVotes > 0 && (
                        <Text className='text-xs font-pbold text-gray-400  '> {item.downVotes}</Text>
                        )  }
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity >
                    <View className='flex-row  justify-center items-center border-2 rounded-xl border-mainGray py-1 px-2 ' style={{height:32, borderColor:Colors.mainGray}}>
                        <MessageIcon className='' size='18' color={Colors.mainGray} />
                        { item.downVotes && item.downVotes > 0 && (
                        <Text className='text-xs font-pbold text-gray-400  '> {item.downVotes}</Text>
                        )  }
                    </View>
                    </TouchableOpacity>
                   
                    <TouchableOpacity >
                    <View className='flex-row  justify-center items-center border-2 rounded-xl border-mainGray py-1 px-2' style={{height:32, borderColor:Colors.mainGray}}>
                        <RepostIcon className='' size='14' color={Colors.mainGray} />
                        { item.credits && item.reposts > 0 && (
                        <Text className='text-xs font-pbold text-gray-400  '> {item.reposts}</Text>
                        )  }
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity >
                    <View className='flex-row  justify-center items-center border-2 rounded-xl border-mainGray py-1 px-2' style={{height:32, borderColor:Colors.mainGray}}>
                        <PrayingHandsIcon className='' size='20' color={Colors.mainGray} />
                        { item.credits && item.credits > 0 && (
                        <Text className='text-xs font-pbold text-gray-400  '>{item.credits}</Text>
                        )  }
                    </View>
                    </TouchableOpacity>
                </View>
            </View>
            </View>
            <View className='w-full border-t-[.5px] border-mainGray items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGray}}/>
        </View>
        ) }
        >



    </FlatList>
  )
}

export default ProfileMainPage
