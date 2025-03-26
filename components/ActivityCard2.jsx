import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React, {act, useState} from 'react'
import { Image } from 'expo-image'
import { Colors } from '../constants/Colors'
import { MessageIcon, ThreeDotsIcon, RepostIcon, ProgressCheckIcon } from '../assets/icons/icons'
import { ThumbsUp, ThumbsDown, Heart, MessagesSquare, MessageSquare, ListChecks , Star, Eye} from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { formatDate, formatDateNotif } from '../lib/formatDate'
import { toPascalCase } from '../lib/ToPascalCase'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../api/user'
import { likeActivity } from '../api/activity'

const ActivityCard2 = ({activity, fromHome}) => {

    const router = useRouter()
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const { user : clerkUser } = useUser()
    const { data : ownerUser , refetch:refetchOwner} = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })  

    const [ interactionCounts, setInteractionCounts ] = useState(activity.likes || 0)
    const alreadyLikedActivity = ownerUser?.activityInteractions.some( interaction => interaction.activityId === activity.id  )

    const [ already, setAlready ] = useState(alreadyLikedActivity)

    const imagePaths =  activity?.movie?.backdropPath || activity?.tv?.backdropPath || activity?.rating?.movie?.backdropPath || activity?.rating?.tv?.backdropPath 


    const handleUserPress = (item) => {
        if (fromHome){
            router.push(`/(home)/user/${item.id}`)
        } else {
            router.push(`/user/${item.id}`)
        }
    }

      const handleLike = async (item) => {

        if (alreadyLikedActivity){
            setInteractionCounts( prev =>prev-1 )
        } else {
            setInteractionCounts( prev =>prev+1 )
        }
        setAlready( prev =>!prev)


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
        } else if (item?.threads?.castCrew){
            router.push(`/(home)/cast/${item.threads.castCrew.tmdbId}`)
        }
    }


    const handleThreeDots = (item) => {

        const fromOwnPost = item.userId === ownerUser.id
        console.log('fromownpost ', fromOwnPost)

        router.push({
            pathname: fromHome ? '(home)/postOptions' : '/postOptions',
            params: { fromOwnPost : fromOwnPost ? 'true' : 'false', ownerId : ownerUser.id, postType : 'DIALOGUE', postId : item.id, postUserId : item.userId}
        })
    }



  return (
    <View disabled={ activity.activityType !== 'THREAD' && activity.activityType !== 'DIALOGUE' }   onPress={()=>{console.log('itempressed from2',activity);handleCardPress(activity)}}  style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15,gap:10}}>
        <View   className='flex-row gap-2   items-center justify-between '>

            <TouchableOpacity onPress={()=>{handleUserPress(activity.user)}} className='flex-row gap-2 justify-center items-center'>
            <Image
                source={{ uri : activity.user.profilePic }}
                contentFit='cover'
                style={{ width:30, height:30, borderRadius:50 }}
            />
            <Text className='text-mainGrayDark '>@{activity.user.username}</Text>
            </TouchableOpacity>
            <Text className='  text-mainGrayDark'>{formatDateNotif(activity.createdAt)}</Text>
        </View>
        <View className='flex-row gap-2 justify-center items-center px-4 '>

            { activity.activityType === 'RATING' ? <Star size={18} color={Colors.secondary} /> : activity.activityType === 'DIALOGUE' ? <MessageSquare size={18} color={Colors.secondary} /> :
                activity.activityType === 'CURRENTLY_WATCHING' ? <ProgressCheckIcon size={18} color={Colors.secondary} /> : activity.activityType==='WATCHLIST' ? <ListChecks size={18} color={Colors.secondary} /> :
                activity.activityType === 'LIKE' ? <Heart size={18} color={Colors.secondary} /> : activity.activityType === 'UPVOTE' ? <ThumbsUp size={18} color={Colors.secondary} /> : 
                activity.activityType === 'DOWNVOTE' ? <ThumbsDown size={18} color={Colors.secondary}  /> : activity.activityType === 'WATCHED' && <Eye size={18} color={Colors.secondary} /> }
            <Text className='text-mainGray'>{activity.user.firstName} {activity.description}</Text>
        </View>
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
        ):null }

        <View className='w-full flex-start items-start flex-row gap-2'>
            <View className='flex-row justify-between w-full items-center'>
                <TouchableOpacity onPress={()=>handleLike(activity)} style={{ flexDirection:'row', gap:5, alignItems:'center', justifyContent:'center' }}>
                    <Heart size={20} strokeWidth={2.5} color={ alreadyLikedActivity ? Colors.secondary : Colors.mainGray}></Heart>
                <Text className='text-mainGray text-xs font-pbold'>{interactionCounts}</Text>
                </TouchableOpacity>
                <TouchableOpacity   >
            <TouchableOpacity onPress={()=>handleThreeDots(activity)} className='flex-row  justify-center items-center  ' style={{height:'auto', borderColor:Colors.mainGray}}>
                <ThreeDotsIcon className='' size={16} color={Colors.mainGray} />
            </TouchableOpacity>
            </TouchableOpacity>


            </View>
        </View>


    
    </View>

  )
}

export default ActivityCard2

const styles = StyleSheet.create({})