import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { Colors } from '../constants/Colors'
import { MessageIcon, ThreeDotsIcon, RepostIcon } from '../assets/icons/icons'
import { ThumbsUp, ThumbsDown } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { formatDate } from '../lib/formatDate'
import { toPascalCase } from '../lib/ToPascalCase'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../api/user'
import { threadInteraction } from '../api/thread'

const ThreadActivityCard = ( { thread, refetch } ) => {
    const router = useRouter()
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const { user : clerkUser } = useUser()
    const { data : ownerUser } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })

    console.log('thread interactions', thread.threadInteractions)

    const alreadyUpvoted = thread.threadInteractions?.some( thread => thread.interactionType === 'UPVOTE' && thread.userId === ownerUser.id )
    const alreadyDownvoted = thread.threadInteractions?.some( thread => thread.interactionType === 'DOWNVOTE'  && thread.userId === ownerUser.id )
    const alreadyReposted = thread.threadInteractions?.some( thread => thread.interactionType === 'REPOST'  && thread.userId === ownerUser.id )

    const handleUserPress = (item) => {
        router.push(`/(home)/user/${item.id}`)
      }

      const handleInteraction =  async (type, thread) => {
        console.log('type', type)
        const data = {
            type,
            threadId : Number(thread.id),
            userId : ownerUser.id
        }
        const updatedDialogue = await threadInteraction(data)

        refetch();
    }
  return (
    <TouchableOpacity  onPress={()=>{router.push(`/threads/${thread.id}`)}} style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15,gap:15}}>
    <TouchableOpacity onPress={()=>{handleUserPress(thread.user)}} className='flex-row gap-2   items-center justify-between '>
      <View className='flex-row gap-2 justify-center items-center'>
        <Image
          source={{ uri : thread.user.profilePic }}
          contentFit='cover'
          style={{ width:30, height:30, borderRadius:50 }}
        />
        <Text className='text-mainGrayDark '>@{thread.user.username}</Text>
      </View>
    <Text className='  text-mainGrayDark'>{formatDate(thread.createdAt)}</Text>
    </TouchableOpacity>
    <View className='flex-row gap-3 justify-start items-center  '>
    <View  >
      <Text className='text-white'>/{ toPascalCase( thread?.movie?.title || thread?.tv?.title || thread?.castCrew?.name)}</Text>
    </View>
    { thread.tag && (
    <Text className= ' font-pbold text-primary text-xs ' style={{ backgroundColor: thread.tag.color , padding:5, borderRadius:10, alignSelf:'flex-start'}}>{thread.tag.tagName}</Text>
  ) }

    </View>
    <Text className='text-white text-lg font-pbold leading-6'>{thread.title}</Text>
    <View>
      <Image
        source ={{ uri : `${posterURL}${thread?.movie?.backdropPath || thread?.tv?.backdropPath}` }}
        placeholder ={{ uri : `${posterURLlow}${thread?.movie?.backdropPath || thread?.tv?.backdropPath}` }}
        placeholderContentFit='cover'
        contentFit='cover'
        style ={{ width:'100%', height:150, borderRadius:15 }}
      />
    </View>
    <View className='flex-row  justify-between w-full items-end '>
          {/* <View className='flex-row gap-5 justify-center items-center'>
              
          </View> */}
        
          <View className='relative flex-row gap-5 justify-center items-center' >
          <TouchableOpacity onPress={()=>handleInteraction('upvotes',thread)} >
                  <View className='flex-row gap-2 justify-center items-center'>
                      <ThumbsUp size={16} color={ alreadyUpvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                      <Text className='text-xs font-pbold text-mainGray' style={{ color: alreadyUpvoted ? Colors.secondary : Colors.mainGray }}>{ thread.upvotes }</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>handleInteraction('downvotes',thread)} >
              <View className='flex-row gap-2 justify-center items-center'>
                  <ThumbsDown size={18} color={ alreadyDownvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsDown>
                  <Text  className='text-xs font-pbold text-mainGray' style={{ color: alreadyDownvoted ? Colors.secondary : Colors.mainGray }}>{ thread.downvotes }</Text>
              </View>
              </TouchableOpacity>
              <View className='flex-row  justify-center items-center   ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <MessageIcon   className='' size='18' color={Colors.mainGray} />
                  <Text className='text-xs font-pbold text-gray-400  '> {thread.downVotes}</Text>
              </View>
              <TouchableOpacity onPress={()=>handleInteraction('reposts',thread)} >
              <View className='flex-row  justify-center items-center  ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <RepostIcon className='' size='14' color={ alreadyReposted ? Colors.secondary :  Colors.mainGray}/>
                  <Text className='text-xs font-pbold text-gray-400  ' style={{ color: alreadyReposted ? Colors.secondary : Colors.mainGray }}> {thread.reposts}</Text>
              </View>
              </TouchableOpacity>
          </View>
              <TouchableOpacity   >
              <View className='flex-row  justify-center items-center  ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <ThreeDotsIcon className='' size='14' color={Colors.mainGray} />
              </View>
              </TouchableOpacity>
      </View>
  </TouchableOpacity>
  )
}

export default ThreadActivityCard

const styles = StyleSheet.create({})