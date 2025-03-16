import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React, {act, useState} from 'react'
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

    const [ interactionCounts, setInteractionCounts ] = useState({
        likes : activity.likes || null,
        upvotes : activity?.upvotes || activity?.dialogue?.upvotes || activity?.threads?.upvotes || null,
        downvotes : activity?.downvotes || activity?.dialogue?.downvotes || activity?.threads?.downvotes || null,
        reposts : activity?.reposts || activity?.dialogue?.reposts || activity?.threads?.reposts || null,
    })


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

    const [ already, setAlready ] = useState({
        upvoted : alreadyUpvotedThread || alreadyUpvotedDialogue,
        downvoted : alreadyDownvotedThread || alreadyDownvotedDialogue,
        reposted : alreadyRepostedThread || alreadyRepostedDialogue,
        liked : alreadyLikedActivity
    })



    const handleUserPress = (item) => {
        router.push(`/(home)/user/${item.id}`)
      }

      const handleInteraction =  async (type, item) => {
        console.log('typeinteraction', type, item)
        if (type === 'upvotes'){
            if (already.upvoted){
                setInteractionCounts( prev => ({...prev, upvotes : prev.upvotes - 1}) )
            } else {
                setInteractionCounts( prev => ({...prev, upvotes : prev.upvotes + 1}) )
            }
            setAlready( prev => ({...prev, upvoted : !prev.upvoted}) )
        } else if (type === 'downvotes'){
            if (already.downvoted){
                setInteractionCounts( prev => ({...prev, downvotes : prev.downvotes - 1}) )
            } else {
                setInteractionCounts( prev => ({...prev, downvotes : prev.downvotes + 1}) )
            }
            setAlready( prev => ({...prev, downvoted : !prev.downvoted}) )
        } else if (type === 'reposts'){
            if (already.reposted){
                setInteractionCounts( prev => ({...prev, reposts : prev.reposts - 1}) )
            } else {
                setInteractionCounts( prev => ({...prev, reposts : prev.reposts + 1}) )
            }
            setAlready( prev => ({...prev, reposted : !prev.reposted}) )
        }

        if (item.threads){
            console.log('hello 1')
            let description;
            const truncatedTitle = item.threads.title.length > 50 ? item.threads.title.slice(0, 50) + '...' : item.threads.title
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
            // refetch();
        } else if (item.type === 'thread' || item.threadInteractions){
            console.log('hello 2')
            const truncatedTitle = item.title.length > 50 ? item.title.slice(0, 50) + '...' : item.title
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
            // refetch();
        }else if (item.dialogue) {
            console.log('hello 3')
            const truncatedCaption =  item.dialogue.content.length > 50 ? item.dialogue.content.slice(0, 50) + '...' : item.dialogue.content
            let description
            if ( type === 'upvotes' ){
                description = `upvoted your dialogue "${truncatedCaption}"`
            } else if (type === 'downvotes'){
                description = `downvoted your dialogue "${truncatedCaption}"`
            }else  if ( type === 'reposts' ){
                description = `reposted your dialogue "${truncatedCaption}"`
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
            // refetch();
        } else if (item.type === 'dialogue' || item.dialogueInteractions){
            console.log('hello 4')
            const truncatedCaption = item.content.length > 50 ? item.content.slice(0, 50) + '...' : item.content
            let description
            if ( type === 'upvotes' ){
                description = `upvoted your dialogue "${truncatedCaption}"`
            } else if (type === 'downvotes'){
                description = `downvoted your dialogue "${truncatedCaption}"`
            }else  if ( type === 'reposts' ){
                description = `reposted your dialogue "${truncatedCaption}"`
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
            // refetch();
        }
    }


    const handleMentionPress = (mention) => {
        if (mention.movie) {
                router.push(`(home)/movie/${mention.tmdbId}`)
        } else if (mention.tv) {
                router.push(`(home)/tv/${mention.tmdbId}`)
        } else {
                router.push(`(home)/cast/${mention.tmdbId}`)
        }
    }
    const handleLike = async (item) => {

        if (alreadyLikedActivity){
            setInteractionCounts( prev => ({...prev, likes : prev.likes - 1}) )
        } else {
            setInteractionCounts( prev => ({...prev, likes : prev.likes + 1}) )
        }
        setAlready( prev => ({...prev, liked : !prev.liked}) )


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
        // await refetch()
      } 

    const handleCardPress = (item) => {
        if (item.threadInteractions ){
            router.push(`(home)/threads/${item.id}`)
        } else if (item.activityType === 'THREAD'){
            router.push(`/(home)/threads/${item.threads.id}`)
        } else if ( item.dialogueInteractions ){
            router.push(`(home)/dialogue/${item.id}`)
        } else if (item.activityType === 'DIALOGUE'){
            router.push(`/(home)/dialogue/${item.dialogue.id}`)
        } 
    }
    
    const handlePosterPress = (item) => {
        console.log('item pressed',item)
        if (item?.movie){
            router.push(`(home)/movie/${item.movie.tmdbId}`)
        } else if (item?.threads?.movie){
            router.push(`(home)/movie/${item.threads.movie.tmdbId}`)
        } else if (item?.tv){
            router.push(`(home)/tv/${item.tv.tmdbId}`)
        }else if (item?.threads?.tv){
            router.push(`(home)/tv/${item.threads.tv.tmdbId}`)
        } else if (item?.rating?.movie){
            router.push(`(home)/movie/${item.rating.movie.tmdbId}`)
        } else if (item?.rating?.tv){
            router.push(`(home)/tv/${item.rating.tv.tmdbId}`)
        }
    }

    const imagePaths =  activity?.movie?.backdropPath || activity?.tv?.backdropPath || activity?.rating?.movie?.backdropPath || activity?.rating?.tv?.backdropPath 

  return (
<>

    { activity.activityType === 'LIST' ? (
        <View>
            <ListCard list={activity.list} activity={activity.description} fromHome={true}  refetch={refetch}/>
        </View>
    ): activity.type === 'thread' ?(
        <TouchableOpacity onPress={()=>handleCardPress(activity)}  style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15,gap:15}}>
             <View className="flex-row justify-between gap-2">
                 <TouchableOpacity onPress={()=>handleUserPress(activity.user)} className='flex-row gap-2 justify-center items-center'>
                         <Image
                           source={{ uri : activity.user.profilePic }}
                           contentFit='cover'
                           style={{ width:30, height:30, borderRadius:50 }}
                         />
                         <Text className='text-mainGrayDark '>@{activity.user.username}</Text>
                       </TouchableOpacity>
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
                      <ThumbsUp size={16} color={ already.upvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                      <Text className='text-xs font-pbold text-mainGray' style={{ color: already.upvoted ? Colors.secondary : Colors.mainGray }}>{interactionCounts.upvotes}</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>handleInteraction('downvotes',activity)} >
              <View className='flex-row gap-2 justify-center items-center'>
                  <ThumbsDown size={18} color={ already.downvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsDown>
                  <Text  className='text-xs font-pbold text-mainGray' style={{ color: already.downvoted ? Colors.secondary : Colors.mainGray }}>{ interactionCounts.downvotes }</Text>
              </View>
              </TouchableOpacity>
              <View className='flex-row  justify-center items-center   ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <MessageIcon   className='' size='18' color={Colors.mainGray} />
                  <Text className='text-xs font-pbold text-gray-400  '> {activity.comments.length || ''}</Text>
              </View>
              <TouchableOpacity onPress={()=>handleInteraction('reposts',activity)} >
              <View className='flex-row  justify-center items-center  ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <RepostIcon className='' size='14' color={ already.reposted ? Colors.secondary :  Colors.mainGray}/>
                  <Text className='text-xs font-pbold text-gray-400  ' style={{ color: already.reposted ? Colors.secondary : Colors.mainGray }}> {interactionCounts.reposts}</Text>
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

    <TouchableOpacity disabled={ activity.activityType !== 'THREAD' && activity.activityType !== 'DIALOGUE' }   onPress={()=>handleCardPress(activity)}  style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15,gap:15}}>

            
    {/* ---------------header */}
    <View   className='flex-row gap-2   items-center justify-between '>
      <TouchableOpacity onPress={()=>{handleUserPress(activity.user)}} className='flex-row gap-2 justify-center items-center'>
        <Image
          source={{ uri : activity.user.profilePic }}
          contentFit='cover'
          style={{ width:30, height:30, borderRadius:50 }}
        />
        <Text className='text-mainGrayDark '>@{activity.user.username}</Text>
      </TouchableOpacity>
    <Text className='  text-mainGrayDark'>{formatDate(activity.createdAt)}</Text>
    </View>

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
               <TouchableOpacity onPress={()=>handlePosterPress(activity)}>
               <Image
                 source={{ uri: `${posterURL}${activity?.threads.movie?.backdropPath || activity?.threads.tv?.backdropPath}` }}
                 placeholder={{ uri: `${posterURLlow}${activity?.threads.movie?.backdropPath || activity?.threads.tv?.backdropPath}` }}
                 placeholderContentFit='cover'
                 contentFit='cover'
                 style ={{ width:'100%', height:150, borderRadius:15 }}
               />
               </TouchableOpacity>
               <View className='w-full flex-start items-start flex-row gap-2 '>
                   <TouchableOpacity onPress={()=>handleLike(activity)} style={{ flexDirection:'row', gap:5, alignItems:'center', justifyContent:'center' }}>
                     <Heart size={20} strokeWidth={2.5} color={ already.liked ? Colors.secondary : Colors.mainGray}></Heart>
                   <Text className='text-mainGray text-xs font-pbold'>{interactionCounts.likes}</Text>
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
             <TouchableOpacity onPress={()=>handlePosterPress(activity)}>
            <Image
                    source={{ uri: `${posterURL}${imagePaths }` }}
                    placeholder={{ uri: `${posterURLlow}${imagePaths}` }}
                    placeholderContentFit='cover'
                    contentFit='cover'
                    style ={{ width:'100%', height:150, borderRadius:15}}
            />
            </TouchableOpacity>
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
                      <ThumbsUp size={16} color={already.upvoted? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                      <Text className='text-xs font-pbold text-mainGray' style={{ color:already.upvoted? Colors.secondary : Colors.mainGray }}>{ interactionCounts.upvotes }</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>handleInteraction('downvotes',activity?.threads || activity?.dialogue)} >
              <View className='flex-row gap-2 justify-center items-center'>
                  <ThumbsDown size={18} color={ already.downvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsDown>
                  <Text  className='text-xs font-pbold text-mainGray' style={{ color: already.downvoted ? Colors.secondary : Colors.mainGray }}>{ interactionCounts.downvotes}</Text>
              </View>
              </TouchableOpacity>
              <View className='flex-row  justify-center items-center   ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <MessageIcon   className='' size='18' color={Colors.mainGray} />
                  <Text className='text-xs font-pbold text-gray-400  '> {activity?.threads?.comments?.length || activity?.dialogue?.comments?.length}</Text>
              </View>
              <TouchableOpacity onPress={()=>handleInteraction('reposts',activity?.threads || activity?.dialogue)} >
              <View className='flex-row  justify-center items-center  ' style={{height:'auto', borderColor:Colors.mainGray}}>
                  <RepostIcon className='' size='14' color={ already.reposted ? Colors.secondary :  Colors.mainGray}/>
                  <Text className='text-xs font-pbold text-gray-400  ' style={{ color: already.reposted ? Colors.secondary : Colors.mainGray }}> {interactionCounts.reposts}</Text>
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
                    <Heart size={20} strokeWidth={2.5} color={ already.liked ? Colors.secondary : Colors.mainGray}></Heart>
                  <Text className='text-mainGray text-xs font-pbold'>{interactionCounts.likes}</Text>
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