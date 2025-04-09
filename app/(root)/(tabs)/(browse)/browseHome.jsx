import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import TinderSwipeCard from '../../../../components/TinderSwipeCard/TinderSwipeCard'
import { useRouter } from 'expo-router'
import { Colors } from '../../../../constants/Colors'
import { useGetTrendingLists, listInteraction, useGetRecentLists } from '../../../../api/list'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../../../api/user'
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake } from 'lucide-react-native';
import { LayersIcon , MessageIcon, RepostIcon, ThreeDotsIcon} from '../../../../assets/icons/icons'
import { formatDate } from '../../../../lib/formatDate'
import { browseCataegories } from '../../../../lib/CategoryOptions'
import ListCard from '../../../../components/ListCard'



const browseHome = () => {
    const router = useRouter()
    const { user: clerkUser } = useUser()
    const { data : ownerUser } = useFetchOwnerUser({ email : clerkUser?.emailAddresses[0].emailAddress })
    const [ selected, setSelected ] = useState('Trending')
    const posterURL = 'https://image.tmdb.org/t/p/w500';

    const { trendingList, loading, refetch, hasMore : hasMoreTrending, fetchMore } = useGetTrendingLists(3)
    const { recentLists, loading: loadingRecents, refetch:refetchRecents, hasMore:hasMoreRecents, fetchMore: fetchMoreRecents } = useGetRecentLists(3)


    const handleInteraction =  async (type, item) => {
      const data = {
          type,
          listId : item.id,
          userId : ownerUser?.id
      }
      const updatedDialogue = await listInteraction(data)
      refetch();
  }


    const handlePress = (item) => {
      router.push(`/list/${item.id}`)
    }

    if (!ownerUser){
      return (
        <View className='w-full h-full bg-primary justify-center items-center'>
          <ActivityIndicator />
        </View>
      )
    }

  return (
    <SafeAreaView className='bg-primary '>
    <View className='w-full h-full bg-primary justify-start items-center pt-3 px-4 gap-5 '>
      <View className='w-full'>
        <View className='flex-row gap-2'>
          {/* <LayersIcon size={30} color='white' /> */}
          <Text className='text-white font-pbold text-3xl'>Browse</Text>
        </View>
        <Text className='text-mainGray font-pmedium'>Go through user created Lists and browse titles</Text>
      </View>
      <View className='w-full mt-3'>
        <FlatList
          horizontal
          data={browseCataegories}
          keyExtractor={(item,index) => index}
          contentContainerStyle={{ gap:10 }}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=>setSelected(item)} style={{ borderRadius:15, backgroundColor:selected===item ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
              <Text className=' font-pmedium' style={{ color : selected===item ? Colors.primary : 'white' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

        <View className='w-full ' style={{ paddingBottom:200 }} >

          { selected === 'Trending' && loading  || selected === 'Most Recent' &&  loadingRecents ? (
            <ActivityIndicator/>
          ) : (

            <>
              { selected === 'Trending' ? (
                <FlatList 
                refreshControl={
                  <RefreshControl
                    tintColor={Colors.secondary}
                    onRefresh={refetch}
                    refreshing={loading}
                  />
                }
                  onEndReached={() => {
                      if ( hasMoreTrending  ){
                          fetchMore(3)
                      } 
                  }}
                  onEndReachedThreshold={0.1}
                data={  trendingList }
                keyExtractor = {item => item.id }
                contentContainerStyle={{ gap:15 , width:'100%'}}
                renderItem = {({item}) => {
                  return (
                  <ListCard list={item} />
                )}}
              />
              ): selected === 'Most Recent' && (

                <FlatList 
                refreshControl={
                  <RefreshControl
                    tintColor={Colors.secondary}
                    onRefresh={refetchRecents}
                    refreshing={loadingRecents}
                  />
                }
                  onEndReached={() => {
                      if (hasMoreRecents ){
                        fetchMoreRecents(3)
                      }
                  }}
                  onEndReachedThreshold={0.1}
                data={  recentLists }
                keyExtractor = {item => item.id }
                contentContainerStyle={{ gap:15 , width:'100%'}}
                renderItem = {({item}) => {
                  return (
                  <ListCard list={item} />
                )}}
              />
              ) }

            </>
            
                    

          )}


        </View>
    </View>
    </SafeAreaView>
  )
}

export default browseHome

const styles = StyleSheet.create({})