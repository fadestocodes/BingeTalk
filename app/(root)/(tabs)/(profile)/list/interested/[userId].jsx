
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Image, ImageBackground } from 'react-native'
import React, {useRef} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useFetchrecommendations, userecommendations, useGetRecommendations, useGetWatchlistItems, useGetInterestedItems } from '../../../../../../api/user'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors } from '../../../../../../constants/Colors'
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake , Ellipsis, EllipsisVertical} from 'lucide-react-native';
import { formatDate, getYear } from '../../../../../../lib/formatDate'
import { FilmIcon, TVIcon } from '../../../../../../assets/icons/icons'
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
    const { data : interestedItems, loading, refetch, hasMore,  } = useGetInterestedItems(userId)

    const posterURL = 'https://image.tmdb.org/t/p/original';

  console.log('data', interestedItems)
  // const flattenData = data?.pages.flatMap((page) => page.items) || [];
  // console.log(flattenData)




    // console.log('recently watched ARRAY', interestedItems)
    const router = useRouter()


    
    const handlePress = (item) => {
        console.log('tmbdbId', item.tmdbId)
        if (item.movie){
          router.push(`/movie/${item.movie.tmdbId}`)
        }
        if (item.tv){
          router.push(`/tv/${item.tv.tmdbId}`)
        }
    }
    

        // const reachedEnd = () => {
        //     if ( hasMore  && !loading  ) {
        //         refetch();
        //     }
        // }
        const ITEM_HEIGHT = 50

        const handleOptions = () => {
            
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
                        console.log('RECOMMENDED ITEM',item)
                        return (
                            <TouchableOpacity onPress={()=>handlePress(item)} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:150 }}>
                                <ImageBackground
                                    style={{width : '100%', height: '100%', position:'absolute', borderRadius:15, overflow:'hidden' }}
                                    source={{uri : `${posterURL}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }`}}
                                    resizeMethod='cover'
                                    >
                                    <LinearGradient
                                        colors={[ 'transparent','black']}
                                        style={{height : '100%', width : '100%'}}>
                                    </LinearGradient>
                                </ImageBackground>
                                <View className='flex-row justify-center item-end w-full h-full' style={{paddingHorizontal:30, paddingVertical:15}}>

                                <View  className='justify-end items-start w-full h-full' > 
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
                                            <TouchableOpacity onPress={handleOptions} style={{justifyContent:'flex-end', alignItems:'flex-end'}}>
                                                <EllipsisVertical size={20} color={Colors.mainGray} />
                                            </TouchableOpacity>
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