import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { Colors } from '../constants/Colors'
import { MessageIcon, ThreeDotsIcon, RepostIcon } from '../assets/icons/icons'
import { ThumbsUp, ThumbsDown, Heart, MessagesSquare, MessageSquare } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { formatDate } from '../lib/formatDate'
import { toPascalCase } from '../lib/ToPascalCase'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../api/user'
import { threadInteraction } from '../api/thread'
import ListCard from './ListCard'

const ActivityCard = ( { activity, refetch } ) => {
    const router = useRouter()
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const { user : clerkUser } = useUser()
    const { data : ownerUser } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })


    const alreadyUpvotedThread = activity?.threads?.threadInteractions?.some( thread => thread.interactionType === 'UPVOTE' && thread.userId === ownerUser.id )
    || activity?.threadInteractions?.some( thread => thread.interactionType === 'UPVOTE' && thread.userId === ownerUser.id )
    const alreadyDownvotedThread = activity?.threads?.threadInteractions?.some( thread => thread.interactionType === 'DOWNVOTE'  && thread.userId === ownerUser.id )
    || activity?.threadInteractions?.some( thread => thread.interactionType === 'DOWNVOTE'  && thread.userId === ownerUser.id )
    const alreadyRepostedThread = activity?.threads?.threadInteractions?.some( thread => thread.interactionType === 'REPOST'  && thread.userId === ownerUser.id )
    || activity?.threadInteractions?.some( thread => thread.interactionType === 'REPOST'  && thread.userId === ownerUser.id )

    const alreadyUpvotedDialogue = activity?.dialogue?.dialogueInteractions?.some( dialogue => dialogue.interactionType === 'UPVOTE' && dialogue.userId === ownerUser.id )
    const alreadyDownvotedDialogue = activity?.dialogue?.dialogueInteractions?.some( dialogue => dialogue.interactionType === 'DOWNVOTE'  && dialogue.userId === ownerUser.id )
    const alreadyRepostedDialogue = activity?.dialogue?.dialogueInteractions?.some( dialogue => dialogue.interactionType === 'REPOST'  && dialogue.userId === ownerUser.id )

    const alreadyLikedActivity = ownerUser?.activityInteractions.some( interaction => interaction.activityId === activity.id  )



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


    const handleMentionPress = (mention) => {
        if (mention.movie) {
            if (fromHome){
                router.push(`(home)/movie/${mention.tmdbId}`)
            } else {
                router.push(`/movie/${mention.tmdbId}`)
            }
        } else if (mention.tv) {
            if (fromHome){
                router.push(`(home)/tv/${mention.tmdbId}`)
            } else {
                router.push(`/tv/${mention.tmdbId}`)
            }
        } else {
            if (fromHome){
                router.push(`(home)/cast/${mention.tmdbId}`)
            } else {
                router.push(`/cast/${mention.tmdbId}`)
            }
        }
    }

    const imagePaths =  activity?.movie?.backdropPath || activity?.tv?.backdropPath || activity?.rating?.movie?.backdropPath || activity?.rating?.tv?.backdropPath 

  return (
<>

    { activity.type === 'list' ? (
        <ListCard list={activity.list} activity={activity.description} fromHome={true} />
    ): activity.type === 'thread' ?(
        <TouchableOpacity onPress={()=>console.log('THREAD FROM WATCHED ITEM', activity)}  style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15,gap:15}}>
             <View className="flex-row justify-between gap-2">
                 <View className='flex-row gap-2 justify-center items-center'>
                         <Image
                           source={{ uri : activity.user.profilePic }}
                           contentFit='cover'
                           style={{ width:30, height:30, borderRadius:50 }}
                         />
                         <Text className='text-mainGrayDark '>@{activity.user.username}</Text>
                       </View>
                     <Text className='  text-mainGrayDark'>{formatDate(activity.createdAt)}</Text>
             </View>
             <View className='flex-row gap-3 justify-start items-center  '>
        <View  >
            <Text className='text-white'>/{ toPascalCase( activity?.movie?.title || activity?.tv?.title || activity?.castCrew?.name)}</Text>
        </View>
        { activity.tag && (
        <Text className= ' font-pbold text-primary text-xs ' style={{ backgroundColor: activity.tag.color , padding:5, borderRadius:10, alignSelf:'flex-start'}}>{activity.tag.tagName}</Text>
        ) }
        </View>
        <Text className='text-white text-lg font-pbold leading-6'>{activity.title}</Text>
        <Image
        source ={{ uri : `${posterURL}${activity?.movie?.backdropPath || activity?.tv?.backdropPath || activity?.threads?.movie?.backdropPath || activity?.threads?.tv?.backdropPath}` }}
        placeholder ={{ uri :  `${posterURL}${activity?.movie?.backdropPath || activity?.tv?.backdropPath || activity?.threads?.movie?.backdropPath || activity?.threads?.tv?.backdropPath}` }}
        placeholderContentFit='cover'
        contentFit='cover'
        style ={{ width:'100%', height:150, borderRadius:15 }}
      />
      <View className='flex-row  justify-between w-full items-end '>
          <View className='relative flex-row gap-5 justify-center items-center' >
          <TouchableOpacity onPress={()=>handleInteraction('upvotes',activity?.threads || activity?.dialogue)} >
                  <View className='flex-row gap-2 justify-center items-center'>
                      <ThumbsUp size={16} color={ alreadyUpvotedThread ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                      <Text className='text-xs font-pbold text-mainGray' style={{ color: alreadyUpvotedThread ? Colors.secondary : Colors.mainGray }}>{ activity.upvotes || ''}</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>handleInteraction('downvotes',activity?.threads || activity?.dialogue)} >
              <View className='flex-row gap-2 justify-center items-center'>
                  <ThumbsDown size={18} color={ alreadyDownvotedThread ? Colors.secondary :  Colors.mainGray} ></ThumbsDown>
                  <Text  className='text-xs font-pbold text-mainGray' style={{ color: alreadyDownvotedThread ? Colors.secondary : Colors.mainGray }}>{ activity.downvotes || '' }</Text>
              </View>
              </TouchableOpacity>
              <View className='flex-row  justify-center items-center   ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <MessageIcon   className='' size='18' color={Colors.mainGray} />
                  <Text className='text-xs font-pbold text-gray-400  '> {activity.comments.length || ''}</Text>
              </View>
              <TouchableOpacity onPress={()=>handleInteraction('reposts',activity?.threads || activity?.dialogue)} >
              <View className='flex-row  justify-center items-center  ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <RepostIcon className='' size='14' color={ alreadyRepostedThread ? Colors.secondary :  Colors.mainGray}/>
                  <Text className='text-xs font-pbold text-gray-400  ' style={{ color: alreadyRepostedThread ? Colors.secondary : Colors.mainGray }}> {activity.reposts || ''}</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity   >
              <View className='flex-row  justify-center items-center  ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <ThreeDotsIcon className='' size='14' color={Colors.mainGray} />
              </View>
              </TouchableOpacity>
          </View>
          { activity.activityType === 'DIALOGUE' && (
             <View className='flex-row gap-3  item-center justify-center' >
             { activity.dialogue.mentions && activity.dialogue.mentions.length > 0 && activity.dialogue.mentions.map( mention => (
                 <TouchableOpacity key={mention.id}  onPress={()=>handleMentionPress(mention)}  className=' items-center'>
                     <Image
                         source={{ uri: `${posterURL}${mention.movie ? mention.movie.posterPath : mention.tv ? mention.tv.posterPath : mention.castCrew && mention.castCrew.posterPath}` }}
                         contentFit='cover'
                         style={{ width:35, height:45, borderRadius:10, overflow:'hidden' }}
                     />
                 </TouchableOpacity>
             ) ) 
             }
             </View>
          ) }
      </View>
      
    </TouchableOpacity>
    ) : (

    <TouchableOpacity  onPress={()=>{console.log('PRESSED', activity)}}  style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15,gap:15}}>

            
    {/* ---------------header */}
    <TouchableOpacity onPress={()=>{handleUserPress(activity.user)}} className='flex-row gap-2   items-center justify-between '>
      <View className='flex-row gap-2 justify-center items-center'>
        <Image
          source={{ uri : activity.user.profilePic }}
          contentFit='cover'
          style={{ width:30, height:30, borderRadius:50 }}
        />
        <Text className='text-mainGrayDark '>@{activity.user.username}</Text>
      </View>
    <Text className='  text-mainGrayDark'>{formatDate(activity.createdAt)}</Text>
    </TouchableOpacity>

    {/* -----------------body */}
    { activity.activityType === 'DIALOGUE' ? (
        <>
         { activity.dialogue.tag && (
            <View className=' '>
                <Text className= 'font-pbold text-primary text-xs ' style={{ backgroundColor: tag.color , padding:5, borderRadius:10}} >{activity.dialogue.tag.tagName}</Text>
            </View>
        ) }
    <View className='my-0 justify-center items-center w-full gap-3  mb-6'>
        <View className='flex gap-2 justify-center items-center'>
            
            <View className='justify-center items-center gap-0'>
                <Text className='text-secondary font-pcourier uppercase text-lg' >{activity.user.firstName}</Text>
            </View>
            
        </View>

        <Text className='text-third font-pcourier text-custom text-left w-full' numberOfLines={3}> { activity.dialogue.content } </Text>
    </View>
    </>
    ) : activity.activityType === 'THREAD' ? (
    <>
        <View className='flex-row gap-3 justify-start items-center  '>
        <View  >
            <Text className='text-white'>/{ toPascalCase( activity?.threads?.movie?.title || activity?.threads?.tv?.title || activity?.threads?.castCrew?.name)}</Text>
        </View>
        { activity.threads.tag && (
        <Text className= ' font-pbold text-primary text-xs ' style={{ backgroundColor: activity.threads.tag.color , padding:5, borderRadius:10, alignSelf:'flex-start'}}>{activity.threads.tag.tagName}</Text>
        ) }
        <Text className='text-white'>hello</Text>
        </View>
        <Text className='text-white text-lg font-pbold leading-6'>{activity.threads.title}</Text>
        <Image
        source ={{ uri : `${posterURL}${activity?.movie?.backdropPath || activity?.tv?.backdropPath || activity?.threads?.movie?.backdropPath || activity?.threads?.tv?.backdropPath}` }}
        placeholder ={{ uri :  `${posterURL}${activity?.movie?.backdropPath || activity?.tv?.backdropPath || activity?.threads?.movie?.backdropPath || activity?.threads?.tv?.backdropPath}` }}
        placeholderContentFit='cover'
        contentFit='cover'
        style ={{ width:'100%', height:150, borderRadius:15 }}
      />
    </>
    ) : !activity.activityType ? (
        
        <>
        { activity.threads && (
        <View>
             <Text className='text-mainGray text font-pregular text-center ' >{activity.description}</Text>
                <ThreadCard thread ={activity.threads} isBackground={false} showThreadTopic={true} isShortened={true} fromHome={true} activity={activity.description}/> 
               <View className='w-full justify-between items-center flex-row  '>
                   <TouchableOpacity onPress={()=>handleUserPress(activity.user)} className='flex-row gap-2 items-center justify-center'>
                     <Image
                       source={{ uri : activity.user.profilePic }}
                       contentFit='cover'
                       style={{ width:30, height:30, borderRadius:50 }}
                     />
                     <Text className='text-mainGrayDark '>@{activity.user.username}</Text>
                   </TouchableOpacity>
                   <Text className='  text-mainGrayDark'>{formatDate(activity.createdAt)}</Text>
               </View>
              
               <View className='flex-row gap-2 justify-center items-center '>
                 <MessagesSquare size={18} color={Colors.secondary} />
                 <Text className='text-mainGray'>{activity.user.firstName} {activity.description}</Text>
               </View>
               <Image
                 source={{ uri: `${posterURL}${activity?.threads.movie?.backdropPath || activity?.threads.tv?.backdropPath}` }}
                 placeholder={{ uri: `${posterURLlow}${activity?.threads.movie?.backdropPath || activity?.threads.tv?.backdropPath}` }}
                 placeholderContentFit='cover'
                 contentFit='cover'
                 style ={{ width:'100%', height:150, borderRadius:15 }}
               />
               <View className='w-full flex-start items-start flex-row gap-2 '>
                   <TouchableOpacity onPress={()=>handleLike(activity)} style={{ flexDirection:'row', gap:5, alignItems:'center', justifyContent:'center' }}>
                     <Heart size={20} strokeWidth={2.5} color={ alreadyLikedActivity ? Colors.secondary : Colors.mainGray}></Heart>
                   <Text className='text-mainGray text-xs font-pbold'>{activity.likes}</Text>
                   </TouchableOpacity>
                 </View>
        </View>

        ) }
        </>
    ) : (
        <>
        <View className='flex-row gap-2 justify-center items-center  '>
            <MessagesSquare size={18} color={Colors.secondary} />
            <Text className='text-mainGray'>{activity.user.firstName} {activity.description}</Text>
        </View>
        {imagePaths && (
            <Image
                    source={{ uri: `${posterURL}${imagePaths }` }}
                    placeholder={{ uri: `${posterURLlow}${imagePaths}` }}
                    placeholderContentFit='cover'
                    contentFit='cover'
                    style ={{ width:'100%', height:150, borderRadius:15}}
            />
        ) }
        </>
    )  }

    {/* ---------------------image */}
   

    {/* ---------------------footer */}
    { activity.activityType === 'DIALOGUE' || activity.activityType === 'THREAD' ? (
    <View className='flex-row  justify-between w-full items-end '>
          <View className='relative flex-row gap-5 justify-center items-center' >
          <TouchableOpacity onPress={()=>handleInteraction('upvotes',activity?.threads || activity?.dialogue)} >
                  <View className='flex-row gap-2 justify-center items-center'>
                      <ThumbsUp size={16} color={ alreadyUpvotedThread || alreadyUpvotedDialogue ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                      <Text className='text-xs font-pbold text-mainGray' style={{ color: alreadyUpvotedThread || alreadyUpvotedDialogue ? Colors.secondary : Colors.mainGray }}>{ activity?.threads?.upvotes || activity?.dialogue?.upvotes || '' }</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>handleInteraction('downvotes',activity?.threads || activity?.dialogue)} >
              <View className='flex-row gap-2 justify-center items-center'>
                  <ThumbsDown size={18} color={ alreadyDownvotedThread || alreadyDownvotedDialogue ? Colors.secondary :  Colors.mainGray} ></ThumbsDown>
                  <Text  className='text-xs font-pbold text-mainGray' style={{ color: alreadyDownvotedThread || alreadyDownvotedDialogue ? Colors.secondary : Colors.mainGray }}>{ activity?.threads?.downvotes || activity?.dialogue?.downvotes || ''}</Text>
              </View>
              </TouchableOpacity>
              <View className='flex-row  justify-center items-center   ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <MessageIcon   className='' size='18' color={Colors.mainGray} />
                  <Text className='text-xs font-pbold text-gray-400  '> {activity?.threads?.comments?.length || activity?.dialogue?.comments?.length}</Text>
              </View>
              <TouchableOpacity onPress={()=>handleInteraction('reposts',activity?.threads || activity?.dialogue)} >
              <View className='flex-row  justify-center items-center  ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <RepostIcon className='' size='14' color={ alreadyRepostedThread || alreadyRepostedDialogue ? Colors.secondary :  Colors.mainGray}/>
                  <Text className='text-xs font-pbold text-gray-400  ' style={{ color: alreadyRepostedThread || alreadyRepostedDialogue ? Colors.secondary : Colors.mainGray }}> {activity?.threads?.reposts || activity?.dialogue?.reposts || ''}</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity   >
              <View className='flex-row  justify-center items-center  ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <ThreeDotsIcon className='' size='14' color={Colors.mainGray} />
              </View>
              </TouchableOpacity>
          </View>
          { activity.activityType === 'DIALOGUE' && (
             <View className='flex-row gap-3  item-center justify-center' >
             { activity.dialogue.mentions && activity.dialogue.mentions.length > 0 && activity.dialogue.mentions.map( mention => (
                 <TouchableOpacity key={mention.id}  onPress={()=>handleMentionPress(mention)}  className=' items-center'>
                     <Image
                         source={{ uri: `${posterURL}${mention.movie ? mention.movie.posterPath : mention.tv ? mention.tv.posterPath : mention.castCrew && mention.castCrew.posterPath}` }}
                         contentFit='cover'
                         style={{ width:35, height:45, borderRadius:10, overflow:'hidden' }}
                     />
                 </TouchableOpacity>
             ) ) 
             }
             </View>
          ) }
      </View>

    ) : (
        <View className='w-full flex-start items-start flex-row gap-2'>
                  <TouchableOpacity onPress={()=>handleLike(item)} style={{ flexDirection:'row', gap:5, alignItems:'center', justifyContent:'center' }}>
                    <Heart size={20} strokeWidth={2.5} color={ alreadyLikedActivity ? Colors.secondary : Colors.mainGray}></Heart>
                  <Text className='text-mainGray text-xs font-pbold'>{activity.likes}</Text>
                  </TouchableOpacity>
                </View>
    ) }
  </TouchableOpacity>
    ) }

   </> 
  )
}

export default ActivityCard

const styles = StyleSheet.create({})