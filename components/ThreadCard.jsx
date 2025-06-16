import { StyleSheet, Text, View , TouchableOpacity, ActivityIndicator,Linking} from 'react-native'
import { Image } from 'expo-image';
import { MessagesSquare, ThumbsDown, ThumbsUp, ExternalLink } from 'lucide-react-native';
import { MessageIcon, RepostIcon, ThreeDotsIcon } from '../assets/icons/icons';
import { Colors } from '../constants/Colors';
import { formatDate, formatDateNotif } from '../lib/formatDate';
import { useUser } from '@clerk/clerk-expo';
import { useFetchOwnerUser } from '../api/user';
import { useRouter } from 'expo-router';
import { threadInteraction } from '../api/thread';
import React, {useState, useEffect} from 'react'
import { toPascalCase } from '../lib/ToPascalCase';
import { getLinkPreview } from '../api/linkPreview'
import { LinearGradient } from 'expo-linear-gradient'



const ThreadCard = ({thread, refetch, isBackground, isShortened, showThreadTopic, fromHome, activity, isReposted, fromSearchHome}) => {
    const posterURL = 'https://image.tmdb.org/t/p/w342';
    const router = useRouter();
    const userDB = thread?.user
    const tag = thread?.tag;
    const { user: clerkUser } = useUser()
    const { data : ownerUser, refetch:refetchOwner  } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress}  )
    const [ url, setUrl ] = useState({
        image : '',
        title : '',
        subtitle : '',
        link : ''
    })


    // const alreadyUpvoted = thread.threadInteractions?.some( item => item.interactionType === 'UPVOTE' && item.userId === ownerUser?.id )
    // const alreadyDownvoted = thread.threadInteractions?.some( item => item.interactionType === 'DOWNVOTE'  && item.userId === ownerUser?.id )
    // const alreadyReposted = thread.threadInteractions?.some( item => item.interactionType === 'REPOST'  && item.userId === ownerUser?.id )


    const [ already, setAlready ] = useState({
        upvoted : false,
        downvoted : false,
        reposted : false
    })

    const [ interactionCounts, setInteractionCounts ] = useState({
        upvotes : thread.upvotes ,
        downvotes : thread.downvotes ,
        reposts : thread.reposts
    })

    useEffect(() => {


        
    const alreadyUpvoted = thread.threadInteractions?.some( item => item.interactionType === 'UPVOTE' && item.userId === ownerUser?.id )
    const alreadyDownvoted = thread.threadInteractions?.some( item => item.interactionType === 'DOWNVOTE'  && item.userId === ownerUser?.id )
    const alreadyReposted = thread.threadInteractions?.some( item => item.interactionType === 'REPOST'  && item.userId === ownerUser?.id )

        setAlready({
            upvoted : alreadyUpvoted,
            downvoted : alreadyDownvoted,
            reposted : alreadyReposted
        })

        setInteractionCounts({
            upvotes : thread.upvotes ,
            downvotes : thread.downvotes ,
            reposts : thread.reposts
        })

        const useGetLinkPreview = async () => {

            const linkPreview = await getLinkPreview(thread.url);
            setUrl({
                link : thread.url,
                image : linkPreview.imageUrl,
                title : linkPreview.title,
                subtitle : linkPreview.h1
            })
        }
        if (thread && thread?.url){
            useGetLinkPreview()
        }
    }, [thread, ownerUser])


 

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


        const updatedDialogue = await threadInteraction(data)

        refetchOwner();
    }

    const handlePress = (item) => {
        if (item?.movie ){
            if (fromHome) {
                router.push(`(home)/movie/${item.movie.tmdbId}`)
            } else {
                router.push(`/movie/${item.movie.tmdbId}`)
            }
        } else if (item?.tv){
            if (fromHome){
                router.push(`(home)/tv/${item.tv.tmdbId}`)
            } else {
                router.push(`/tv/${item.tv.tmdbId}`)
            }
        } else if (item?.castCrew){
            if (fromHome){
                router.push(`(home)/cast/${item.castCrew.tmdbId}`)
            }else {
                router.push(`/cast/${item.castCrew.tmdbId}`)
            }
        }
    }

    
    const handleThreeDots = (thread) => {

        const fromOwnPost = thread.userId === ownerUser.id
        router.push({
            pathname:'/postOptions',
            params: { fromOwnPost : fromOwnPost ? 'true' : 'false', ownerId : ownerUser.id, postType : 'THREAD', postId : thread.id, postUserId : thread.userId}
        })
    }


    const handleUserPress = (thread) => {
        if (fromHome){
            router.push(`/(home)/user/${thread.user.id}`)
        } else {
            router.push(`/user/${thread.user.id}`)
        }
    }


    const handleComment = (thread) => {
        refetchOwner()
        if (fromHome){
            router.push({
                pathname:`(home)/commentsModal`,
                params : { userId : userDB.id, threadId : thread.id }
            })
        } else {
            router.push({
                pathname:`/commentsModal`,
                params : { userId : userDB.id, threadId : thread.id }
            })
        }
    }


    const handleLinkPress = async () => {
        const supported = await Linking.canOpenURL(thread.url);
        if (supported) {
            await Linking.openURL(thread.url); // Opens in default browser
        } 
    };



    if (!thread || !ownerUser){
        return (
            <View className='h-full bg-primary'>
                <ActivityIndicator/>
            </View>
        )
    }



  return (
    <View className='gap-3 '  style={{ backgroundColor:isBackground && Colors.mainGrayDark, paddingVertical:isBackground ? 12 : 0, paddingHorizontal: isBackground && 15, borderRadius:15, gap:15 }} >
           
          <View className='flex-row w-full justify-between items-center '>
                        <View className="flex-row items-center gap-2 ">
                        { isReposted ? (
                    <RepostIcon size={20} color={Colors.mainGray} style={{ marginRight:10 }}/>
                ) : null }
                            <TouchableOpacity onPress={()=>handleUserPress(thread)} style={{ flexDirection:'row', gap:5, justifyContent:'center', alignItems:'center' }}>
                                <Image
                                    source={{ uri: thread?.user?.profilePic }}
                                    contentFit='cover'
                                    style={{ borderRadius:'50%', overflow:'hidden', width:30, height:30 }}
                                />
                                <Text className='text-mainGrayDark   ' >@{thread.user.username}</Text>
                            </TouchableOpacity>
                        </View>
                    <Text className='text-mainGrayDark '>{formatDateNotif(thread.createdAt)}</Text>
                    
                </View>
              
                <TouchableOpacity onPress={()=> handlePress(thread)} >

            <View className='flex-row justify-start items-center gap-2 mt-3 ' >
                            <Image
                                source = {{ uri : thread.movie ? `${posterURL}${thread.movie.posterPath}` : thread.tv ? `${posterURL}${thread.tv.posterPath}` : thread.castCrew && `${posterURL}${thread.castCrew.posterPath}` }}
                                contentFit='cover'
                                style={{ width:25, height:30, borderRadius:8, overflow:'hidden' }}
                            />
                <View onPress={()=>handlePress(thread)}  style={{}}>
                    <Text className=' text-white '  style={{  }}>{ thread.movie ? `/${toPascalCase(thread.movie.title)}` : thread.tv ? `/${toPascalCase(thread.tv.title)}` : thread.castCrew && `/${toPascalCase(thread.castCrew.name)}` }</Text>
                </View>
                        </View>
                </TouchableOpacity>


            { thread.tag && (
            <View className='flex-row gap-3' >
                <Text className= 'font-pbold text-primary text-xs' style={{ backgroundColor: thread.tag.color , padding:5, borderRadius:10, alignSelf:'center'}}>{thread.tag.tagName}</Text>
            </View>
                
            ) }

            <Text className="text-white  font-pbold text-xl leading-6   ">{thread.title}</Text>
            { thread.caption ? (
              <View className='gap-3 mt-5'>
                <Text className='text-secondary text-lg leading-5 font-pcourier uppercase text-center'>{thread.user.firstName}</Text>
                <Text className="text-white  font-pcourier" numberOfLines={isBackground || fromSearchHome && 3 } >{thread.caption}</Text>
              </View>
            ) : null }


{ thread.image && (
                        <Image 
                            source={{ uri: thread.image }}
                            contentFit='cover'
                            style={{ width:'100%', height: fromSearchHome ? 100 : 300, borderRadius:15 }}
                        />
                    ) }
                    { url.image && (

                        thread.image ? (
                            <View className='w-full justify-center items-center'>
                                <TouchableOpacity onPress={handleLinkPress} style={{ backgroundColor:isBackground ? Colors.primary : Colors.mainGrayDark, paddingHorizontal:25, paddingVertical:7, borderRadius:15, flexDirection:'row' , gap:5, width:'85%', justifyContent:'center', alignItems:'center'}}>
                                    <ExternalLink size={14} color={Colors.mainGray} />
                                    <Text className='text-sm text-mainGray font-pregular' numberOfLines={1}>{url.link}</Text>
                                   
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={handleLinkPress} style={{ borderRadius:15, height:150, width:'100%', position:'relative'}}>
                          
                            <Image
                                source ={{ uri :url.image }}
                                contentFit='cover'
                                style={{ width:'100%', height: fromSearchHome ? 100 : '100%', borderRadius:15 , position:'absolute'}}
                            />
                            <LinearGradient
                                colors={['transparent', isBackground ?  Colors.mainGrayDark : Colors.primary]}
                                style={{
                                height: '100%',
                                width: '100%',
                                position: 'absolute',
                                }}
                            />
                            <View className='flex-row justify-between items-end h-full gap-3 w-full' style={{ paddingHorizontal:15, paddingVertical:30  }}>
                                <Text className='text-mainGray  font-pbold ' numberOfLines={2} style={{width:'85%'}}>{url.title}</Text>
                            <TouchableOpacity disabled style={{  }}>
                                <ExternalLink size={22} color={Colors.mainGray}  />
                            </TouchableOpacity>
                            </View>
                            </TouchableOpacity>

                        )
                        ) }

                       
            
            <View className='flex-row  justify-between w-full items-end'>
                     
                       
                        <View className='relative flex-row gap-5 justify-center items-center' >
                        <TouchableOpacity onPress={()=>handleInteraction('upvotes',thread)} >
                                <View className='flex-row gap-2 justify-center items-center'>
                                    <ThumbsUp size={20} color={ already.upvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                                    <Text className='text-xs font-pbold text-mainGray' style={{ color: already.upvoted ? Colors.secondary : Colors.mainGray }}>{ interactionCounts.upvotes }</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>handleInteraction('downvotes',thread)} >
                            <View className='flex-row gap-2 justify-center items-center'>
                                <ThumbsDown size={20} color={ already.downvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsDown>
                                <Text  className='text-xs font-pbold text-mainGray' style={{ color: already.downvoted ? Colors.secondary : Colors.mainGray }}>{ interactionCounts.downvotes }</Text>
                            </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>handleComment(thread)}  >
                            <View className='flex-row  justify-center items-center   ' style={{height:32, borderColor:Colors.mainGray}}>
                                <MessageIcon   className='' size={20} color={Colors.mainGray} />
                                <Text className='text-xs font-pbold text-gray-400  '> {thread.comments.length}</Text>
                            </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>handleInteraction('reposts',thread)} >
                            <View className='flex-row  justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                                <RepostIcon className='' size={20} color={ already.reposted ? Colors.secondary :  Colors.mainGray}/>
                                <Text className='text-xs font-pbold text-gray-400  ' style={{ color: already.reposted ? Colors.secondary : Colors.mainGray }}> {interactionCounts.reposts}</Text>
                            </View>
                            </TouchableOpacity>
                        </View>
                            <TouchableOpacity onPress={()=>handleThreeDots(thread)}   >
                            <View className='flex-row  justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                                <ThreeDotsIcon className='' size={20} color={Colors.mainGray} />
                            </View>
                            </TouchableOpacity>
                        
                            
                    </View>
          </View>
  )
}

export default ThreadCard

const styles = StyleSheet.create({})