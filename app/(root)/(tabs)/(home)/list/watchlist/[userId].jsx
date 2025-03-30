
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground } from 'react-native'
import React, {useRef, useState, useEffect} from 'react'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useFetchrecommendations, userecommendations, useGetRecommendations, useGetWatchlistItems } from '../../../../../../api/user'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors } from '../../../../../../constants/Colors'
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake , Ellipsis, EllipsisVertical} from 'lucide-react-native';
import { formatDate, getYear } from '../../../../../../lib/formatDate'
import { FilmIcon, TVIcon } from '../../../../../../assets/icons/icons'
import { markMovieWatchlist } from '../../../../../../api/movie'
import { markTVWatchlist } from '../../../../../../api/tv'
// import InfiniteScroll from '../../../components/InfiniteScroll'


const watchlistItemsProfile = () => {
    const {userId} = useLocalSearchParams();
    const { data : watchlistItems, loading, refetch, hasMore, fetchMore, removeItem } = useGetWatchlistItems(userId)
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const router = useRouter()
    
    const handlePress = (item) => {
        if (item.movie){
          router.push(`/movie/${item.movie.tmdbId}`)
        }
        if (item.tv){
          router.push(`/tv/${item.tv.tmdbId}`)
        }
    }
    

    const handleRemove = async  (item) => {
        if (item.movie){
            const data = {
                movieId : item.movie.id,
                userId : Number(userId)
            }
            const removedMovie = await markMovieWatchlist(data)
            removeItem(item)

        } else if(item.tv){
            const data = {
                tvId : item.tv.id,
                userId : Number(userId)
            }
            const removedMovie = await markTVWatchlist(data)
            removeItem(item)
        }
    }



  return (
    <SafeAreaView className='w-full h-full bg-primary justify-start items-center' style={{  paddingTop:100, paddingHorizontal:15 }}>
       <View 
           
            style={{ paddingTop:30, gap:10, width:'100%', paddingHorizontal:15, paddingBottom:100 }}>
                { loading && <ActivityIndicator color={Colors.secondary}/> }
            <View className='justify-center items-center'>
            <View className="flex-row justify-center items-center gap-2">
                <ListChecks color='white'  />
                <Text className='text-white text-2xl font-pbold'>Watchlist</Text>
                </View>
                {/* <Text className='text-mainGray text-center '>Recently watched titles from @{watchlistItems.user.username}</Text> */}
            </View>
            <View style={{ paddingTop:20 }}>
            { watchlistItems.length < 1 ? (
                <View>
                    <Text className='text-mainGray text-center text-xl font-pmedium' >(List is empty)</Text>
                </View>
            ) : (



                <FlatList
                // refreshControl={
                //     <RefreshControl
                //         tintColor={Colors.secondary}
                //         refreshing={loading}
                //         onRefresh={refetch}
                //     />
                // }
                    scrollEnabled={true}
                    data={watchlistItems}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ width:'100%', gap:10, paddingBottom:100 }}
                    // onEndReached={()=>reachedEnd()}
                    onEndReached={() => {
                      // if (hasNextPage && !isFetchingNextPage) {
                      //     fetchNextPage();
                      //     // refetch()
                      // }
                      if ( hasMore  ){
                        fetchMore()
                      }
                  }}
                   
                    
                    onEndReachedThreshold={0.1}
                    // ListFooterComponent={ loading ? <ActivityIndicator /> : <></>}
                    renderItem={({item})=>{
                        return (
                            <TouchableOpacity onPress={()=>handlePress(item)} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:150, overflow:'hidden', width:'100%' }}>
                                <Image
                                    style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    }}
                                    source={{ uri: `${posterURL}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }` }}
                                    placeholder={{ uri: `${posterURLlow}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }`  }}
                                    placeholderContentFit="cover"
                                    contentFit="cover" // Same as resizeMode='cover'
                                    transition={300} // Optional: Adds a fade-in effect
                                />
                                <LinearGradient
                                    colors={['transparent', 'black']}
                                    style={{
                                    height: '100%',
                                    width: '100%',
                                    position: 'absolute',
                                    }}
                                />
                                <View className='flex-row justify-between items-end w-full h-full ' style={{paddingHorizontal:15, paddingVertical:15, width:'100%'}}>

                                <View  className='justify-end items-start ' > 
                                    <TouchableOpacity onPress={()=>handlePress(item)  } style={{maxWidth:220}} className = 'flex-row gap-5 justify-start items-center ' >
                                    
                                        <View className='flex-row gap-1 justify-center items-center'>
                                            { item.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                                            <Text className='text-white text font-pbold'>{ item.movieId ? `${item.movie.title} (${getYear(item.movie.releaseDate)})` : `${item.tv.title} (${getYear(item.tv.releaseDate)})` }</Text>
                                        </View>
                                    </TouchableOpacity>
                                                <View className="">
                                                   
                                                    <Text className='text-mainGray text-sm '>Added on {formatDate(item.createdAt)}</Text>
                                                </View>
                                </View>
                                <View className='flex-row gap-3 items-center justify-center ' >
                                    <TouchableOpacity onPress={()=>handleRemove(item)} style={{ backgroundColor : Colors.secondary, paddingHorizontal:8, paddingVertical:5, borderRadius:10 }}>
                                        <Text className='text-primary font-pbold text-sm'>Remove</Text>
                                    </TouchableOpacity>
                                            <TouchableOpacity style={{}}>
                                                <EllipsisVertical size={20} color={Colors.mainGray} />
                                            </TouchableOpacity>
                                </View>
                                </View>
                            {/* <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/> */}
                            </TouchableOpacity>
                    )}}
                />
                ) }
            {/* )  } */}
                </View>
        </View>
    </SafeAreaView>
  )
}

export default watchlistItemsProfile

const styles = StyleSheet.create({})