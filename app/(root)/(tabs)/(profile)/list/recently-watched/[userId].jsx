
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground } from 'react-native'
import React, {useRef, useState} from 'react'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useFetchrecommendations, userecommendations, useGetRecommendations, useRecentlyWatched, useGetCurrentlyWatchingItems } from '../../../../../../api/user'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors } from '../../../../../../constants/Colors'
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake , Ellipsis, EllipsisVertical} from 'lucide-react-native';
import { formatDate, getYear } from '../../../../../../lib/formatDate'
import { FilmIcon, TVIcon } from '../../../../../../assets/icons/icons'
// import InfiniteScroll from '../../../components/InfiniteScroll'


const RecentlyWatchedProfile = () => {
    const {userId} = useLocalSearchParams();
   
    const { data : recentlyWatched, loading, refetch, hasMore,  } = useRecentlyWatched(userId)
    const { data : currentlyWatchingItems, loading:loadingCurrentlyWatching, refetch : refetchingCurrentlyWatching, hasMore:hasMoreCurrentlyWatching } = useGetCurrentlyWatchingItems(userId)
        console.log('CURRENTLYWATCHING', currentlyWatchingItems)
    const [ tab, setTab ] = useState('watched')

    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w342';


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
            style={{ paddingTop:30, gap:10, paddingHorizontal:15, paddingBottom:200,alignItems:'center', width:'100%' }}>
            <View className="flex-row w-full justify-center items-center gap-2">
                <Clock9 color='white'  />
                <Text className='text-white text-2xl  font-pbold'>Recently Watched</Text>
            </View>
                {/* <Text className='text-mainGray text-center '>Recently watched titles from @{recentlyWatched.user.username}</Text> */}
            <View className='flex-row gap-3 justify-center items-center mb-3' style={{ borderRadius:10, paddingHorizontal:5, paddingVertical:8, backgroundColor:Colors.mainGrayDark, width:230 }}>
                <TouchableOpacity onPress={()=>setTab('watched')}  style={{ padding:5, borderRadius:5, backgroundColor: tab === 'watched' ? 'white' : null }} >
                  <Text className=' font-pbold text-sm' style={{ color : tab === 'watched' ? Colors.primary : Colors.mainGray }}>Watched</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setTab('currentlyWatching')} style={{ padding:5, borderRadius:5, backgroundColor: tab === 'currentlyWatching' ? 'white' : null }} >
                <Text className='font-pbold text-sm' style={{ color : tab === 'currentlyWatching' ? Colors.primary : Colors.mainGray }} >Currently Watching</Text>
                </TouchableOpacity>
            </View>

            <View style={{ paddingTop:20 }}>
            { tab === 'watched' ? (
<>
                { recentlyWatched.length < 1 ? (
                    <View>
                        <Text className='text-mainGray text-center text-xl font-pmedium' >(List is empty)</Text>
                    </View>
                ) : (
    
                    // <InfiniteScroll data={flattenData} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} isFetching={isFetching}  />
                    <FlatList
                        scrollEnabled={true}
                        data={recentlyWatched}
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
                                <TouchableOpacity onPress={()=>handlePress(item)} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:150,overflow:'hidden' }}>
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
                                    <View className='flex-row justify-center item-end w-full h-full' style={{paddingHorizontal:30, paddingVertical:15}}>
    
                                    <View  className='justify-end items-start w-full h-full' > 
                                        <TouchableOpacity onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                                        
                                            <View className='flex-row gap-1 justify-center items-center'>
                                                { item.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                                                <Text className='text-white text font-pbold'>{ item.movieId ? `${item.movie.title} (${getYear(item.movie.releaseDate)})` : `${item.tv.title} (${getYear(item.tv.releaseDate)})` }</Text>
                                            </View>
                                        </TouchableOpacity>
                                                    <View className="">
                                                       
                                                        <Text className='text-mainGray text-sm '>Watched on {formatDate(item.createdAt)}</Text>
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

</>
            ) : tab === 'currentlyWatching' && (
                <>
                
                { currentlyWatchingItems.length < 1 ? (
                    <View>
                        <Text className='text-mainGray text-center text-xl font-pmedium' >(List is empty)</Text>
                    </View>
                ) : (
    
                    // <InfiniteScroll data={flattenData} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} isFetching={isFetching}  />
                    <FlatList
                        scrollEnabled={true}
                        data={currentlyWatchingItems}
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
                            console.log('Current ITEM',item)
                            return (
                                <TouchableOpacity onPress={()=>handlePress(item)} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:150 , overflow:'hidden'}}>
                                  
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
                                    <View className='flex-row justify-center item-end w-full h-full' style={{paddingHorizontal:30, paddingVertical:15}}>
    
                                    <View  className='justify-end items-start w-full h-full' > 
                                        <TouchableOpacity onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                                        
                                            <View className='flex-row gap-1 justify-center items-center'>
                                                { item.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                                                <Text className='text-white text font-pbold'>{ item.movieId ? `${item.movie.title} (${getYear(item.movie.releaseDate)})` : `${item.tv.title} (${getYear(item.tv.releaseDate)})` }</Text>
                                            </View>
                                        </TouchableOpacity>
                                                    <View className="">
                                                       
                                                        <Text className='text-mainGray text-sm '>Watched on {formatDate(item.createdAt)}</Text>
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
                
                
                </>
            ) }


                </View>
        </View>
    </SafeAreaView>
  )
}

export default RecentlyWatchedProfile

const styles = StyleSheet.create({})