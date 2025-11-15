import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, RefreshControl, FlatList } from 'react-native'
import React, {useState, useRef, useEffect} from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { setDayInteraction, useGetSetDay } from '../../api/setDay'
import { Image } from 'expo-image'
import { ArrowLeft, ThumbsDown, ThumbsUp } from 'lucide-react-native'
import { BackIcon, MessageIcon, RepostIcon } from '../../assets/icons/icons'
import { Colors } from '../../constants/Colors'
import CommentsComponent from '../CommentsComponent'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, useAnimatedKeyboard } from 'react-native-reanimated';
import { useGetUser, useGetUserFull } from '../../api/auth'
import { commentInteraction, createComment } from '../../api/comments'
import { checkConversationalistBadge } from '../../api/badge'
import { formatDate } from '../../lib/formatDate'
import { ThreeDotsIcon } from '../../assets/icons/icons'


const SetDayIdPage = () => {
    const {setDayId} = useLocalSearchParams()
    const {data:setDay, loading, refetch, interactedComments, commentsData, loading:isLoading, setInteractedComments, setCommentsData} = useGetSetDay(setDayId)
    const {user:userSimple} = useGetUser()
    const {userFull:ownerUser, refetch:refetchUserFull} = useGetUserFull(userSimple?.id)
    const router = useRouter()
    const keyboard = useAnimatedKeyboard(); 
    const [ input, setInput ] = useState('')
    const inputRef = useRef(null);  
    const [ replyingTo, setReplyingTo ] = useState(null)
    const [ replying, setReplying ] = useState(false)
    const [ visibleReplies, setVisibleReplies  ] = useState({})
    console.log('cation', setDay)

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


        
        const alreadyUpvoted = setDay?.setDayInteractions?.some( item => item.interactionType === 'UPVOTE' && item.userId === ownerUser?.id )
        const alreadyDownvoted = setDay?.setDayInteractions?.some( item => item.interactionType === 'DOWNVOTE'  && item.userId === ownerUser?.id )
        const alreadyReposted = setDay?.setDayInteractions?.some( item => item.interactionType === 'REPOST'  && item.userId === ownerUser?.id )

        setInteractions({
            upvotes : {
                alreadyPressed : alreadyUpvoted,
                count : setDay?.upvotes
            } ,
            downvotes :{
                alreadyPressed : alreadyDownvoted,
                count : setDay?.downvotes
            } ,
            reposts : {
                alreadyPressed : alreadyReposted,
                count : setDay?.reposts
            } 
        })

       
    }, [setDay])
    
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
        console.log('trying to post comment...')
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

        console.log('postdata', commentData)
    
        const newComment = await createComment( commentData );
        console.log('new Comment res', newComment)
        setInput('');
        setReplyingTo(null)
        setReplying(false)
        inputRef.current?.blur();

        const conversationalistProgression =  await checkConversationalistBadge(Number(ownerUser?.id))

        let levelUpData = null
        if (conversationalistProgression?.hasLeveledUp){
            console.log('🎊 Congrats you leveled up the Conversationalist badge!')
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
        console.log('set day for interaction', setDay)
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
         console.log('intereacted...',interacted)
        const conversationalistProgression =  await checkConversationalistBadge(Number(ownerUser?.id))

        let levelUpData = null
        if (conversationalistProgression?.hasLeveledUp){
            console.log('🎊 Congrats you leveled up the Conversationalist badge!')
            levelUpData = {
                badgeType: 'CONVERSATIONALIST',
                level: `${conversationalistProgression.newLevel}`,
            };
        }
        if (levelUpData) {
            showBadgeModal(levelUpData.badgeType, levelUpData.level);
        }

        await refetchUserFull();
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


    if (!setDay || !ownerUser){
        return <ActivityIndicator />
    }
  return (
    <SafeAreaView className='h-full relative' edges={['top', 'bottom']}>

        <ScrollView className='bg-primary   relative  ' 
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={async ()=>{await refetchUserFull();await refetch()}}
                />

            }
        >
        <View className='px-6 w-full flex pb-[200px] justify-center items-center  '>
        <TouchableOpacity className=' pb-6' onPress={()=>router.back()} style={{justifyContent:'flex-start', alignSelf:'flex-start' }}>
            <BackIcon size={26} color={Colors.mainGray} />
        </TouchableOpacity>
        <View className='justify-center items-center gap-3  pb-10 w-full'>
            <Image 
                source={setDay.image}
                height={400}
                width={360}
                style={{borderRadius:15}}
            />
            
            {setDay.production && (
                <Text className='font-semibold  text-sm self-start text-mainGrayDark'>Production: "{setDay.production}"</Text>
                
            )}
            {setDay.caption && (
                <Text className='text-mainGrayLight font-pcourier px-2'>{setDay.caption}</Text>

            )}
            <View className='flex flex-row gap-6  justify-start items-start w-full pt-4'>
                <TouchableOpacity onPress={()=>handleSetDayInteraction('upvotes')}>
                    <ThumbsUp size={24} color={ interactions.upvotes.alreadyPressed ? Colors.secondary :  Colors.mainGray}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>handleSetDayInteraction('downvotes')}>
                    <ThumbsDown size={24} color={ interactions.downvotes.alreadyPressed ? Colors.secondary :  Colors.mainGray}/>
                </TouchableOpacity>
                <View >
                    <MessageIcon size={24} color={ Colors.mainGray}/>
                </View>
                <TouchableOpacity onPress={()=>handleSetDayInteraction('reposts')}>
                    <RepostIcon size={24} color={ interactions.reposts.alreadyPressed ? Colors.secondary :  Colors.mainGray}/>
                </TouchableOpacity>
            </View>
        </View>



        <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>

                { commentsData.length > 0 && (
                    <>
                    <FlatList
                    data={ commentsData}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={{ paddingBottom: 0 }}
                    renderItem={({ item }) =>{
                        console.log('userhere',item)
                        const shownReplies = visibleReplies[item.id] || 0;


                        const alreadyUpvotedComment = interactedComments?.upvotes?.some( i => i.commentId === item.id )
                        const alreadyDownvotedComment = interactedComments?.downvotes?.some( i => i.commentId === item.id )
                        

                        
                        return (
                        <View>
                         
    
                        { !item.parentId && (
    
                            <View className='w-full  justify-center items-center gap-3 my-3'>
                            <View className='flex-row w-full justify-between items-center'>
                                    <TouchableOpacity onPress={()=>handleUserPress(item)} className="flex-row items-center gap-2">
                                        <Image
                                            source={{ uri: item.user.profilePic  || avatarFallbackCustom}}
                                            contentFit='cover'
                                            style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                                        />
                                        <Text className='text-mainGrayDark' >@{item.user.username}</Text>
                                    </TouchableOpacity>
                                    <Text className='text-mainGrayDark '>{formatDate(item.createdAt)}</Text>
                                </View>
                                <Text className='text-secondary text-lg uppercase font-pcourier'>{item.user.firstName}</Text>
                                <Text className='text-white font-pcourier'>{item.content}</Text>
    
                                    <View className='flex-row justify-between w-full items-center'>
                                        <View  className='flex-row gap-5 items-center'>
                                    <TouchableOpacity onPress={()=>handleReply(item, item.id)}  style={{borderRadius:5, borderWidth:1, borderColor:Colors.mainGray, paddingVertical:3, paddingHorizontal:8}} >
                                        <Text className='text-mainGray text-sm'>Reply</Text>
                                    </TouchableOpacity>
    
                                    <TouchableOpacity onPress={()=>handleCommentInteraction('upvotes',item, alreadyUpvotedComment)}  >
                                    <View className='flex-row  justify-center items-center  gap-1 ' style={{height:32, borderColor:Colors.mainGray}}>
                                        <ThumbsUp  size={20} color={ alreadyUpvotedComment ? Colors.secondary : Colors.mainGray} />
                                            <Text className='text-xs font-pbold text-gray-400' style={{color:alreadyUpvotedComment ? Colors.secondary : Colors.mainGray}}>{item.upvotes}</Text>
                                    </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>handleCommentInteraction('downvotes',item, alreadyDownvotedComment)}  >
                                    <View className='flex-row  justify-center items-center  gap-1 ' style={{height:32, borderColor:Colors.mainGray}}>
                                        <ThumbsDown  size={20} color={ alreadyDownvotedComment ? Colors.secondary :  Colors.mainGray} />
                                            <Text className='text-xs font-pbold  text-gray-400' style={{ color : alreadyDownvotedComment ? Colors.secondary : Colors.mainGray }}>{item.downvotes}</Text>
                                    </View>
                                    </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={()=>handleThreeDots(item)}>
                                        <ThreeDotsIcon size={20} color={Colors.mainGray} />
                                    </TouchableOpacity>

                                    </View>
    
                                    
                                
                                
                            </View>
                        ) }

    
                        { item.replies.length > 0 && (
                            <>
                            { item.replies.slice(0, shownReplies).map((reply) => {
                                const alreadyUpvotedReply = interactedComments?.upvotes?.some( i => i.commentId === reply.id )
                                const alreadyDownvotedReply = interactedComments?.downvotes?.some( i => i.commentId === reply.id )
                                return (


                                
                               <View key={reply.id}  className=' ml-10 pr-5 justify-center items-center gap-3 my-3' style={{ borderLeftWidth:1, borderColor:Colors.secondary, borderBottomLeftRadius:10, paddingHorizontal:15, paddingBottom:10 }}>
                            <View className='flex-row w-full justify-between items-center'>
                                    <TouchableOpacity onPress={()=>handleUserPress(reply)} className="flex-row  items-center gap-2 ">
                                        <Image
                                            source={{ uri: reply.user.profilePic || avatarFallbackCustom }}
                                            contentFit='cover'
                                            style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                                        />
                                        <Text className='text-mainGrayDark   ' >@{reply.user.username}</Text>
                                    </TouchableOpacity>
                                    <Text className='text-mainGrayDark '>{formatDate(reply.createdAt)}</Text>
                                </View>
                                <Text className='text-secondary text-lg uppercase font-pcourier'>{reply.user.firstName}</Text>
                                <Text className='text-white  font-pcourier'>{reply.content}</Text>
                                
                                <View className='w-full justify-between flex-row'>

                                <View className='flex-row gap-5 w-full justify-start items-center'>
                                    
                                    <TouchableOpacity onPress={()=>handleReply(reply, item.id)}  style={{borderRadius:5, borderWidth:1, borderColor:Colors.mainGray, paddingVertical:3, paddingHorizontal:8}} >
                                        <Text className='text-mainGray text-sm'>Reply</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={()=>{console.log('REPLY OBJECT', item);handleCommentInteraction('upvotes',reply, alreadyUpvotedReply,item.id )}}  >
                                    <View className='flex-row  justify-center items-center  gap-1 ' style={{height:32, borderColor:Colors.mainGray}}>
                                        <ThumbsUp  size={20} color={ alreadyUpvotedReply ? Colors.secondary : Colors.mainGray} />
                                            <Text className='text-xs font-pbold text-gray-400' style={{color:alreadyUpvotedReply ? Colors.secondary : Colors.mainGray}}>{reply.upvotes}</Text>
                                    </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>handleCommentInteraction('downvotes',reply, alreadyDownvotedReply,item.id )}  >
                                    <View className='flex-row  justify-center items-center  gap-1 ' style={{height:32, borderColor:Colors.mainGray}}>
                                        <ThumbsDown  size={20} color={ alreadyDownvotedReply ? Colors.secondary :  Colors.mainGray} />
                                            <Text className='text-xs font-pbold  text-gray-400' style={{ color : alreadyDownvotedReply ? Colors.secondary : Colors.mainGray }}>{reply.downvotes}</Text>
                                    </View>
                                    </TouchableOpacity>
                                    


                                </View>
                                <TouchableOpacity onPress={()=> handleThreeDots(reply, 'fromReply')}>
                                    <ThreeDotsIcon size={20} color={Colors.mainGray} />
                                </TouchableOpacity>
                                </View>
                            </View>
    
                            )}) }
    
                            { shownReplies < item.replies.length && (
                                <View className='px-10'>
                                    <TouchableOpacity onPress={()=> handleViewReplies(item.id, item.replies.length)} >
                                        <Text className='text-mainGray text-sm font-pbold'>View { item.replies.length - shownReplies } {item.replies.length === 1 ? 'reply' : item.replies.length - shownReplies ? 'reply' :  'replies'}</Text>
                                    </TouchableOpacity>
    
                                </View>
                            ) }
                            </>
                        
                        
                        ) }
                        </View>
    
                    )}}
                    
                    />
                    </>

                ) }
                </View>
        </ScrollView>








        <Animated.View style={[styles.inputContainer, animatedStyle]}>
              <View className="relative gap-3">
              { replying && (
                <View className='px-5'style={{ borderRadius:15, paddingHorizontal:5, paddingVertical:10, backgroundColor:Colors.primary , position:'relative'}} >
                    <Text style={{paddingRight:20}} numberOfLines={2} className='text-mainGrayDark'>Replying to {replyingTo.user.firstName}: {replyingTo.content}</Text>
                    <TouchableOpacity onPress={handleReplyClose} style={{ position: 'absolute', right:15, top:8 }} >
                        <CloseIcon color={Colors.mainGray} size={20} ></CloseIcon>
                    </TouchableOpacity>
                </View>

                ) }
                <TextInput
                  multiline
                  ref={inputRef}
                  placeholder="Add a comment..."
                  placeholderTextColor="#888"
                  scrollEnabled={true}
                  value={input}
                  onChangeText={setInput}
                  style={styles.textInput}
                />
                {input && (
                  <TouchableOpacity
                    disabled={!input}
                    style={styles.sendButton}
                    onPress={()=>handlePostComment({parentId : null} )}
                  >
                    <Text style={{ color: Colors.primary }}>↑</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
    </SafeAreaView>
  )
}

export default SetDayIdPage


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
  