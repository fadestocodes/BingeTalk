import {  StyleSheet, Text, View, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, RefreshControl, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useUser } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { getYear } from '../../lib/formatDate'
import { titleRatingsCategories } from '../../lib/CategoryOptions'
import { ThreeDotsIcon, BackIcon, FilmIcon, TVIcon } from '../../assets/icons/icons'
import { useGetTitleRatings } from '../../api/rating'
import { Star } from 'lucide-react-native'



const RatingsPage = () => {
    const { type, tab, ratingsId , title, release}  = useLocalSearchParams()
    console.log('TABBB', tab)

    const data = {
        type,
        ratingsId,
        limit : 10,
    }

    const { ratings, ownerUser, isLoading, refetch, fetchMore, hasMore } = useGetTitleRatings(data)
    const [ selected, setSelected  ] = useState(tab)
    const router = useRouter()

    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';

    const handlePress = (item) => {
        router.push(`/user/${item.user.id}`)
    }

    if (!ownerUser  ){
        return (
            <View>
                <ActivityIndicator />
            </View>
        )
    }
    

  return (
    <SafeAreaView className="w-full h-full bg-primary">
        <View style={{paddingHorizontal:15, paddingBottom:220}}>

        
      
        <View className="gap-0">
      <TouchableOpacity onPress={()=>router.back()} style={{paddingBottom:10}}>
              <BackIcon size={26} color={Colors.mainGray}/>
            </TouchableOpacity>
          <View className='flex-row  justify-start items-center'>

            <Text className='text-white font-pbold text-3xl'>Ratings for {title} ({getYear(release)})</Text>
          </View>
          {/* <Text className='text-mainGray font-pmedium'>Ratings for {title}</Text> */}
          <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={titleRatingsCategories}
          keyExtractor={(item,index) => index}
          contentContainerStyle={{ gap:10 , paddingTop:15}}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=>{setSelected(item) }} style={{ borderRadius:15, backgroundColor:selected===item ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
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
            // scrollEnabled={false}
            data={ratings}
            keyExtractor={item => item.id}
            contentContainerStyle={{gap:15, paddingTop:30, height : '100%'}}
            onEndReached={fetchMore}
            onEndReachedThreshold={0}
            renderItem={({item}) => {
                // console.log('flatlistitem', item)
                return(
                <View>
                   <View className="flex-row justify-between items-center gap-2">
                        <TouchableOpacity  onPress={()=>handlePress(item)} className='flex-row gap-2 justify-center items-center'>
                            <View className='flex-row gap-3 justify-between items-center w-full '>
                                <View className='flex-row gap-2 justify-center items-center' style={{}}>
                                    <Image
                                    source={{ uri: item.user.profilePic }}
                                    contentFit='cover'
                                    style={{ width:35, height:35, borderRadius:50 }}
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
                </View>
            )}}

        />
        </View>
    </SafeAreaView>
  )
}

export default RatingsPage

const styles = StyleSheet.create({})