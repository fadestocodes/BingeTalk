import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
// import { threads } from '../lib/fakeData'
import { Colors } from '../constants/Colors'
import { ArrowUpIcon, MessageIcon, RepostIcon,ThreeDotsIcon } from '../assets/icons/icons'
import { ArrowDownIcon } from '../assets/icons/icons'
import { useRouter } from 'expo-router'
import { formatDate } from '../lib/formatDate'
import { ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { threadInteraction } from '../api/thread'
import { useFetchOwnerUser } from '../api/user'
import { useUser } from '@clerk/clerk-expo'
import ThreadCard from './ThreadCard'


const DiscussionThread = ({threadsPress, threads, refetch}) => {
  const router = useRouter();

  // const handlePress = (id) => {
  //   router.push(`/threads/${id}`)
  // }  
  const { user:clerkUser } = useUser()
  const { data : ownerUser }= useFetchOwnerUser( {email:clerkUser.emailAddresses[0].emailAddress } )

  // const alreadyUpvoted = threads.threadInteractions.some( item => item.interactionType === 'UPVOTE' && item.userId === ownerUser.id )
  // const alreadyDownvoted = threads.threadInteractions.some( item => item.interactionType === 'DOWNVOTE'  && item.userId === ownerUser.id )
  // const alreadyReposted = threads.threadInteractions.some( item => item.interactionType === 'REPOST'  && item.userId === ownerUser.id )





  return (
    <FlatList
      scrollEnabled={false}
      data={threads}
      keyExtractor={(item)=>item.id}
      contentContainerStyle={{ }}
      ListHeaderComponent={(
        <Text className='text-white font-pbold   text-center text-lg mb-3'>Threads</Text>
      )}
      renderItem={({item}) => {
        
        return (
        <TouchableOpacity onPress={()=>threadsPress(item.id)} style={{gap:10, borderRadius:10, backgroundColor:Colors.mainGrayDark, paddingTop:15, marginBottom:15 ,paddingBottom:20, paddingHorizontal:20}}  >
          <ThreadCard thread={item}  ></ThreadCard>
          
          </TouchableOpacity>
      )}}
    >
    </FlatList>
  )
}

export default DiscussionThread

const styles = StyleSheet.create({})

