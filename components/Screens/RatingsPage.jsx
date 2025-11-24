import {  StyleSheet, Text, View, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, RefreshControl, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'

import { Colors } from '../../constants/Colors'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { getYear } from '../../lib/formatDate'
import { titleRatingsCategories } from '../../lib/CategoryOptions'
import { ThreeDotsIcon, BackIcon, FilmIcon, TVIcon } from '../../assets/icons/icons'
import { useGetTitleRatings } from '../../api/rating'
import { Star } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { avatarFallback } from '../../lib/fallbackImages'
import { avatarFallbackCustom } from '../../constants/Images'




const RatingsPage = () => {
    const { type, tab, ratingsId , title, release}  = useLocalSearchParams()

    const data = {
        type,
        ratingsId,
        limit : 10,
    }

    const { ratings, ownerUser, isLoading, refetch, fetchMore, hasMore, friendsRatings, director } = useGetTitleRatings(data)
    const [ selected, setSelected  ] = useState(tab)
    const router = useRouter()

    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';

    const handlePress = (item) => {
        router.push(`/user/${item.user.id}`)
    }

    const handleReviewPress = (item) => {
        router.push(`/review/${item.id}`)
    }

    if (!ownerUser  ){
        return (
            <View>
                <ActivityIndicator />
            </View>
        )
    }
    

  return (
    <View className="w-full h-full bg-primary">
        <View style={{paddingHorizontal:0, paddingBottom:220}}>

        
      
        <View className="gap-0 relative">
        <View className=" w-full ">
           
           <Image
               style={{
               width: '100%',
               top:0,
               height: 300,
               position: 'absolute',
               borderRadius:30,
               }}
               source={{uri : `${posterURL}${ratings[0]?.movie?.backdropPath || ratings[0]?.tv?.backdropPath}`}}
               placeholder={{uri : `${posterURLlow}${ratings[0]?.movie?.backdropPath || ratings[0]?.tv?.backdropPath}`}}
               placeholderContentFit='cover'
               contentFit="cover" 
               transition={300} 
           />
           <LinearGradient
               colors={['transparent', Colors.primary]}
               style={{
               height: 300,
               width: '100%',
               position: 'absolute',
               top:0,
               }}
           />
       </View>
       <View className='px-4 relative pt-40'>
            <TouchableOpacity onPress={()=>router.back()} style={{paddingBottom:10}}>
              <BackIcon size={26} color={Colors.mainGray}/>
            </TouchableOpacity>
          <View className='flex  justify-start items-center pt-[0px] gap-3'>

            <Text className='text-white font-pbold text-3xl'>Ratings for {title} ({getYear(release)})</Text>
            { director && (
                <Text className='text-white ' style={{fontStyle:'italic'}}>Directed by {director.name}</Text>
            ) }
          </View>
          {/* <Text className='text-mainGray font-pmedium'>Ratings for {title}</Text> */}
          <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={ titleRatingsCategories }
          keyExtractor={(item,index) => index}
          contentContainerStyle={{ gap:10 , paddingTop:15}}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=>{setSelected(item); }} style={{ borderRadius:15, backgroundColor:selected===item ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
              <Text className=' font-pmedium' style={{ color : selected===item ? Colors.primary : 'white' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />

      </View>

        <FlatList
            refreshControl={
                <RefreshControl
                    onRefresh={refetch}
                    refreshing={isLoading}
                    tintColor={Colors.secondary}
                />
            }
            showsVerticalScrollIndicator={false}
            data={selected === 'All' ? ratings : selected === 'Your friends' && friendsRatings }
            keyExtractor={item => item.id}
            contentContainerStyle={{gap:15, paddingTop:30, height : '100%', paddingHorizontal:10}}
            onEndReached={()=> {if (hasMore){fetchMore}}}
            onEndReachedThreshold={0}
            renderItem={({item}) => {
                // console.log('flatlistitem', item)
                return(
                    
                <View className='gap-3'>
                
                   <View className="flex-row justify-between items-center gap-2">
                        <TouchableOpacity  onPress={()=>handlePress(item)} className='flex-row gap-2 justify-center items-center'>
                            <View className='flex-row gap-3 justify-between items-center w-full '>
                                <View className='flex-row gap-2 justify-center items-center' style={{}}>
                                    <Image
                                    source={{ uri: item.user.profilePic || avatarFallbackCustom }}
                                    contentFit='cover'
                                    style={{ width:30, height:30, borderRadius:50 }}
                                    />
                                    <Text className='text-mainGray font-pregular'>@{item.user.username}</Text>
                                </View>
                                <View className='flex-row justify-center items-center gap-2'>
                                    <Star size={20} color={Colors.secondary}/>
                                    <Text className='text-mainGray text-3xl font-pbold'>{item.rating}</Text>
                                </View>
                            </View>
                               
                        </TouchableOpacity>
                        {/* <View className='flex-row gap-5 justify-center items-center'>
                            <Text className='text-mainGray text-xl font-pbold'>{item.rating}</Text>
                            { isOwnersPage ? (
                            <TouchableOpacity onPress={()=>handleThreeDots(item)}>
                                <ThreeDotsIcon size={18} color={Colors.mainGray} />
                            </TouchableOpacity>
                            ) : (
                                <View />
                            ) }
                        </View> */}

                    </View>
                    { item?.review?.review && (
                        <TouchableOpacity onPress={()=>handleReviewPress(item.review)}>
                            <Text className='text-white font-pcourier py-2 px-4' numberOfLines={5}>{item.review.review}</Text>
                        </TouchableOpacity>
                    ) }
                </View>
            )}}

        />
        </View>
        </View>
    </View>
  )
}

export default RatingsPage

const styles = StyleSheet.create({})