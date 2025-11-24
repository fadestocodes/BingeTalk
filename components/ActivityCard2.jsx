
import { StyleSheet, Text, View , TouchableOpacity, FlatList} from 'react-native'
import React, {act, useEffect, useState} from 'react'
import { Image } from 'expo-image'
import { Colors } from '../constants/Colors'
import { MessageIcon, ThreeDotsIcon, RepostIcon, ProgressCheckIcon } from '../assets/icons/icons'
import { ThumbsUp, ThumbsDown, Heart, MessagesSquare, MessageSquare, ListChecks , Star, Eye} from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { formatDate, formatDateNotif } from '../lib/formatDate'
import { toPascalCase } from '../lib/ToPascalCase'
import { useFetchOwnerUser } from '../api/user'
import { likeActivity, activityInteraction, useFetchActivityId } from '../api/activity'
import { avatarFallback } from '../lib/fallbackImages'
import { avatarFallbackCustom, moviePosterFallback } from '../constants/Images'
import { useGetUser, useGetUserFull } from '../api/auth'
import Username from './ui/Username'
import { badgeIconMap } from '../constants/BadgeIcons'

const ActivityCard2 = ({activity, fromHome, disableCommentsModal, isBackground}) => {

    const router = useRouter()
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';


    const {user} = useGetUser()
    const {userFull:ownerUser, refetch:refetchOwner, displayBadgeIcon}= useGetUserFull(user?.id)

    const { refetch } = useFetchActivityId(activity?.id)

    const [ badgeImage, setBadgeImage ] = useState('')


    // const alreadyUpvoted = activity?.activityInteractions?.some( item => item.interactionType === 'UPVOTE' && item.userId === ownerUser?.id )
    // const alreadyDownvoted = activity?.activityInteractions?.some( item => item.interactionType === 'DOWNVOTE'  && item.userId === ownerUser?.id )
    // const alreadyReposted = activity?.activityInteractions?.some( item => item.interactionType === 'REPOST'  && item.userId === ownerUser?.id )
    

    const imagePaths =  activity?.movie?.backdropPath || activity?.tv?.backdropPath || activity?.rating?.movie?.backdropPath || activity?.rating?.tv?.backdropPath 
    
    const [ interactions, setInteractions ] = useState({
        upvotes : {
            alreadyPressed : false,
            count : activity?.upvotes
        } ,
        downvotes :{
            alreadyPressed : false,
            count : activity?.downvotes
        } ,
        reposts : {
            alreadyPressed : false,
            count : activity?.reposts
        } 
    })

    useEffect(() => {

        const alreadyUpvoted = activity?.activityInteractions?.some( item => item.interactionType === 'UPVOTE' && item.userId === ownerUser?.id )
        const alreadyDownvoted = activity?.activityInteractions?.some( item => item.interactionType === 'DOWNVOTE'  && item.userId === ownerUser?.id )
        const alreadyReposted = activity?.activityInteractions?.some( item => item.interactionType === 'REPOST'  && item.userId === ownerUser?.id )
        
        setInteractions({
            upvotes : {
                alreadyPressed : alreadyUpvoted,
                count : activity?.upvotes
            } ,
            downvotes :{
                alreadyPressed : alreadyDownvoted,
                count : activity?.downvotes
            } ,
            reposts : {
                alreadyPressed : alreadyReposted,
                count : activity?.reposts
            } 
        })

        if (activity.activityType === 'BADGE'){
            const badgeData = badgeIconMap.find( i => i.type === activity.badge.badgeType)
            setBadgeImage(badgeData.levels[activity.badge.badgeLevel].uri)
        }

    }, [activity, ownerUser])


    const handleUserPress = (item) => {
        if (fromHome){
            router.push(`/(home)/user/${item.id}`)
        } else {
            router.push(`/user/${item.id}`)
        }
    }



    const handleComment =  (activity) => {
         refetchOwner()
        if (fromHome){

            router.push({
                pathname:`(home)/commentsModal`,
                params : { userId : ownerUser.id, activityId : activity.id }
            })
        } else {
            router.push({
                pathname:`/commentsModal`,
                params : { userId : ownerUser.id, activityId : activity.id }
            })

        }
    }

    const handlePosterPress = (item) => {
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
        } else if (item?.threads?.castCrew){
            router.push(`/(home)/cast/${item.threads.castCrew.tmdbId}`)
        }
    }

    const handleInteraction =  async (type, activity) => {
        setInteractions(prev => ({
            ...prev,
            [type]: {
              ...prev[type],
              alreadyPressed: !prev[type].alreadyPressed,
              count : prev[type].alreadyPressed ? prev[type].count -1 : prev[type].count +1
            }
          }))
     
        let description
        if ( type === 'upvotes' ){
            description = `upvoted your activity "${activity.description}"`
            
        } else if (type === 'downvotes'){
            description = `downvoted your activity "${activity.description}"`
           
        }else  if ( type === 'reposts' ){
            description = `reposted your activity "${activity.description}"`
           
        }
        const data = {
            type,
            activityId : activity.id,
            userId : ownerUser.id,
            description,
            recipientId : activity.user.id
        }
        const updatedDialogue = await activityInteraction(data)
        refetch();
    }

    const handleThreeDots = (item) => {

        const fromOwnPost = item.userId === ownerUser.id

        router.push({
            pathname: fromHome ? '(home)/postOptions' : '/postOptions',
            params: { fromOwnPost : fromOwnPost ? 'true' : 'false', ownerId : ownerUser.id, postType : 'DIALOGUE', postId : item.id, postUserId : item.userId}
        })
    }

    if (!activity  ){
        return (
            <View className='w-full h-full bg-primary justify-center items-center'>
                <ActivityIndicator/>
            </View>
        )
    }



  return (
    <View disabled={ activity.activityType !== 'THREAD' && activity.activityType !== 'DIALOGUE' }     style={{ backgroundColor: isBackground && Colors.mainGrayDark, padding: isBackground && 15, borderRadius:15,gap:10}}>
        <View   className='flex-row gap-2   items-center justify-between '>

            <TouchableOpacity onPress={()=>{handleUserPress(activity.user)}} className='flex-row gap-2 justify-center items-center'>
            <Image
                source={{ uri : activity.user.profilePic || avatarFallbackCustom }}
                contentFit='cover'
                style={{ width:30, height:30, borderRadius:50 }}
            />
            <Username size='sm' user={activity.user} color={Colors.mainGrayDark2} reverse={true}/>
            </TouchableOpacity>
            <Text className='  text-mainGrayDark'>{formatDateNotif(activity.createdAt)}</Text>
        </View>
        <View className='flex-row gap-2 justify-center items-center px-4 '>

            { activity.activityType === 'RATING' ? <Star size={20} color={Colors.secondary} /> : activity.activityType === 'DIALOGUE' ? <MessageSquare size={20} color={Colors.secondary} /> :
                activity.activityType === 'CURRENTLY_WATCHING' ? <ProgressCheckIcon size={20} color={Colors.secondary} /> : activity.activityType==='WATCHLIST' ? <ListChecks size={20} color={Colors.secondary} /> :
                activity.activityType === 'LIKE' ? <Heart size={20} color={Colors.secondary} /> : activity.activityType === 'UPVOTE' ? <ThumbsUp size={20} color={Colors.secondary} /> : 
                activity.activityType === 'DOWNVOTE' ? <ThumbsDown size={20} color={Colors.secondary}  /> : activity.activityType === 'WATCHED' && <Eye size={20} color={Colors.secondary} /> }
            <Text className='text-mainGray'>{activity.user.firstName} {activity.description}</Text>
        </View>
        {/* { activity?.review?.review && (
            <>
            <Text className='text-secondary uppercase font-pcourier text-center text-lg' >{activity.user.firstName}</Text>
            <Text className='text-white font-pcourier text-lg' style={{lineHeight:18}} numberOfLines={fromHome && 3}>{activity.review.review}</Text>
            </>
        ) } */}
        {!!imagePaths ? (
            <TouchableOpacity onPress={()=>handlePosterPress(activity)}>
                <Image
                        source={{ uri: `${posterURL}${imagePaths }` }}
                        placeholder={{ uri: `${posterURLlow}${imagePaths}` }}
                        placeholderContentFit='cover'
                        contentFit='cover'
                        style ={{ width:'100%', height:150, borderRadius:15}}
                />
            </TouchableOpacity>
        ): badgeImage && (
            <Image
                source={ badgeImage}
                width={110}
                height={120}
                contentFit='contain'
                style={{ overflow:'hidden', alignSelf:'center'}}
            />
        ) }

        { activity?.currentRotation?.length > 0 && (
            <View style={{ flexDirection:'row', gap:15, justifyContent:'center', alignItems:'center', width:'100%' }}>
            {activity.currentRotation.map( i => (
                <View key={i.id} >
                <TouchableOpacity onPress={()=>handlePosterPress(i)} >
                <Image 
                    source={{ uri: `${posterURL}${i?.movie?.posterPath || i?.tv?.posterPath }` }}

                    placeholder={moviePosterFallback}

                    placeholderContentFit='cover'
                    contentFit='cover'
                    style ={{ width:40, height:60, borderRadius:10}}
                />
                </TouchableOpacity>
                </View>
            ) )}
            </View>
        ) }

      
<View className=' flex-row items-end justify-between  w-full '>
                <View className='flex-row gap-4 items-end justify-between w-full '>
                    <View className='flex-row gap-5 justify-center items-center'>
                        <TouchableOpacity onPress={()=> handleInteraction('upvotes',activity) } >
                            <View className='flex-row gap-1 justify-center items-center'>
                                <ThumbsUp size={20} color={ interactions.upvotes.alreadyPressed ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                                <Text className='text-xs font-pbold ' style={{ color: interactions.upvotes.alreadyPressed ? Colors.secondary : Colors.mainGray }}>{ interactions.upvotes.count }</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=> handleInteraction('downvotes',activity) } >
                        <View className='flex-row gap-1 justify-center items-center'>
                            <ThumbsDown size={20}  color={ interactions.downvotes.alreadyPressed ? Colors.secondary :  Colors.mainGray}></ThumbsDown>
                            <Text  className='text-xs font-pbold text-mainGray' style={{ color: interactions.downvotes.alreadyPressed ? Colors.secondary : Colors.mainGray }}>{ interactions.downvotes.count }</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleComment(activity)} disabled={disableCommentsModal} >
                        <View className='flex-row gap-1  justify-center items-center   ' style={{height:32, borderColor:Colors.mainGray}}>
                            <MessageIcon   className='' size={20}  color={   Colors.mainGray}/>
                            <Text className='text-xs font-pbold text-gray-400  '> {activity?.commentsOnActivity?.length}</Text>
                        </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={()=> handleInteraction('reposts',activity) } >
                        <View className='flex-row gap-1 justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                            <RepostIcon className='' size={20}  color={ interactions.reposts.alreadyPressed ? Colors.secondary :  Colors.mainGray}/>
                            <Text className='text-xs font-pbold text-gray-400  'style={{ color: interactions.reposts.alreadyPressed ? Colors.secondary : Colors.mainGray }}> {interactions.reposts.count}</Text>
                        </View>

                        </TouchableOpacity> */}
                            
                    </View>
                    
                        <View className='relative' >
                            <TouchableOpacity onPress={()=>handleThreeDots(activity)}  >
                            <View className='flex-row  justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                                <ThreeDotsIcon className='' size={20} color={Colors.mainGray} />
                            </View>
                            </TouchableOpacity>
                        </View>
                </View>
                
            </View>


    
    </View>

  )
}

export default ActivityCard2

const styles = StyleSheet.create({})