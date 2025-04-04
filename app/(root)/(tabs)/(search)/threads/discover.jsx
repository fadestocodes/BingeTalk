import { StyleSheet, Text, View, FlatList, TouchableOpacity , SafeAreaView, ActivityIndicator, RefreshControl} from 'react-native'
import { MessagesSquare } from 'lucide-react-native'
import React, {useState} from 'react'
import { threadCategories } from '../../../../../lib/CategoryOptions'
import { Image } from 'expo-image'
import { Colors } from '../../../../../constants/Colors'
import DialogueCard from '../../../../../components/DialogueCard'
import { useGetRecentThreads, useGetTrendingThreadsInfinite } from '../../../../../api/thread'
import ThreadCard from '../../../../../components/ThreadCard'
import { useRouter } from 'expo-router'

const DiscoverDialogues = () => {
    const [ selected, setSelected ] = useState('Trending')
    const router = useRouter()
    const { data : trendingThreads, refetch, hasMore, loading:loadingTrending, fetchMore  } = useGetTrendingThreadsInfinite(10, true);
    const { data : recentThreads, refetch:refetchRecents, hasMore: hasMoreRecents, loading:loadingRecents, fetchMore:fetchMoreRecents } = useGetRecentThreads(10, false);



  return (
    <SafeAreaView className='w-full h-full bg-primary'>
      <View className='w-full  pt-10 px-4 gap-5' style={{paddingBottom:200}}>
        <View className="gap-3">
            <View className='flex-row gap-2 justify-start items-center'>

              <MessagesSquare size={30} color='white' />
              <Text className='text-white font-pbold text-3xl'>Threads</Text>
            </View>
            <Text className='text-mainGray font-pmedium'>Discover conversations about your fav titles, cast, or crew!</Text>
        </View>

        <View className='w-full my-5 gap-3' style={{paddingBottom:120}}>
            <FlatList
           
            horizontal
            data={threadCategories}
            keyExtractor={(item,index) => index}
            contentContainerStyle={{ gap:10 }}
            renderItem={({item}) => (
                <TouchableOpacity onPress={()=>{setSelected(item) }} style={{ borderRadius:15, backgroundColor:selected===item ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
                    <Text className=' font-pmedium' style={{ color : selected===item ? Colors.primary : 'white' }}>{item}</Text>
                </TouchableOpacity>
            )}
            />

            { selected === 'Trending' && loadingTrending || selected === 'Most Recent' && loadingRecents ? (
                <ActivityIndicator />
            ) : (
                <>
                { selected === 'Trending' && (
                    <FlatList
            refreshControl={
                <RefreshControl
                  tintColor={Colors.secondary}
                  onRefresh={ refetch  }
                  refreshing={ loadingTrending}
                />
              }
                data={trendingThreads }
                keyExtractor={(item, index) => index}
                contentContainerStyle={{gap:15}}
                renderItem={({item}) => {
                    // console.log('flatlist item', item.id)
                return (
                    <TouchableOpacity onPress={()=>router.push(`/threads/${item.id}`)} >  
                        <ThreadCard isBackground={true} thread={item} showThreadTopic={true} />
                    </TouchableOpacity>
                )}}
                onEndReached={ ()=>{
                    if (hasMore){
                        fetchMore(10, true)
                    } 
                } }
                onEndReachedThreshold={0}
            />
                ) }

                { selected === 'Most Recent' && (
                    <FlatList
            refreshControl={
                <RefreshControl
                  tintColor={Colors.secondary}
                  onRefresh={  refetchRecents }
                  refreshing={loadingRecents}
                />
              }
                data={ recentThreads}
                keyExtractor={(item, index) => index}
                contentContainerStyle={{gap:15}}
                renderItem={({item}) => {
                    // console.log('flatlist item', item.id)
                return (
                    <TouchableOpacity onPress={()=>router.push(`/threads/${item.id}`)} >  
                        <ThreadCard isBackground={true} thread={item} showThreadTopic={true} />
                    </TouchableOpacity>
                )}}
                onEndReached={ ()=>{
                  if (hasMoreRecents){
                        fetchMoreRecents(10, false)
                    }
                } }
                onEndReachedThreshold={0}
            />
                ) }
            </>
            
            )}
        </View>
        </View> 
    </SafeAreaView>

  )
}

export default DiscoverDialogues

const styles = StyleSheet.create({})