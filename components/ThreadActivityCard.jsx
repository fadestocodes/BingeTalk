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


    const alreadyUpvoted = thread.threadInteractions?.some( thread => thread.interactionType === 'UPVOTE' && thread.userId === ownerUser.id )
    const alreadyDownvoted = thread.threadInteractions?.some( thread => thread.interactionType === 'DOWNVOTE'  && thread.userId === ownerUser.id )
    const alreadyReposted = thread.threadInteractions?.some( thread => thread.interactionType === 'REPOST'  && thread.userId === ownerUser.id )

    const [ already, setAlready ] = useState({
        upvoted : alreadyUpvoted,
        downvoted : alreadyDownvoted,
        reposted : alreadyReposted
    })

    const [ interactionCounts, setInteractionCounts ] = useState({
        upvotes : thread.upvotes ,
        downvotes : thread.downvotes ,
        reposts : thread.reposts
    })
 


    const handleUserPress = (item) => {
        router.push(`/(home)/user/${item.id}`)
      }

      const handleInteraction =  async (type, thread) => {

        if (type === 'upvotes'){
            setAlready(prev => ({...prev, upvoted : !prev.upvoted}))
            if (already.upvoted){
                setInteractionCounts(prev => ({...prev, upvotes : prev.upvotes - 1}))
            } else {
                setInteractionCounts(prev => ({...prev, upvotes : prev.upvotes + 1}))
            }
        } else if (type === 'downvotes'){
            setAlready(prev => ({...prev, downvoted : !prev.downvoted}))
            if (already.downvoted){
                setInteractionCounts(prev => ({...prev, downvotes : prev.downvotes - 1}))
            } else {
                setInteractionCounts(prev => ({...prev, downvotes : prev.downvotes + 1}))
            }
        } else if (type === 'reposts'){
            setAlready(prev => ({...prev, reposted : !prev.reposted}))
            if (already.reposted){
                setInteractionCounts(prev => ({...prev, reposts : prev.reposts - 1}))
            } else {
                setInteractionCounts(prev => ({...prev, reposts : prev.reposts + 1}))
            }
        }
        let description
        if ( type === 'upvotes' ){
            description = `upvoted your thread "${thread.title}"`
            
        } else if (type === 'downvotes'){
            description = `downvoted your thread "${thread.title}"`
           
        }else  if ( type === 'reposts' ){
            description = `reposted your thread "${thread.title}"`
           
        }
        const data = {
            type,
            threadId : thread.id,
            userId : ownerUser.id,
            description,
            recipientId : thread.user.id
        }


        const updatedThread = await threadInteraction(data)

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
                      <ThumbsUp size={16} color={ already.upvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                      <Text className='text-xs font-pbold text-mainGray' style={{ color: already.upvoted ? Colors.secondary : Colors.mainGray }}>{ interactionCounts.upvotes }</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>handleInteraction('downvotes',thread)} >
              <View className='flex-row gap-2 justify-center items-center'>
                  <ThumbsDown size={18} color={ already.downvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsDown>
                  <Text  className='text-xs font-pbold text-mainGray' style={{ color: already.downvoted ? Colors.secondary : Colors.mainGray }}>{ interactionCounts.downvotes }</Text>
              </View>
              </TouchableOpacity>
              <View className='flex-row  justify-center items-center   ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <MessageIcon   className='' size={18} color={Colors.mainGray} />
                  <Text className='text-xs font-pbold text-gray-400  '> {thread.downVotes}</Text>
              </View>
              <TouchableOpacity onPress={()=>handleInteraction('reposts',thread)} >
              <View className='flex-row  justify-center items-center  ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <RepostIcon className='' size={14} color={ already.reposted ? Colors.secondary :  Colors.mainGray}/>
                  <Text className='text-xs font-pbold text-gray-400  ' style={{ color: already.reposted ? Colors.secondary : Colors.mainGray }}> {interactionCounts.reposts}</Text>
              </View>
              </TouchableOpacity>
          </View>
              <TouchableOpacity   >
              <View className='flex-row  justify-center items-center  ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <ThreeDotsIcon className='' size={14} color={Colors.mainGray} />
              </View>
              </TouchableOpacity>
      </View>
  </TouchableOpacity>
  )
}

export default ThreadActivityCard

const styles = StyleSheet.create({})