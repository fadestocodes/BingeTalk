import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, RefreshControl, FlatList } from 'react-native'
import React, {useState, useRef, useEffect} from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { setDayInteraction, useGetSetDay } from '../api/setDay'
import { Image } from 'expo-image'
import { ArrowLeft, ThumbsDown, ThumbsUp, Spotlight, Clapperboard } from 'lucide-react-native'
import { BackIcon, ClapperboardIcon, DirectorChairIcon, MessageIcon, RepostIcon } from '../assets/icons/icons'
import { Colors } from '../constants/Colors'
import CommentsComponent from './CommentsComponent'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, useAnimatedKeyboard } from 'react-native-reanimated';
import { useGetUser, useGetUserFull } from '../api/auth'
import { commentInteraction, createComment } from '../api/comments'
import { checkConversationalistBadge } from '../api/badge'
import { formatDate, formatDateNotif } from '../lib/formatDate'
import { ThreeDotsIcon } from '../assets/icons/icons'
import { avatarFallbackCustom } from '../constants/Images'
import SetDayIcon from './ui/SetDayIcon'
import { FeSpotLight } from 'react-native-svg'


const SetDayCard = ({ setDay, refetch, isBackground, fromHome }) => {
    // const {data:setDay, loading, refetch, interactedComments, commentsData, loading:isLoading, setInteractedComments, setCommentsData} = useGetSetDay(setDayId)
    const {user:userSimple} = useGetUser()
    const {userFull:ownerUser, refetch:refetchUserFull} = useGetUserFull(userSimple?.id)
    const router = useRouter()
    const keyboard = useAnimatedKeyboard(); 
    const [ input, setInput ] = useState('')
    const inputRef = useRef(null);  
    const [ replyingTo, setReplyingTo ] = useState(null)
    const [ replying, setReplying ] = useState(false)
    const [ visibleReplies, setVisibleReplies  ] = useState({})
    
    const [ interactions, setInteractions ] = useState({
        upvotes : {
            alreadyPressed : false,
            count : setDay?.upvotes || 0
        } ,
        downvotes :{
            alreadyPressed : false,
            count : setDay?.downvotes || 0
        } ,
        reposts : {
            alreadyPressed : false,
            count : setDay?.reposts || 0
        } 
    })
    
    useEffect(() => {
        
        
        if (!setDay || !ownerUser) return
        const alreadyUpvoted = setDay?.setDayInteractions?.some( item => item.interactionType === 'UPVOTE' && item.userId === ownerUser?.id )
        const alreadyDownvoted = setDay?.setDayInteractions?.some( item => item.interactionType === 'DOWNVOTE'  && item.userId === ownerUser?.id )
        const alreadyReposted = setDay?.setDayInteractions?.some( item => item.interactionType === 'REPOST'  && item.userId === ownerUser?.id )

        setInteractions({
            upvotes : {
                alreadyPressed : alreadyUpvoted,
                count : setDay?.upvotes || 0
            } ,
            downvotes :{
                alreadyPressed : alreadyDownvoted,
                count : setDay?.downvotes || 0
            } ,
            reposts : {
                alreadyPressed : alreadyReposted,
                count : setDay?.reposts || 0
            } 
        })

       
    }, [setDay, ownerUser])
    
    const animatedStyle = useAnimatedStyle(() => ({
        bottom: withTiming(keyboard.height.value-80, { duration: 0 }),
    }));





    const handleReply= (item, parentId) => {
        inputRef.current?.focus();  
        setReplying(true);
        setInput(`@${item.user.username} `)
        
        const replyingToData = {
            user : item.user,
            setDayId : Number(setDayId),
            content : item.content,
            parentId
        }
        setReplyingTo(replyingToData)
    }


    const handleReplyClose = () => {
        setReplying(false);
        setInput('');
        setReplyingTo(null)
    }

    const handleViewReplies = ( commentId, totalReplies ) => {
        setVisibleReplies( prev => ({
            ...prev,
            [commentId] : Math.min( ( prev[commentId] || 0 ) + 5 , totalReplies)
        }) )
    }



    const handlePostComment =  async ({ parentId = null }) => {
        ('trying to post comment...')
        const commentData = {
            userId : Number(ownerUser?.id),
            setDayId : Number(setDayId),
            content : input,
            parentId : replyingTo?.parentId || null,
            replyingToUserId : replyingTo?.user?.id || null,
            description: `commented on your SetDay "${input}"`,
            recipientId : data?.user.id,
            replyDescription : replyingTo ? `replied to your comment "${input}"` : null,
        }

    
        const newComment = await createComment( commentData );
        setInput('');
        setReplyingTo(null)
        setReplying(false)
        inputRef.current?.blur();

        const conversationalistProgression =  await checkConversationalistBadge(Number(ownerUser?.id))

        let levelUpData = null
        if (conversationalistProgression?.hasLeveledUp){
            levelUpData = {
                badgeType: 'CONVERSATIONALIST',
                level: `${conversationalistProgression.newLevel}`,
            };
        }
        if (levelUpData) {
            showBadgeModal(levelUpData.badgeType, levelUpData.level);
        }

        
        
        refetch();

    }   


    const handleSetDayInteraction =  async (type) => {
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
            description = `upvoted your SetDay${ setDay?.caption ? ` "${setDay.caption.slice(0,30)}..." `: ''}`
            
        } else if (type === 'downvotes'){
            description = `downvoted your SetDay${ setDay?.caption ? ` "${setDay.caption.slice(0,30)}..." `: ''}`
           
        }else  if ( type === 'reposts' ){
            description = `reposted your SetDay${ setDay?.caption ? ` "${setDay.caption.slice(0,30)}..." `: ''}`
           
        }
        const data = {
            type,
            setDayId : setDay.id,
            userId : ownerUser.id,
            description,
            recipientId : setDay.user.id
        }
         const interacted = await setDayInteraction(data)
        const conversationalistProgression =  await checkConversationalistBadge(Number(ownerUser?.id))

        let levelUpData = null
        if (conversationalistProgression?.hasLeveledUp){
            levelUpData = {
                badgeType: 'CONVERSATIONALIST',
                level: `${conversationalistProgression.newLevel}`,
            };
        }
        if (levelUpData) {
            showBadgeModal(levelUpData.badgeType, levelUpData.level);
        }

        // await refetchUserFull();
    }


    const handleCommentInteraction =  async (type, comment, isAlready, parentId) => {

        let description

        
        if ( type === 'upvotes' ){
            description = `upvoted your comment "${comment.content}"`
            if (isAlready){
             
                setInteractedComments(prev => {
                    const updatedUpvotes = prev.upvotes.filter(i => i.commentId !== comment.id);
                    return {
                        ...prev,
                        upvotes: updatedUpvotes
                    };
                });
                if (parentId) {
                    setCommentsData(prev => {
                        const updatedComments = prev.map(c => {
                            
                            if (c.id === parentId) {
                                
                                const updatedReplies = c.replies.map(reply => {
                                    
                                    if (reply.id === comment.id) {
                                        return { ...reply, upvotes: reply.upvotes - 1 };  
                                    }
                                    return reply;  
                                });
                
                                
                                return { ...c, replies: updatedReplies };
                            }
                
                            return c; 
                        });
                
                        return updatedComments;
                    }); 
                } else {
                    setCommentsData(prev => {
                        const updatedComments = prev.map(i => 
                            i.id === comment.id 
                                ? { ...i, upvotes: i.upvotes - 1 }  
                                : i  
                        );
                        return updatedComments;
                    });
                }

                
            } else {
                comment.interactionType = 'UPVOTE'
                comment.commentId = comment.id
                setInteractedComments(prev => ({
                    ...prev,
                    upvotes : [ ...prev.upvotes, comment ]
                }))

                if (parentId) {
                    setCommentsData(prev => {
                        const updatedComments = prev.map(c => {
                            
                            if (c.id === parentId) {
                                
                                const updatedReplies = c.replies.map(reply => {
                                    
                                    if (reply.id === comment.id) {
                                        return { ...reply, upvotes: reply.upvotes + 1 };  
                                    }
                                    return reply;  
                                });
                
                                
                                return { ...c, replies: updatedReplies };
                            }
                
                            return c; 
                        });
                
                        return updatedComments;
                    }); 
                } else {
                    setCommentsData(prev => {
                        const updatedComments = prev.map(i => 
                            i.id === comment.id 
                                ? { ...i, upvotes: i.upvotes + 1 }  
                                : i  
                        );
                        return updatedComments;
                    });
                }

              
            }
            
        } else if (type === 'downvotes'){
            description = `downvoted your comment "${comment.content}"`
            if (isAlready){
                setInteractedComments(prev => ({
                    ...prev,
                    downvotes : prev.downvotes.filter( i => i.commentId !== comment.id )
                }))
                if (parentId) {
                    setCommentsData(prev => {
                        const updatedComments = prev.map(c => {
                            
                            if (c.id === parentId) {
                                
                                const updatedReplies = c.replies.map(reply => {
                                    
                                    if (reply.id === comment.id) {
                                        return { ...reply, downvotes: reply.downvotes - 1 };  
                                    }
                                    return reply;  
                                });
                
                                
                                return { ...c, replies: updatedReplies };
                            }
                
                            return c; 
                        });
                
                        return updatedComments;
                    }); 
                } else {
                    setCommentsData(prev => {
                        const updatedComments = prev.map(i => 
                            i.id === comment.id 
                                ? { ...i, downvotes: i.downvotes - 1 }  
                                : i  
                        );
                        return updatedComments;
                    });
                }
            } else {
                comment.interactionType = 'DOWNVOTE'
                comment.commentId = comment.id
                setInteractedComments(prev => ({
                    ...prev,
                    downvotes : [ ...prev.downvotes, comment ]
                }))
                if (parentId) {
                    setCommentsData(prev => {
                        const updatedComments = prev.map(c => {
                            
                            if (c.id === parentId) {
                                
                                const updatedReplies = c.replies.map(reply => {
                                    
                                    if (reply.id === comment.id) {
                                        return { ...reply, downvotes: reply.downvotes + 1 };  
                                    }
                                    return reply;  
                                });
                
                                
                                return { ...c, replies: updatedReplies };
                            }
                
                            return c; 
                        });
                
                        return updatedComments;
                    }); 
                } else {
                    setCommentsData(prev => {
                        const updatedComments = prev.map(i => 
                            i.id === comment.id 
                                ? { ...i, downvotes: i.downvotes + 1 }  
                                : i  
                        );
                        return updatedComments;
                    });
                }
            }
        }
        const data = {
            type,
            commentId : comment.id,
            userId : ownerUser?.id,
            description,
            recipientId : comment.user.id
        }
        const updatedComment = await commentInteraction(data)
        
        
    }

    const handleUserPress = (item) => {
        router.push(`/user/${item.user.id}`)
    }


    const handleComment = (setDay) => {
        // refetchOwner()
        if (fromHome){

            router.push({
                pathname:`(home)/commentsModal`,
                params : { setDayId : setDay.id }
            })
        } else {
            router.push({
                pathname:`/commentsModal`,
                params : { setDayId : setDay.id }
            })

        }
    }


    if (!setDay || !ownerUser){
        return <ActivityIndicator />
    }
  return (
    <SafeAreaView style={{backgroundColor:isBackground ? Colors.mainGrayDark : Colors.primary, borderRadius:isBackground ? 15 : 0, flex:1}} className='relative' edges={['top', 'bottom']}>

        <View  className={` ${isBackground && 'px-4 pt-4  '} w-full   relative  `} 
           
        >
        <View className={`${isBackground ? 'px-0' : 'px-6'}w-full flex pb-[0px] justify-center items-center  `}>
        <View className='justify-center items-center gap-3  pb-6 w-full'>
            <View className='flex flex-row justify-between items-center w-full'>
                <TouchableOpacity className='self-start' onPress={()=>router.push(`/user/${setDay.user.id}`)} style={{ flexDirection:'row', gap:5, justifyContent:'center', alignItems:'center' }}>
                    <Image
                        source={{ uri: setDay.user?.profilePic || avatarFallbackCustom }}
                        contentFit='cover'
                        style={{ borderRadius:'50%', overflow:'hidden', width:30, height:30 }}
                    />
                    <Text className='text-mainGrayDark   ' >@{setDay.user.username}</Text>
                </TouchableOpacity>
                <View style={{ position: "absolute", left: "50%", transform: [{ translateX: -10 }] }}>
                    <ClapperboardIcon color={Colors.mainGrayDark2} size={20} />
                </View>                
                <Text className='text-mainGrayDark '>{formatDateNotif(setDay.createdAt)}</Text>

            </View>
            <Image 
                source={setDay.image}
                height={400}
                width={370}
                style={{borderRadius: isBackground ? 0 : 15}}
            />
            
            {setDay.production && (
                <Text className='font-semibold  text-sm self-start text-mainGrayDark'>Production: "{setDay.production}"</Text>
                
            )}
            {setDay.caption && (
                <Text className='text-mainGrayLight font-pcourier px-2'>{setDay.caption}</Text>

            )}
            <View className='flex flex-row gap-6  justify-start items-center w-full pt-4'>
                <TouchableOpacity onPress={()=> handleSetDayInteraction('upvotes') } >
                    <View className='flex-row gap-1 justify-center items-center'>
                        <ThumbsUp size={20} color={ interactions.upvotes.alreadyPressed ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                        <Text className='text-xs font-pbold ' style={{ color: interactions.upvotes.alreadyPressed ? Colors.secondary : Colors.mainGray }}>{ interactions.upvotes.count }</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity  onPress={()=> handleSetDayInteraction('downvotes') } >
                        <View className='flex-row gap-1 justify-center items-center'>
                            <ThumbsDown size={20}  color={ interactions.downvotes.alreadyPressed ? Colors.secondary :  Colors.mainGray}></ThumbsDown>
                            <Text  className='text-xs font-pbold text-mainGray' style={{ color: interactions.downvotes.alreadyPressed ? Colors.secondary : Colors.mainGray }}>{ interactions.downvotes.count }</Text>
                        </View>
                </TouchableOpacity>
             
              
                <TouchableOpacity disabled={!fromHome} onPress={()=>handleComment(setDay)} className='flex-row gap-1  justify-center items-center   ' style={{height:32, borderColor:Colors.mainGray}}  >

                            <MessageIcon   className='' size={20}  color={   Colors.mainGray}/>
                            <Text className='text-xs font-pbold text-gray-400  '> {setDay?.comment?.length}</Text>
                </TouchableOpacity >
                <TouchableOpacity onPress={()=> handleSetDayInteraction('reposts') } >
                    <View className='flex-row gap-1 justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                        <RepostIcon className='' size={20}  color={ interactions.reposts.alreadyPressed ? Colors.secondary :  Colors.mainGray}/>
                        <Text className='text-xs font-pbold text-gray-400  'style={{ color: interactions.reposts.alreadyPressed ? Colors.secondary : Colors.mainGray }}> {interactions.reposts.count}</Text>
                    </View>

                </TouchableOpacity>
                
            </View>
        </View>
        </View>
    </View>








        
    </SafeAreaView>
  )
}

export default SetDayCard


const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: Colors.primary,
    },
    inputContainer: {
      width: '100%',
      paddingHorizontal: 15,
      backgroundColor: '#111',
      position: 'absolute',
      bottom:50,
      height:150,
      left: 0,
      right: 0,
      paddingBottom: 50,
      paddingTop: 10,
      borderTopWidth: 0,
      borderColor: '#333',
    },
    textInput: {
      backgroundColor: '#222',
      color: 'white',
      fontFamily: 'courier',
      borderRadius: 20,
      paddingVertical: 20,
      paddingLeft: 20,
      paddingRight:80,
      minHeight: 40,
      maxHeight: 150,
      textAlignVertical: 'center',
    },
    sendButton: {
      position: 'absolute',
      bottom: 12,
      right: 10,
      backgroundColor: Colors.secondary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 15,
    },
  });
  