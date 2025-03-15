import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { Colors } from '../constants/Colors'
import { MessageIcon, ThreeDotsIcon, RepostIcon, ProgressCheckIcon } from '../assets/icons/icons'
import { ThumbsUp, ThumbsDown, Heart, MessagesSquare, MessageSquare, ListChecks , Star, Eye} from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { formatDate } from '../lib/formatDate'
import { toPascalCase } from '../lib/ToPascalCase'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../api/user'
import { threadInteraction } from '../api/thread'
import ListCard from './ListCard'
import { likeActivity } from '../api/activity'
import { dialogueInteraction } from '../api/dialogue'

const ActivityCard = ( { activity, refetch } ) => {
    const router = useRouter()
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const { user : clerkUser } = useUser()
    const { data : ownerUser , refetch:refetchOwner} = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })


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

      const handleInteraction =  async (type, item) => {
        console.log('typeinteraction', type, item)
        if (item.threads){
            console.log('hello 1')
            let description;
            const truncatedTitle = item.threads.title.length > 30 ? item.threads.title.slice(0, 30) + '...' : item.threads.title
            if ( type === 'upvotes' ){
                description = `upvoted your thread "${truncatedTitle}"`
            } else if (type === 'downvotes'){
                description = `downvoted your thread "${truncatedTitle}"`
            }else  if ( type === 'reposts' ){
                description = `reposted your thread "${truncatedTitle}"`
            }
            const data = {
                type,
                threadId : Number(item.id),
                userId : ownerUser.id,
                recipientId : item.user.id,
                description 
            }
            console.log('data', data)
            const updatedThread = await threadInteraction(data)
            console.log('response from thread interaction', updatedThread)
            refetch();
        } else if (item.type === 'thread' || item.threadInteractions){
            console.log('hello 2')
            const truncatedTitle = item.title.length > 30 ? item.title.slice(0, 30) + '...' : item.title
            let description
            if ( type === 'upvotes' ){
                description = `upvoted your thread "${truncatedTitle}"`
            } else if (type === 'downvotes'){
                description = `downvoted your thread "${truncatedTitle}"`
            }else if ( type === 'reposts' ){
                description = `reposted your thread "${truncatedTitle}"`
            }
            const data = {
                type,
                threadId : Number(item.id),
                userId : ownerUser.id,
                recipientId : item.user.id,
                description 
            }
            console.log('data', data)
            const updatedThread = await threadInteraction(data)
            console.log('response from thread interaction', updatedThread)
            refetch();
        }else if (item.dialogue) {
            console.log('hello 3')
            const truncatedCaption =  item.dialogue.content.length > 30 ? item.dialogue.content.slice(0, 30) + '...' : item.dialogue.content
            let description
            if ( type === 'upvotes' ){
                description = `upvoted your thread "${truncatedCaption}"`
            } else if (type === 'downvotes'){
                description = `downvoted your thread "${truncatedCaption}"`
            }else  if ( type === 'reposts' ){
                description = `reposted your thread "${truncatedCaption}"`
            }
            const data = {
                type,
                dialogueId : Number(item.id),
                userId : ownerUser.id,
                recipientId : item.user.id,
                description 
            }
            console.log('data', data)
            const updatedDialogue = await dialogueInteraction(data)
            console.log('response from dialouge interaction', updatedDialogue)
            refetch();
        } else if (item.type === 'dialogue' || item.dialogueInteractions){
            console.log('hello 4')
            const truncatedCaption = item.content.length > 50 ? item.content.slice(0, 50) + '...' : item.content
            let description
            if ( type === 'upvotes' ){
                description = `upvoted your thread "${truncatedCaption}"`
            } else if (type === 'downvotes'){
                description = `downvoted your thread "${truncatedCaption}"`
            }else  if ( type === 'reposts' ){
                description = `reposted your thread "${truncatedCaption}"`
            }
            const data = {
                type,
                dialogueId : Number(item.id),
                userId : ownerUser.id,
                recipientId : item.user.id,
                description 
            }
            console.log('data', data)
            const updatedDialogue = await dialogueInteraction(data)
            console.log('response from dialoge interaction', updatedDialogue)
            refetch();
        }
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
    const handleLike = async (item) => {
        const likeData = {
          userId : ownerUser.id,
          activityId : item.id,
          recipientId : item.user.id,
          description : `liked your activity "${item.description || ''}"`
        }
        console.log('data to handle like', likeData)
        const likedActivity = await likeActivity(likeData)
        console.log('liekdactivty', likedActivity)
        // setData()
        // setTrigger(prev => !prev)
        // setData(  )
        refetchOwner()
        await refetch()
      } 

    const imagePaths =  activity?.movie?.backdropPath || activity?.tv?.backdropPath || activity?.rating?.movie?.backdropPath || activity?.rating?.tv?.backdropPath 

  return (
<>

    { activity.activityType === 'LIST' ? (
        <View>
            <ListCard list={activity.list} activity={activity.description} fromHome={true} />
        </View>
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
          <TouchableOpacity onPress={()=>{console.log("FROM HERE");handleInteraction('upvotes',activity )}} >
                  <View className='flex-row gap-2 justify-center items-center'>
                      <ThumbsUp size={16} color={ alreadyUpvotedThread ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                      <Text className='text-xs font-pbold text-mainGray' style={{ color: alreadyUpvotedThread ? Colors.secondary : Colors.mainGray }}>{ activity.upvotes || ''}</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>handleInteraction('downvotes',activity)} >
              <View className='flex-row gap-2 justify-center items-center'>
                  <ThumbsDown size={18} color={ alreadyDownvotedThread ? Colors.secondary :  Colors.mainGray} ></ThumbsDown>
                  <Text  className='text-xs font-pbold text-mainGray' style={{ color: alreadyDownvotedThread ? Colors.secondary : Colors.mainGray }}>{ activity.downvotes || '' }</Text>
              </View>
              </TouchableOpacity>
              <View className='flex-row  justify-center items-center   ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <MessageIcon   className='' size='18' color={Colors.mainGray} />
                  <Text className='text-xs font-pbold text-gray-400  '> {activity.comments.length || ''}</Text>
              </View>
              <TouchableOpacity onPress={()=>handleInteraction('reposts',activity)} >
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
              
               <View className='flex-row gap-2 justify-center items-center px-4 '>
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
        <View className='flex-row gap-2 justify-center items-center px-4 '>

            {/* { activity.activtyType === 'WATCHLIST' ? <ListChecks size={18} color={Colors.secondary} /> : activity.activityType === 'CURRENTLY_WATCHING' ?  } */}
            { activity.activityType === 'RATING' ? <Star size={18} color={Colors.secondary} /> : activity.activityType === 'DIALOGUE' ? <MessageSquare size={18} color={Colors.secondary} /> :
                  activity.activityType === 'CURRENTLY_WATCHING' ? <ProgressCheckIcon size={18} color={Colors.secondary} /> : activity.activityType==='WATCHLIST' ? <ListChecks size={18} color={Colors.secondary} /> :
                  activity.activityType === 'LIKE' ? <Heart size={18} color={Colors.secondary} /> : activity.activityType === 'UPVOTE' ? <ThumbsUp size={18} color={Colors.secondary} /> : 
                  activity.activityType === 'DOWNVOTE' ? <ThumbsDown size={18} color={Colors.secondary}  /> : activity.activityType === 'WATCHED' && <Eye size={18} color={Colors.secondary} /> }
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
                  <TouchableOpacity onPress={()=>handleLike(activity)} style={{ flexDirection:'row', gap:5, alignItems:'center', justifyContent:'center' }}>
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