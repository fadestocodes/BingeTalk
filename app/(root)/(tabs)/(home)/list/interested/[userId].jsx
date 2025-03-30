
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground } from 'react-native'
import React, {useRef} from 'react'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useFetchrecommendations, userecommendations, useGetRecommendations, useGetWatchlistItems, useGetInterestedItems } from '../../../../../../api/user'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors } from '../../../../../../constants/Colors'
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake , Ellipsis, EllipsisVertical} from 'lucide-react-native';
import { formatDate, getYear } from '../../../../../../lib/formatDate'
import { FilmIcon, TVIcon } from '../../../../../../assets/icons/icons'
import { deleteInterested } from '../../../../../../api/user'
// import InfiniteScroll from '../../../components/InfiniteScroll'


const interestedFromProfile = () => {
    const {userId} = useLocalSearchParams();
    // const { data:interestedItems, refetch, isFetching  } = useFetchrecommendations(userId);
    // const {
    //     data,
    //     fetchNextPage,
    //     hasNextPage,
    //     isFetching,
    //     isFetchingNextPage,
    //     isLoading,
    //     refetch
    // } = useFetchrecommendations(userId);
    // console.log('DATAAA', data)

    // const interestedItems = data?.pages.flatMap(page => page.items) || [];
    const { data : interestedItems, loading, refetch, hasMore,removeItem  } = useGetInterestedItems(userId)

    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w342';

    const router = useRouter()


    
    const handlePress = (item) => {
        if (item.movie){
          router.push(`/movie/${item.movie.tmdbId}`)
        }
        if (item.tv){
          router.push(`/tv/${item.tv.tmdbId}`)
        }
    }
    

        const ITEM_HEIGHT = 50

        const handleOptions = () => {
            
        }

        const handleRemove = async (item) => {
            const data = {
                userId : Number(userId),
                movieId : item.movieId || null,
                tvId : item.tvId
            }
            const deletedItem = await deleteInterested(data)
            removeItem(item)
        }


  // if (loading  ){
  //   return(
  //       <View style={{ backgroundColor:Colors.primary, width:'100%', height:'100%' }}>   
  //    <RefreshControl tintColor={Colors.secondary}   />
  //    </View>
  //   )
  // }

  return (
    <SafeAreaView className='w-full h-full bg-primary justify-start items-center' style={{  paddingTop:100, paddingHorizontal:15 }}>
       <View 
            refreshControl={
                <RefreshControl
                    tintColor={Colors.secondary}
                    refreshing={loading}
                    onRefresh={refetch}
                />
            }
            style={{ paddingTop:30, gap:10, width:'100%', paddingHorizontal:15, paddingBottom:100 }}>
            <View className='justify-center items-center'>
            <View className="flex-row justify-center items-center gap-2">
                <BadgeHelp color='white'  />
                <Text className='text-white text-2xl font-pbold'>Interested</Text>
                </View>
                {/* <Text className='text-mainGray text-center '>Recently watched titles from @{interestedItems.user.username}</Text> */}
            </View>
            <View style={{ paddingTop:20 }}>
            { interestedItems.length < 1 ? (
                <View>
                    <Text className='text-mainGray text-center text-xl font-pmedium' >(List is empty)</Text>
                </View>
            ) : (

                // <InfiniteScroll data={flattenData} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} isFetching={isFetching}  />
                <FlatList
                    scrollEnabled={true}
                    data={interestedItems}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ width:'100%', gap:10, paddingBottom:100 }}
                    // onEndReached={()=>reachedEnd()}
                    onEndReached={() => {
                      // if (hasNextPage && !isFetchingNextPage) {
                      //     fetchNextPage();
                      //     // refetch()
                      // }
                      if ( hasMore  ){
                        refetch()
                      }
                  }}
                   
                    
                    onEndReachedThreshold={0.1}
                    // ListFooterComponent={ loading ? <ActivityIndicator /> : <></>}
                    renderItem={({item})=>{
                        return (
                            <TouchableOpacity onPress={()=>handlePress(item)} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:150, overflow:'hidden' }}>
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
                                <View className='flex-row justify-between items-end w-full h-full' style={{paddingHorizontal:15, paddingVertical:15}}>

                                <View  className='justify-end items-start  h-full' style={{maxWidth:220}} > 
                                    <TouchableOpacity onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                                    
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
            )  }
                </View>
        </View>
    </SafeAreaView>
  )
}

export default interestedFromProfile

const styles = StyleSheet.create({})