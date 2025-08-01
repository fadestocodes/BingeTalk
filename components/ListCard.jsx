import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, {useEffect, useState} from 'react'
import { ThumbsUp, ThumbsDown, List } from 'lucide-react-native'
import { MessageIcon, RepostIcon, ThreeDotsIcon } from '../assets/icons/icons'
import { Colors } from '../constants/Colors'
import { Image } from 'expo-image'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../api/user'
import { formatDate } from '../lib/formatDate'
import { useRouter } from 'expo-router'
import { listInteraction } from '../api/list'
import { avatarFallback } from '../lib/fallbackImages'
import { avatarFallbackCustom, moviePosterFallback } from '../constants/Images'

const ListCard = ({ list:item , activity, fromHome, refetch, isReposted, pressDisabled}) => {

    const { user:clerkUser } = useUser();
    const { data:ownerUser, refetch:refetchOwner } = useFetchOwnerUser({email : clerkUser?.emailAddresses[0]?.emailAddress});
    const posterURL = 'https://image.tmdb.org/t/p/w500';
    const router = useRouter()
    const [ alreadyInteractions, setAlreadyInteractions ] = useState({
        upvoted : false,
        downvoted : false,
        reposted : false
    })

    const [ interactionCounts, setInteractionCounts ] = useState({
        upvotes : item.upvotes ,
        downvotes : item.downvotes ,
        reposts : item.reposts
    })


    useEffect(()=>{

        const alreadyUpvoted = item.listInteractions.some( i => i.interactionType === 'UPVOTE' && i.userId === ownerUser?.id )
        const alreadyDownvoted = item.listInteractions.some( i => i.interactionType === 'DOWNVOTE'  && i.userId === ownerUser?.id )
        const alreadyReposted = item.listInteractions.some( i => i.interactionType === 'REPOST'  && i.userId === ownerUser?.id )
        setAlreadyInteractions({
            upvoted: alreadyUpvoted,
            downvoted:alreadyDownvoted,
            reposted : alreadyReposted
        })
        setInteractionCounts({
            upvotes: item.upvotes,
            downvotes : item.downvotes,
            reposts : item.reposts
        })
    }, [item, ownerUser?.id])

    // const alreadyUpvoted = item.listInteractions.some( i => i.interactionType === 'UPVOTE' && i.userId === ownerUser?.id )
    // const alreadyDownvoted = item.listInteractions.some( i => i.interactionType === 'DOWNVOTE'  && i.userId === ownerUser?.id )
    // const alreadyReposted = item.listInteractions.some( i => i.interactionType === 'REPOST'  && i.userId === ownerUser?.id )

    // const [ already, setAlready ] = useState({
    //     upvoted : alreadyUpvoted,
    //     downvoted : alreadyDownvoted,
    //     reposted : alreadyReposted
    // })

    

 


    const handleListPress = ( item ) => {
        if (fromHome){
            router.push(`(home)/list/${item.id}`)
        } else {
            router.push(`/list/${item.id}`)
        }
    }

    const handleRecentlyWatchedPress = (userId) => {
        router.push(`/list/recently-watched/${userId}`)
    }

    const handleWatchlistPress = (userId) => {
        router.push(`/list/watchlist/${userId}`)
    }

    const handleInterestedPress = (userId) => {
        router.push(`/list/interested/${userId}`)
    }
    const handleRecommendedPress = (userId) => {
        router.push(`/list/recommended/${userId}`)
    }

    const handleInteraction =  async (type, item) => {
        if (type === 'upvotes'){
            setAlreadyInteractions(prev => ({...prev, upvoted : !prev.upvoted}))
            if (alreadyInteractions.upvoted){
                setInteractionCounts(prev => ({...prev, upvotes : prev.upvotes - 1}))
            } else {
                setInteractionCounts(prev => ({...prev, upvotes : prev.upvotes + 1}))
            }
        } else if (type === 'downvotes'){
            setAlreadyInteractions(prev => ({...prev, downvoted : !prev.downvoted}))
            if (alreadyInteractions.downvoted){
                setInteractionCounts(prev => ({...prev, downvotes : prev.downvotes - 1}))
            } else {
                setInteractionCounts(prev => ({...prev, downvotes : prev.downvotes + 1}))
            }
        } else if (type === 'reposts'){
            setAlreadyInteractions(prev => ({...prev, reposted : !prev.reposted}))
            if (alreadyInteractions.reposted){
                setInteractionCounts(prev => ({...prev, reposts : prev.reposts - 1}))
            } else {
                setInteractionCounts(prev => ({...prev, reposts : prev.reposts + 1}))
            }
        }
        let description
        if ( type === 'upvotes' ){
            description = `upvoted your list "${item.title}"`
            
        } else if (type === 'downvotes'){
            description = `downvoted your list "${item.title}"`
           
        }else  if ( type === 'reposts' ){
            description = `reposted your list "${item.title}"`
           
        }
        const data = {
            type,
            listId : item.id,
            userId : ownerUser.id,
            description,
            recipientId : item.user.id
        }
        const updatedDialogue = await listInteraction(data)
        refetchOwner();
    }


    
    const handleThreeDots = (list) => {

        const fromOwnPost = list.userId === ownerUser?.id
        router.push({
            pathname:'/postOptions',
            params: { fromOwnPost : fromOwnPost ? 'true' : 'false', ownerId : ownerUser?.id, postType : 'LIST', postId : list.id, postUserId : list.userId}
        })
    }


    const handleComment = (item) => {
        refetchOwner()
      
        if (fromHome){
            router.push({
                pathname:`(home)/commentsModal`,
                params : { userId : ownerUser?.id, listId : item.id }
            })
        } else {
            router.push({
                pathname:`/commentsModal`,
                params : { userId : ownerUser?.id, listId : item.id }
            })
        }
    }


    const handleUserPress = (item) => {
        if (fromHome){
            router.push(`/(home)/user/${item.user.id}`)
        } else {
            router.push(`/user/${item.user.id}`)
        }
    }


    if (!item || !ownerUser){
        return (
            <View className='h-full bg-primary'>
                <ActivityIndicator/>
            </View>
        )
    }




  return (
    <View className='w-full' >
                    <TouchableOpacity disabled={pressDisabled}  onPress={()=>handleListPress(item)}  style={{  borderRadius:10, backgroundColor:Colors.mainGrayDark,paddingVertical:15, paddingHorizontal:15, gap:15 }} >
                        <View className='gap-3 '>
                      
                            <View className='flex-row w-full gap-2 justify-between items-center mb-0'>
                                <View className='flex-row gap-2 justify-center items-center'>
                                { isReposted ? (
                                     <RepostIcon size={20} color={Colors.mainGray} style={{marginRight:10}}/>
                                ) : null}
                                    <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', gap:5}} onPress={()=>handleUserPress(item)}>
                                    <Image
                                    source ={{ uri :item.user.profilePic || avatarFallbackCustom}}
                                    contentFit='cover'
                                    style={{ width:25, height :25, borderRadius:50 }}
                                    />
                                    <Text className='text-mainGrayDark'>@{item.user.username}</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text className='text-mainGrayDark'>{formatDate(item.createdAt)}</Text>
                            </View>
                            { activity ? (
                                <View className='flex-row gap-3 items-center justify-center w-full px-4 '>
                                    <List size={20} color={Colors.secondary} />
                                    <Text className='text-mainGray'>{item.user.firstName} { activity }</Text>
                                </View>
                            ): null }
                            <View className=' gap-0 justify-center items-start' >
                                        <Text className='text-white font-pbold text-xl' >{ item.title }</Text>
                                        <Text className='text-white text-sm '>{`(${item.listItem.length} ${item.listItem.length > 1 ? `items` : 'item'})`}</Text>
                            </View>
                            <Text className='text-mainGray  font-pregular' numberOfLines={2}>{ item.caption }</Text>
                        </View>

                            <View style={{ flexDirection:'row', gap:10}} >
                        { item.listItem.slice(0,5).map( (element, index) => {
                        return (

                            <View key={index} className='flex-row gap-2' > 

                                <Image
                                    source={{ uri : element.movie ? `${posterURL}${element.movie.posterPath}` : element.tv ? `${posterURL}${element.tv.posterPath}` : element.castCrew &&  `${posterURL}${element?.castCrew.posterPath}` }}
                                    placeholder={moviePosterFallback}

                                    contentFit='cover'
                                    style= {{ borderRadius : 10, width:40, height:60 }}
                                />
                            </View>
                        )} ) }
                        { item.listItem.length - 5 > 0 ? (
                        <View
                            style={{ width:40, height : 60, borderRadius:10, backgroundColor:Colors.lightBlack, padding:5 }}
                        >
                            <Text className='text-sm text-mainGray font-pbold'>+ {item.listItem.length - 5 } more</Text>
                            </View>

                        ) : null }
                        </View>
                        <View className='w-full flex-row justify-between items-center'>
                            <View className='flex-row gap-5 justify-center items-center'>
                                <TouchableOpacity onPress={()=> handleInteraction('upvotes',item) } >
                                    <View className='flex-row gap-1 justify-center items-center'>
                                        <ThumbsUp size={20} color={ alreadyInteractions.upvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                                        <Text className='text-xs font-pbold ' style={{ color: alreadyInteractions.upvoted ? Colors.secondary : Colors.mainGray }}>{ interactionCounts.upvotes }</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={()=> handleInteraction('downvotes',item) } >
                                <View className='flex-row gap-1 justify-center items-center'>
                                    <ThumbsDown size={20}  color={ alreadyInteractions.downvoted ? Colors.secondary :  Colors.mainGray}></ThumbsDown>
                                    <Text  className='text-xs font-pbold text-mainGray' style={{ color: alreadyInteractions.downvoted ? Colors.secondary : Colors.mainGray }}>{ interactionCounts.downvotes }</Text>
                                </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>handleComment(item)}>
                                <View className='flex-row gap-1 justify-center items-center'>
                                    <MessageIcon size={20} color={Colors.mainGray}></MessageIcon>
                                    <Text className='text-xs font-pbold text-mainGray'>{ item.comments.length}</Text>
                                    </View>
                                </TouchableOpacity>

                                
                                <TouchableOpacity onPress={()=> handleInteraction('reposts',item) } >
                                <View className='flex-row gap-1 justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                                    <RepostIcon className='' size={20}  color={ alreadyInteractions.reposted ? Colors.secondary :  Colors.mainGray}/>
                                    <Text className='text-xs font-pbold text-mainGray  'style={{ color: alreadyInteractions.reposted ? Colors.secondary : Colors.mainGray }}> {interactionCounts.reposts}</Text>
                                </View>

                                </TouchableOpacity>
                            </View>
                            <View className='relative' >
                                <TouchableOpacity onPress={()=>handleThreeDots(item)}  >
                                    <ThreeDotsIcon className='' size={20} color={Colors.mainGray} />
                                </TouchableOpacity>
                            </View>
                            
                        </View>


                    </TouchableOpacity>
                </View>
  )
}

export default ListCard

const styles = StyleSheet.create({})