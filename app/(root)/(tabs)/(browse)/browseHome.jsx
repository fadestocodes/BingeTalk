import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
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



const browseHome = () => {
    const router = useRouter()
    const { user: clerkUser } = useUser()
    const { data : ownerUser } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })
    const [ selected, setSelected ] = useState('Trending')
    const posterURL = 'https://image.tmdb.org/t/p/w500';


    // const [ trendingLists, setTrendingLists ] = useState(null)

    // useEffect(()=>{

    // }, [])
    const { trendingList, loading, refetch, hasMore : hasMoreTrending } = useGetTrendingLists(3)
    const { recentLists, loading: loadingRecents, refetch:refetchRecents, hasMore:hasMoreRecents } = useGetRecentLists(3)


    const handleInteraction =  async (type, item) => {
      console.log('type', type)
      const data = {
          type,
          listId : item.id,
          userId : ownerUser.id
      }
      const updatedDialogue = await listInteraction(data)
      refetch();
  }


    const handlePress = (item) => {
      router.push(`/list/${item.id}`)
    }

  return (
    <SafeAreaView className='bg-primary '>
    <View className='w-full h-full bg-primary justify-start items-center pt-10 px-6 gap-5 '>
      <View className='w-full'>
        <View className='flex-row gap-2'>
          <LayersIcon size={30} color='white' />
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

        {/* <TinderSwipeCard /> */}
        <View className='w-full ' style={{ paddingBottom:200 }} >


        <FlatList 
          refreshControl={
            <RefreshControl
              tintColor={Colors.secondary}
              onRefresh={refetch}
              refreshing={loading}
            />
          }
            onEndReached={() => {
                if ( hasMoreTrending ){
                    refetch()
                } else if (hasMoreRecents){
                  refetchRecents()
                }
            }}
            onEndReachedThreshold={0.1}
          data={ selected === 'Trending' ?  trendingList : selected === 'Most Recent' && recentLists}
          keyExtractor = {item => item.id }
          contentContainerStyle={{ gap:15 , width:'100%'}}
          renderItem = {({item}) => {
            console.log('FLATLIST item', item)
            const alreadyUpvoted = item.listInteractions.some( i => i.interactionType === 'UPVOTE' && i.userId === ownerUser.id )
            const alreadyDownvoted = item.listInteractions.some( i => i.interactionType === 'DOWNVOTE'  && i.userId === ownerUser.id )
            const alreadyReposted = item.listInteractions.some( i => i.interactionType === 'REPOST'  && i.userId === ownerUser.id )
            console.log(alreadyUpvoted, alreadyDownvoted, alreadyReposted)
            return (
            <View className='w-full' >
                    <TouchableOpacity onPress={()=>handlePress(item)}  style={{  borderRadius:10, backgroundColor:Colors.mainGrayDark,paddingVertical:10, paddingHorizontal:15, gap:15 }} >
                        <View className='gap-3'>
                            <View className=' gap-0 justify-center items-start' >
                                          <View className='flex-row w-full gap-2 justify-between items-center mb-3'>
                                            <View className='flex-row gap-2 justify-center items-center'>
                                              <Image
                                                source ={{ uri :item.user.profilePic }}
                                                contentFit='cover'
                                                style={{ width:25, height :25, borderRadius:50 }}
                                              />
                                                <Text className='text-mainGrayDark'>@{item.user.username}</Text>
                                            </View>
                                            <Text className='text-mainGrayDark'>{formatDate(item.createdAt)}</Text>
                                          </View>
                                        <Text className='text-white font-pbold text-xl' >{ item.title }</Text>
                                        <View className='flex-row gap-1 justify-center items-center'>
                                          <Text className='text-white text-sm '>{`(${item.listItem.length} ${item.listItem.length > 1 ? `items` : 'item'})`}</Text>
                                        </View>
                                    </View>
                            <Text className='text-mainGray  font-pregular' numberOfLines={2}>{ item.caption }</Text>
                        </View>

                            <View style={{ flexDirection:'row', gap:10}} >
                        { item.listItem.slice(0,5).map( (element, index) => {
                        // console.log('EACH ELEMENT', element)
                        return (

                            <View key={index} className='flex-row gap-2' > 

                                <Image
                                    source={{ uri : element.movie ? `${posterURL}${element.movie.posterPath}` : element.tv ? `${posterURL}${element.tv.posterPath}` : element.castCrew &&  `${posterURL}${element?.castCrew.posterPath}` }}
                                    contentFit='cover'
                                    style= {{ borderRadius : 10, width:40, height:60 }}
                                />
                            </View>
                        )} ) }
                        { item.listItem.length - 5 > 0 && (
                        <View
                            style={{ width:40, height : 60, borderRadius:10, backgroundColor:Colors.lightBlack, padding:5 }}
                        >
                            <Text className='text-sm text-mainGray font-pbold'>+ {item.listItem.length - 5 } more</Text>
                            </View>

                        ) }
                        </View>
                        <View className='w-full flex-row justify-between items-center'>
                            <View className='flex-row gap-5 justify-center items-center'>
                                <TouchableOpacity onPress={()=> handleInteraction('upvotes',item) } >
                                    <View className='flex-row gap-1 justify-center items-center'>
                                        <ThumbsUp size={16} color={ alreadyUpvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                                        <Text className='text-xs font-pbold ' style={{ color: alreadyUpvoted ? Colors.secondary : Colors.mainGray }}>{ item.upvotes }</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={()=> handleInteraction('downvotes',item) } >
                                <View className='flex-row gap-1 justify-center items-center'>
                                    <ThumbsDown size={18}  color={ alreadyDownvoted ? Colors.secondary :  Colors.mainGray}></ThumbsDown>
                                    <Text  className='text-xs font-pbold text-mainGray' style={{ color: alreadyDownvoted ? Colors.secondary : Colors.mainGray }}>{ item.downvotes }</Text>
                                </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                <View className='flex-row gap-1 justify-center items-center'>
                                    <MessageIcon size={18} color={Colors.mainGray}></MessageIcon>
                                    <Text className='text-xs font-pbold text-mainGray'>{ item.comments.length}</Text>
                                    </View>
                                </TouchableOpacity>

                                
                                <TouchableOpacity onPress={()=> handleInteraction('reposts',item) } >
                                <View className='flex-row gap-1 justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                                    <RepostIcon className='' size='14'  color={ alreadyReposted ? Colors.secondary :  Colors.mainGray}/>
                                    <Text className='text-xs font-pbold text-mainGray  'style={{ color: alreadyReposted ? Colors.secondary : Colors.mainGray }}> {item.reposts}</Text>
                                </View>

                                </TouchableOpacity>
                            </View>
                            <View className='relative' >
                                <TouchableOpacity   >
                                    <ThreeDotsIcon className='' size='14' color={Colors.mainGray} />
                                </TouchableOpacity>
                            </View>
                            
                        </View>


                    </TouchableOpacity>
                </View>
          )}}
        />

        </View>
    </View>
    </SafeAreaView>
  )
}

export default browseHome

const styles = StyleSheet.create({})