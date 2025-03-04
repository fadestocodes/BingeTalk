// import { StyleSheet, Image, Platform, View, Text } from 'react-native';

// import { SafeAreaView } from 'react-native-safe-area-context'
     


// export default function TabTwoScreen() {
//   return (
//     <SafeAreaView className='flex flex-1 justify-center items-center w-full h-full bg-primary' >
//       <View className='flex justify-center items-center'>
//           <Text className='text-secondary font-pblack text-3xl'>Rooms</Text>
//           <Text className='text-third font-pmedium leading-8'>Enter and chat.</Text>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   headerImage: {
//     color: '#808080',
//     bottom: -90,
//     left: -35,
//     position: 'absolute',
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
// });


import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, {useRef} from 'react'
import { useFetchRecentlyWatched , useRecentlyWatched} from '../../../api/user'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors } from '../../../constants/Colors'
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake } from 'lucide-react-native';
import { formatDate } from '../../../lib/formatDate'
import { FilmIcon, TVIcon } from '../../../assets/icons/icons'
// import InfiniteScroll from '../../../components/InfiniteScroll'


const RecentlyWatchedFromProfile = () => {
    // const {userId} = useLocalSearchParams();
    const userId = 70
    // const { data:recentlyWatched, refetch, isFetching  } = useFetchRecentlyWatched(userId);
    // const {
    //     data,
    //     fetchNextPage,
    //     hasNextPage,
    //     isFetching,
    //     isFetchingNextPage,
    //     isLoading,
    //     refetch
    // } = useFetchRecentlyWatched(userId);
    // console.log('DATAAA', data)

    // const recentlyWatched = data?.pages.flatMap(page => page.items) || [];
    const { data : recentlyWatched, loading, refetch, hasMore,  } = useRecentlyWatched(userId)

  //   const { 
  //     data, 
  //     fetchNextPage, 
  //     hasNextPage, 
  //     isFetchingNextPage ,
  //     isFetching
      
  // } = useFetchRecentlyWatched(userId);


  console.log('data', recentlyWatched)
  // const flattenData = data?.pages.flatMap((page) => page.items) || [];
  // console.log(flattenData)




    // console.log('recently watched ARRAY', recentlyWatched)
    const router = useRouter()

    const listRef = useRef();

    
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
            style={{ paddingTop:30, gap:15, width:'100%', paddingHorizontal:20, paddingBottom:100 }}>
            <View className='justify-center items-center'>
            <View className="flex-row justify-center items-center gap-2">
                <Clock9 color='white'  />
                <Text className='text-white text-2xl font-pbold'>Recently Watched</Text>
                </View>
                {/* <Text className='text-mainGray text-center '>Recently watched titles from @{recentlyWatched.user.username}</Text> */}
            </View>
            <View style={{ paddingTop:50 }}>
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
                    contentContainerStyle={{ width:'100%', gap:50, paddingBottom:100 }}
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
                        console.log('ITEM',item.id)
                        return (
                            <View className='gap-20'>
                        <TouchableOpacity onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                            <Text className='text-mainGray text-sm '>{formatDate(item.createdAt)}</Text>
                            <View className='flex-row gap-1 justify-center items-center'>
                                { item.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                                <Text className='text-white text font-pbold'>{ item.movieId ? `${item.movie.title}` : `${item.tv.title}` }</Text>
                            </View>
                        </TouchableOpacity>
                            <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>
                            </View>
                    )}}
                />
            )  }
                </View>
        </View>
    </SafeAreaView>
  )
}

export default RecentlyWatchedFromProfile

const styles = StyleSheet.create({})