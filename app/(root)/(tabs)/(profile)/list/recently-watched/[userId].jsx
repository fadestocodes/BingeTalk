import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useFetchRecentlyWatched , useRecentlyWatched} from '../../../../../../api/user'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors } from '../../../../../../constants/Colors'
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake } from 'lucide-react-native';
import { formatDate } from '../../../../../../lib/formatDate'
import { FilmIcon, TVIcon } from '../../../../../../assets/icons/icons'


const RecentlyWatchedFromProfile = () => {
    const {userId} = useLocalSearchParams();
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
    const { data : recentlyWatched, loading, refetch, hasMore } = useRecentlyWatched(userId)


    console.log('recently watched ARRAY', recentlyWatched)
    const router = useRouter()
    
    const handlePress = (item) => {
        console.log('tmbdbId', item.tmdbId)
        router.push(`/movie/${item.movie.tmdbId}`)
    }
    
        if (loading){
            return(
                <View style={{ backgroundColor:Colors.primary, width:'100%', height:'100%' }}>
             <RefreshControl tintColor={Colors.secondary}   />
             </View>
        )
        }

        const reachedEnd = () => {
            if ( hasMore  ) {
                refetch();
            }
        }

  return (
    <SafeAreaView className='w-full h-full bg-primary justify-start items-center' style={{  paddingTop:100, paddingHorizontal:15 }}>
       <ScrollView 
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
                <FlatList
                    
                    scrollEnabled={false}
                    data={recentlyWatched}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ width:'100%', gap:15, paddingBottom:100 }}
                    onEndReached={reachedEnd}
                    onEndReachedThreshold={1} // Fetch next batch when 50% scrolled
                    ListFooterComponent={hasMore && loading ? <ActivityIndicator /> : null}
                    renderItem={({item})=>{
                        console.log('ITEM',item)
                        return (
                            <View className='gap-20'>
                        <TouchableOpacity onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                            <Text className='text-mainGray text-sm '>{formatDate(item.createdAt)}</Text>
                            <View className='flex-row gap-1 justify-center items-center'>
                                { item.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                                <Text className='text-white text font-pbold'>{ item?.movie.title || item?.tv.title }</Text>
                            </View>
                        </TouchableOpacity>
                            <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>
                            </View>
                    )}}
                />
            )  }
                </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default RecentlyWatchedFromProfile

const styles = StyleSheet.create({})