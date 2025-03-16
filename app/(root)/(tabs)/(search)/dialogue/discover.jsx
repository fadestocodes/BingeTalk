import { StyleSheet, Text, View, FlatList, TouchableOpacity , SafeAreaView, Touchable} from 'react-native'
import { MessageSquare } from 'lucide-react-native'
import React, {useState} from 'react'
import { dialogueCategories } from '../../../../../lib/CategoryOptions'
import { Image } from 'expo-image'
import { Colors } from '../../../../../constants/Colors'
import DialogueCard from '../../../../../components/DialogueCard'
import { useGetTrendingDialoguesInfinite } from '../../../../../api/dialogue'
import { useRouter } from 'expo-router'

const DiscoverDialogues = () => {
    const [ selected, setSelected ] = useState('Trending')
    const router = useRouter()
    const { data : trendingDialogues, refetch, hasMore } = useGetTrendingDialoguesInfinite(5, true);
    const { data : controversialDialogues, refetch:refetchControversial, hasMore: hasMoreControversial } = useGetTrendingDialoguesInfinite(5, false);



  return (
    <SafeAreaView className='w-full h-full bg-primary'>
      <View className='w-full  pt-10 px-4 gap-5' style={{paddingBottom:200}}>
        <View className="gap-3">
            <View className='flex-row gap-2 justify-start items-center'>

              <MessageSquare size={30} color='white' />
              <Text className='text-white font-pbold text-3xl'>Dialogues</Text>
            </View>
            <Text className='text-mainGray font-pmedium'>See what people are saying!</Text>
        </View>

        <View className='w-full my-5 gap-3' style={{paddingBottom:100}}>
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

            <FlatList
                data={selected === 'Trending' ? trendingDialogues : controversialDialogues}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{gap:15}}
                renderItem={({item}) => {
                    // console.log('flatlist item', item.id)
                return (
                    <TouchableOpacity onPress={()=>router.push(`/dialogue/${item.id}`)} >
                        <DialogueCard isBackground={true} dialogue={item}  />
                    </TouchableOpacity>
                )}}
                onEndReached={ ()=>{
                    
                    
                    if (selected === 'Trending' && hasMore){
                        refetch()
                    } else if (selected === 'Hot Takes' && hasMoreControversial){
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