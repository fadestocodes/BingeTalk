import { StyleSheet, Text, View, FlatList, TouchableOpacity , SafeAreaView, Touchable, ActivityIndicator, RefreshControl} from 'react-native'
import { MessageSquare } from 'lucide-react-native'
import React, {useState} from 'react'
import { dialogueCategories } from '../../../../../lib/CategoryOptions'
import { Image } from 'expo-image'
import { Colors } from '../../../../../constants/Colors'
import DialogueCard from '../../../../../components/DialogueCard'
import { useGetRecentDialoguesInfinite, useGetTrendingDialoguesInfinite } from '../../../../../api/dialogue'
import { useRouter } from 'expo-router'
import { BackIcon } from '../../../../../assets/icons/icons'

const DiscoverDialogues = () => {
    const [ selected, setSelected ] = useState('Trending')
    const router = useRouter()
    const { data : trendingDialogues, refetch, hasMore , loading:loadingTrending, fetchMore} = useGetTrendingDialoguesInfinite(10, true);
    const { data : recentDialogues, refetch:refetchRecents, hasMore: hasMoreRecents, loading:loadingRecents, fetchMore : fetchMoreRecents } = useGetRecentDialoguesInfinite(10, false);


  return (
    <SafeAreaView className='w-full h-full bg-primary'>
      <View className='w-full   px-4 gap-5' style={{paddingBottom:200}}>
      <TouchableOpacity onPress={()=>router.back()}>
              <BackIcon size={22} color={Colors.mainGray}/>
            </TouchableOpacity>
        <View className="gap-3">
            <View className='flex-row gap-2 justify-start items-center'>

              <MessageSquare size={30} color='white' />
              <Text className='text-white font-pbold text-3xl'>Dialogues</Text>
            </View>
            <Text className='text-mainGray font-pmedium'>See what people are saying!</Text>
        </View>

        <View className='w-full  gap-3' style={{paddingBottom:200}}>
            <FlatList
            horizontal
            data={dialogueCategories}
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
                      onRefresh={ refetch }
                      refreshing={loadingTrending}
                    />
                  }
                data={trendingDialogues}
                keyExtractor={(item, index) => index}
                contentContainerStyle={{gap:15}}
                renderItem={({item}) => {
                    // console.log('flatlist item', item.id)
                return (
                    <>
                    <TouchableOpacity onPress={()=>router.push(`/dialogue/${item.id}`)} >
                        <DialogueCard isBackground={true} dialogue={item}  />
                    </TouchableOpacity>
                   
                    </>

                )}}
                onEndReachedThreshold={0}
                onEndReached={ ()=>{
                    if ( hasMore){
                        fetchMore(10, true)
                    } 
                }
                } 
                />
                ) }

                { selected === 'Most Recent' && (
                    <FlatList
                    refreshControl={
                       <RefreshControl
                         tintColor={Colors.secondary}
                         onRefresh={refetchRecents }
                         refreshing={  loadingRecents}
                       />
                     }
                   data={ recentDialogues}
                   keyExtractor={(item, index) => index}
                   contentContainerStyle={{gap:15}}
                   renderItem={({item}) => {
                       // console.log('flatlist item', item.id)
                   return (
                       <>
                       <TouchableOpacity onPress={()=>router.push(`/dialogue/${item.id}`)} >
                           <DialogueCard isBackground={true} dialogue={item}  />
                       </TouchableOpacity>
                      
                       </>
   
                   )}}
                   onEndReachedThreshold={0}
                   onEndReached={ ()=>{
                       if ( hasMoreRecents){
                           fetchMoreRecents(10,false )
                       }
                   }
                   } 
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