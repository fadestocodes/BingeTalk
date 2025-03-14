import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThumbsUp, ThumbsDown, List } from 'lucide-react-native'
import { MessageIcon, RepostIcon, ThreeDotsIcon } from '../assets/icons/icons'
import { Colors } from '../constants/Colors'
import { Image } from 'expo-image'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../api/user'
import { formatDate } from '../lib/formatDate'
import { useRouter } from 'expo-router'
import { listInteraction } from '../api/list'

const ListCard = ({ list:item , activity, fromHome}) => {

    const { user:clerkUser } = useUser();
    const { data:ownerUser } = useFetchOwnerUser({email : clerkUser.emailAddresses[0].emailAddress});
    const posterURL = 'https://image.tmdb.org/t/p/w500';
    const router = useRouter()


    const alreadyUpvoted = item.listInteractions.some( i => i.interactionType === 'UPVOTE' && i.userId === ownerUser.id )
    const alreadyDownvoted = item.listInteractions.some( i => i.interactionType === 'DOWNVOTE'  && i.userId === ownerUser.id )
    const alreadyReposted = item.listInteractions.some( i => i.interactionType === 'REPOST'  && i.userId === ownerUser.id )


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
        console.log('type', type)
        const data = {
            type,
            listId : item.id,
            userId : ownerUser.id
        }
        const updatedDialogue = await listInteraction(data)
        // refetch();
    }



  return (
    <View className='w-full' >
                    <TouchableOpacity onPress={()=>handleListPress(item)}  style={{  borderRadius:10, backgroundColor:Colors.mainGrayDark,paddingVertical:15, paddingHorizontal:15, gap:15 }} >
                        <View className='gap-3'>
                            <View className='flex-row w-full gap-2 justify-between items-center mb-0'>
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
                            { activity && (
                                <View className='flex-row gap-3 items-center justify-center w-full px-4 '>
                                    <List size={18} color={Colors.secondary} />
                                    <Text className='text-mainGray'>{item.user.firstName} { activity }</Text>
                                </View>
                            ) }
                            <View className=' gap-0 justify-center items-start' >
                                        <Text className='text-white font-pbold text-xl' >{ item.title }</Text>
                                        <Text className='text-white text-sm '>{`(${item.listItem.length} ${item.listItem.length > 1 ? `items` : 'item'})`}</Text>
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
  )
}

export default ListCard

const styles = StyleSheet.create({})