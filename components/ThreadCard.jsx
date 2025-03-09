import { StyleSheet, Text, View , TouchableOpacity, ActivityIndicator,} from 'react-native'
import { Image } from 'expo-image';
import { ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { MessageIcon, RepostIcon, ThreeDotsIcon } from '../assets/icons/icons';
import { Colors } from '../constants/Colors';
import { formatDate } from '../lib/formatDate';
import { useUser } from '@clerk/clerk-expo';
import { useFetchOwnerUser } from '../api/user';
import { useRouter } from 'expo-router';
import { threadInteraction } from '../api/thread';

import React from 'react'
import { toPascalCase } from '../lib/ToPascalCase';


const ThreadCard = ({thread, refetch, isBackground, isShortened, showThreadTopic}) => {
    const userDB = thread.user
    const posterURL = 'https://image.tmdb.org/t/p/w342';
    const router = useRouter();
    const tag = thread.tag;
    const { user: clerkUser } = useUser()
    const { data : ownerUser  } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress}  )

    console.log("THREAD", thread)

    const alreadyUpvoted = thread.threadInteractions?.some( item => item.interactionType === 'UPVOTE' && item.userId === ownerUser.id )
    const alreadyDownvoted = thread.threadInteractions?.some( item => item.interactionType === 'DOWNVOTE'  && item.userId === ownerUser.id )
    const alreadyReposted = thread.threadInteractions?.some( item => item.interactionType === 'REPOST'  && item.userId === ownerUser.id )

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

    const handlePress = (item) => {
        if (item.movie ){
            router.push(`/movie/${item.movie.tmdbId}`)
        } else if (item.tv){
            router.push(`/tv/${item.tv.tmdbId}`)
        } else if (item.castCrew){
            router.push(`/cast/${item.castCrew.tmdbId}`)
        }
    }

    if (!thread){
        return <ActivityIndicator/>
    }


  return (
    <View className='gap-3'  style={{ backgroundColor:isBackground && Colors.mainGrayDark, paddingVertical:isBackground && 12, paddingHorizontal: isBackground && 15, borderRadius:15, marginBottom:15, gap:15 }} >

          <View className='flex-row w-full justify-between items-center'>
                        <View className="flex-row items-center gap-2 ">
                            <Image
                                source={{ uri: thread?.user?.profilePic }}
                                contentFit='cover'
                                style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                            />
                            <Text className='text-mainGrayDark   ' >@{thread.user.username}</Text>
                        </View>
                    <Text className='text-mainGrayDark '>{formatDate(thread.createdAt)}</Text>
                    
                </View>

            { showThreadTopic && (
                <TouchableOpacity onPress={()=>handlePress(thread)} >
                    <Text className='textlg text-white ' >{ thread.movie ? `/${toPascalCase(thread.movie.title)}` : thread.tv ? `/${toPascalCase(thread.tv.title)}` : thread.castCrew && `/${toPascalCase(thread.castCrew.name)}` }</Text>
                </TouchableOpacity>

            ) }

            <View className='flex-row gap-3' >
            { thread.tag && (
                  <Text className= 'mt-3 font-pbold text-primary text-xs ' style={{ backgroundColor: thread.tag.color , padding:5, borderRadius:10}}>{thread.tag.tagName}</Text>
            ) }
            </View>

            <Text className="text-white  font-pbold text-xl leading-6  ">{thread.title}</Text>
            { thread.caption && (
              <View className='gap-3 my-5'>
                <Text className='text-secondary text-lg leading-5 font-pcourier uppercase text-center'>{thread.user.firstName}</Text>
                <Text className="text-white  text-custom font-pcourier" numberOfLines={isShortened ? 3 : 10} >{thread.caption}</Text>
              </View>
            ) }
            
            <View className='flex-row  justify-between w-full my-3 items-center'>
                        {/* <View className='flex-row gap-5 justify-center items-center'>
                            
                        </View> */}
                        <TouchableOpacity onPress={()=> handlePress(thread)} >
                            <Image
                                source = {{ uri : thread.movie ? `${posterURL}${thread.movie.posterPath}` : thread.tv ? `${posterURL}${thread.tv.posterPath}` : thread.castCrew && `${posterURL}${thread.castCrew.posterPath}` }}
                                contentFit='cover'
                                style={{ width:35, height:45, borderRadius:10, overflow:'hidden' }}
                            />
                        </TouchableOpacity>
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
                            <View className='flex-row  justify-center items-center   ' style={{height:32, borderColor:Colors.mainGray}}>
                                <MessageIcon   className='' size='18' color={Colors.mainGray} />
                                <Text className='text-xs font-pbold text-gray-400  '> {thread.downVotes}</Text>
                            </View>
                            <TouchableOpacity onPress={()=>handleInteraction('reposts',thread)} >
                            <View className='flex-row  justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                                <RepostIcon className='' size='14' color={ alreadyReposted ? Colors.secondary :  Colors.mainGray}/>
                                <Text className='text-xs font-pbold text-gray-400  ' style={{ color: alreadyReposted ? Colors.secondary : Colors.mainGray }}> {thread.reposts}</Text>
                            </View>
                            </TouchableOpacity>
                            <TouchableOpacity   >
                            <View className='flex-row  justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                                <ThreeDotsIcon className='' size='14' color={Colors.mainGray} />
                            </View>
                            </TouchableOpacity>
                        </View>
                            
                    </View>
          </View>
  )
}

export default ThreadCard

const styles = StyleSheet.create({})