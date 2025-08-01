import { StyleSheet, Text, View, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState} from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { fetchUser, useFetchOwnerUser, useGetUserRatings } from '../../api/user'
import { useUser } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors'
import { Image } from 'expo-image'
import { BackIcon, FilmIcon, TVIcon } from '../../assets/icons/icons'
import { getYear } from '../../lib/formatDate'
import { userRatingsCategories } from '../../lib/CategoryOptions'
import { ThreeDotsIcon } from '../../assets/icons/icons'
import { Star } from 'lucide-react-native'
import { moviePosterFallback } from '../../constants/Images'

const UserRatingsPage = () => {
    const {userId, firstName} = useLocalSearchParams()
    const {user : clerkUser} = useUser()
    const { data : ownerUser } = useFetchOwnerUser({ email : clerkUser?.emailAddresses[0].emailAddress })
    const { data, refetch, loading, getMore } = useGetUserRatings(userId, 10)

    const [ selected, setSelected ] = useState('All')
    const router = useRouter()
    const isOwnersPage = ownerUser?.id === Number(userId)

   
    const posterURL = 'https://image.tmdb.org/t/p/w500';

    const filteredData = (() => {
        if (selected === 'All') return data; 
        if (selected === 'Movies') return data.filter(i => i.movie);
        if (selected === 'TV') return data.filter(i => i.tv);
        if (selected === 'Highest rated') return [...data].sort((a, b) => b.rating - a.rating);
        if (selected === 'Lowest rated') return [...data].sort((a, b) => a.rating - b.rating);
      })();

    const handlePress = (item) => {
        if (item.movie){
            router.push(`/movie/${item.movie.tmdbId}`)
        } else if (item.tv){
            router.push(`/tv/${item.tv.tmdbId}`)
        }
    }

    const handleThreeDots = (item) => {
        router.push({
            pathname:`/ratingModal`,
            params : { DBmovieId : item?.movie?.id, DBtvId: item?.tv?.id , prevRating : isOwnersPage ?  item.rating : null}
        })
    }

    const handleReviewPress = (item) => {
        router.push(`/review/${item.review.id}`)
    }
      

    if (loading){
        return (
            <View className='w-full h-full bg-primary justify-center items-center'>
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

            <Text className='text-white font-pbold text-3xl'>{firstName}'s ratings</Text>
          </View>
          <Text className='text-mainGray font-pmedium'>A look at their taste in films & shows</Text>
          <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={userRatingsCategories}
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
                    refreshing={loading}
                    onRefresh={refetch}
                    tintColor={Colors.secondary}
                />
            }
            showsVerticalScrollIndicator={false}
            data={filteredData}
            keyExtractor={item => item.id}
            contentContainerStyle={{gap:15, paddingTop:30}}
            onEndReached={getMore}
            onEndReachedThreshold={0}
            renderItem={({item}) => {
                return(
                <View>
                   <View className="flex-row justify-between items-center gap-2">
                        <TouchableOpacity  onPress={()=>{console.log("PRESSEDRATING",item);handlePress(item)}} className='flex-row gap-2 justify-center items-center'>
                            <View className='flex-row gap-3 justify-center items-center'>
                                <Image
                                source={{ uri: `${posterURL}${item.movie ? item.movie.posterPath : item.tv && item.tv.posterPath }` }}
                                placeholder={moviePosterFallback}

                                contentFit='cover'
                                style={{ width:40, height:55, borderRadius:8 }}
                                />
                                <View className='flex-row gap-2' style={{width:180}}>
                                    { item.movie ? (
                                        <FilmIcon size={16} color={Colors.secondary} />
                                    ) : item.tv && (
                                        <TVIcon size={16} color={Colors.secondary} />
                                    ) }
                                    <Text className='text-mainGray text-sm font-pbold'>{item?.movie?.title || item?.tv?.title} ({ getYear(item?.movie?.releaseDate || item?.tv?.releaseDate)})</Text>
                                </View>
                            </View>
                               
                        </TouchableOpacity>
                        <View className='flex-row gap-5 justify-center items-center'>
                        <View className='flex-row justify-center items-center gap-2'>
                                    <Star size={20} color={Colors.secondary}/>
                                    <Text className='text-mainGray text-3xl font-pbold'>{item.rating}</Text>
                                </View>                            
                                { isOwnersPage ? (
                            <TouchableOpacity onPress={()=>handleThreeDots(item)}>
                                <ThreeDotsIcon size={18} color={Colors.mainGray} />
                            </TouchableOpacity>
                            ) : (
                                <View />
                            ) }
                        </View>

                    </View>
                        { item.review.review && (
                        <TouchableOpacity onPress={()=>handleReviewPress(item)}>
                            <Text className='text-white font-pcourier py-2 px-4' numberOfLines={5}>{item.review.review}</Text>
                        </TouchableOpacity>
                    ) }
                </View>
            )}}

        />
        </View>
    </SafeAreaView>
  )
}

export default UserRatingsPage

const styles = StyleSheet.create({})