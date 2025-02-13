import {  Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
import { ImageBackground,  } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import {feed} from '../lib/fakeData'
import { RepostIcon, UpIcon, DownIcon, PrayingHandsIcon, MessageIcon, ArrowUpIcon, ArrowDownIcon } from '../assets/icons/icons'
import { Colors } from '../constants/Colors'


const ProfileMainPage = () => {

  return (
   
        <FlatList
        data={feed}
        
        keyExtractor={ (item) => item.id }
        ListHeaderComponent={(
           
            <View className='justify-center items-center flex gap-3 ' style={{  marginTop:0}}>
                <ImageBackground
                    className='top-0'
                    style={{width : '100%', height: 400, position:'absolute', top:0}}
                    source={require('../assets/images/drewcamera.jpg')}
                    resizeMethod='cover'
                    
                    >

                    <LinearGradient 
                        colors={[ 'transparent',Colors.primary]} 
                        style={{height : '100%', width : '100%'}}>
                    </LinearGradient>
                </ImageBackground>
                <View className='px-4 items-center ' style={{marginTop:245, gap:15}}>
                    {/* <Image
                        source={require('../assets/images/drewcamera.jpg')}
                        style={{ width:100, height:100, borderRadius:50, marginBottom:18 }}
                        resizeMethod='cover'
                        className='w-full mt-20'
                        /> */}
                    <View className='items-center' style={{gap:10}}>
                        <Text className='text-secondary font-pblack text-2xl'>Andrew Jung</Text>
                        <Text className='text-third font-pcourier leading-5 ' style={{paddingHorizontal:20}}>Cinematographer from Vancouver, Canada.</Text>
                    </View>
                    <Text className='text-gray-400  font-psemibold'>www.andrewjungdp.com</Text>
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
                </View>
               
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
