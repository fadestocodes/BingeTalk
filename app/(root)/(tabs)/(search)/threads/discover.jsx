import { StyleSheet, Text, View, FlatList, TouchableOpacity , SafeAreaView, Touchable} from 'react-native'
import { MessagesSquare } from 'lucide-react-native'
import React, {useState} from 'react'
import { threadCategories } from '../../../../../lib/CategoryOptions'
import { Image } from 'expo-image'
import { Colors } from '../../../../../constants/Colors'
import DialogueCard from '../../../../../components/DialogueCard'
import { useGetTrendingThreadsInfinite } from '../../../../../api/thread'
import ThreadCard from '../../../../../components/ThreadCard'

const DiscoverDialogues = () => {
    const [ selected, setSelected ] = useState('Trending')
    const { data : trendingThreads, refetch, hasMore } = useGetTrendingThreadsInfinite(5, true);
    const { data : controversialThreads, refetch:refetchControversial, hasMore: hasMoreControversial } = useGetTrendingThreadsInfinite(5, false);



  return (
    <SafeAreaView className='w-full h-full bg-primary'>
      <View className='w-full  pt-10 px-6 gap-5' style={{paddingBottom:200}}>
        <View className="gap-3">
            <View className='flex-row gap-2 justify-start items-center'>

              <MessagesSquare size={30} color='white' />
              <Text className='text-white font-pbold text-3xl'>Threads</Text>
            </View>
            <Text className='text-mainGray font-pmedium'>Discover conversations about your fav titles, cast, or crew!</Text>
        </View>

        <View className='w-full my-5 gap-3' style={{paddingBottom:100}}>
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

            <FlatList
                data={selected === 'Trending' ? trendingThreads : controversialThreads}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{gap:15}}
                renderItem={({item}) => {
                    console.log('flatlist item', item.id)
                return (
                    <TouchableOpacity>
                        <ThreadCard isBackground={true} thread={item}  />
                    </TouchableOpacity>
                )}}
                onEndReached={ ()=>{
                    
                    
                    if (selected === 'Trending' && hasMore){
                        refetch()
                    } else if (selected === 'Most Controversial' && hasMoreControversial){
                        refetchControversial()
                    }
                } }
                onEndReachedThreshold={0}
            />
        </View>
        </View> 
    </SafeAreaView>

  )
}

export default DiscoverDialogues

const styles = StyleSheet.create({})