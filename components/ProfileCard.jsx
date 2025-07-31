import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { avatarFallback } from '../lib/fallbackImages'
import { Colors } from '../constants/Colors'

const ProfileCard = ({user}) => {

    const posterURL = 'https://image.tmdb.org/t/p/w342';

  return (
    <View className=' justify-center items-center gap-5   ' style={{backgroundColor:Colors.mainGrayDark, borderRadius:15, width:300, justifyContent:'center', alignItems:'center', paddingHorizontal:15, paddingVertical:20}}>

        <View className='flex-row gap-3 justify-center items-center  '>
            <Image 
                source={{ uri: user.profilePic  || avatarFallback}}
                contentFit='cover'
                style={{ borderRadius:'50%', overflow:'hidden', width:50, height:50 }}
            />
            <View className=' justify-center items-center break-words' style={{maxWidth:'70%'}}>
                <Text className='text-secondary font-pbold text-lg' style={{lineHeight:15}}>{user.firstName} {user.lastName}</Text>
                <Text className='text-mainGray font-pregular text-sm'style={{lineHeight:15}} >@{user.username}</Text>
            </View>
        </View>
            {/* { user.bio && (
                <Text className='text-mainGray text-sm font-pcourier'>{user.bio}</Text>
            )} */}
            <FlatList
                data={user.currentRotation}
                contentContainerStyle={{ flexDirection:'row', gap:10}}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <Image
                        source={{ uri: `${posterURL}${item?.movie?.posterPath || item?.tv?.posterPath}` }}
                        contentFit='cover'
                        style={{ width:45, height:70, borderRadius:10, overflow:'hidden' }}
                        
                    />
                )}
            />
    </View>
  )
}

export default ProfileCard