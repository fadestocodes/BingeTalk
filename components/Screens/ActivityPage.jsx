import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform , ActivityIndicator, RefreshControl} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/Colors'
import { router, useLocalSearchParams } from 'expo-router'
import { ArrowDownIcon, UpIcon, DownIcon, ArrowUpIcon, MessageIcon, HeartIcon, CloseIcon, RepostIcon, ThreeDotsIcon , BackIcon} from '../../assets/icons/icons'
import { formatDate } from '../../lib/formatDate'
import { GestureDetector, Gesture} from 'react-native-gesture-handler';
import { commentInteraction, createComment, fetchSingleComment, useFetchSingleComment } from '../../api/comments'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../api/user'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { fetchSingleDialogue, useFetchSingleDialogue } from '../../api/dialogue'
import { ThumbsDown, ThumbsUp } from 'lucide-react-native';
import ThreadCard from '../ThreadCard'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, useAnimatedKeyboard } from 'react-native-reanimated';
import DialogueCard from '../DialogueCard'
import { usePostRemoveContext } from '../../lib/PostToRemoveContext'
import { useFetchActivityId } from '../../api/activity'
import ActivityCard2 from '../ActivityCard2'
import { avatarFallback } from '../../lib/fallbackImages'
import { avatarFallbackCustom } from '../../constants/Images'



const ActivityPage = () => {

    const { replyCommentId } = useLocalSearchParams();
    const [ input, setInput ] = useState('')
    const inputRef = useRef(null); 
    const [ replyingTo, setReplyingTo ] = useState(null)
    const [ replying, setReplying ] = useState(false)
    const [ visibleReplies, setVisibleReplies  ] = useState({})
    const { user : clerkUser } = useUser();
    const { data: ownerUser, refetch:refetchOwnerUser } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })
   
    const userId = ownerUser?.id
    const { activityId, tvId, movieId, castId }= useLocalSearchParams();

    const { data:activity, interactedComments, commentsData, loading:isLoading, refetch, setInteractedComments, setCommentsData, removeItem} = useFetchActivityId(Number(activityId), Number(replyCommentId))
    const { postToRemove, updatePostToRemove } = usePostRemoveContext()



    const keyboard = useAnimatedKeyboard(); 
    const translateY = useSharedValue(0); 
    const atTop = useSharedValue(true); 
  
    const animatedStyle = useAnimatedStyle(() => ({
      bottom: withTiming(keyboard.height.value-20, { duration: 0 }),
    }));

    useEffect(()=>{
        removeItem( postToRemove.id, postToRemove.postType )
    },[postToRemove])
   





    const handleReply= (item, parentId) => {
        inputRef.current?.focus(); 
        setReplying(true);
        setInput(`@${item.user.username} `)
        
        const replyingToData = {
            user : item.user,
            activityId : Number(activity.id),
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

        const commentData = {
            userId : Number(userId),
            activityId : Number(activityId),
            content : input.trim(),
            parentId : replyingTo?.parentId || null,
            replyingToUserId : replyingTo?.user?.id || null,
            description: `commented on your activity "${input}"`,
            recipientId : replyingTo?.user?.id || activity?.user?.id,
            replyDescription : replyingTo ? `replied to your comment "${input}"` : null,
            parentActivityId : Number(activityId),
            activityIdCommentedOn : Number(activityId)
        }
    
        const newComment = await createComment( commentData );
        setInput('');
        setReplyingTo(null)
        setReplying(false)
        inputRef.current?.blur();
        refetch();

    }   


    const handleCommentInteraction =  async (type, comment, isAlready, parentId) => {

        let description
        const alreadyUpvotedComment = interactedComments.upvotes.some( i => i.commentId === comment.id )
        const alreadyDownvotedComment = interactedComments.downvotes.some( i => i.commentId === comment.id )

        
        if ( type === 'upvotes' ){
            description = `upvoted your comment "${comment.content}"`
            if (alreadyUpvotedComment){
             
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
            if (alreadyDownvotedComment){
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
            userId : ownerUser.id,
            description,
            recipientId : comment.user.id,
            activityId : Number(activityId)
        }
        const updatedComment = await commentInteraction(data)
    }

    const handleUserPress = (item) => {
        router.push(`/user/${item.user.id}`)
    }

    const handleThreeDots = (item, fromReply) => {

        const fromOwnPost = item.userId === ownerUser.id
        router.push({
            pathname:'/postOptions',
            params: { fromOwnPost : fromOwnPost ? 'true' : 'false', ownerId : ownerUser.id, postType : fromReply ? 'REPLY' : 'COMMENT', postId : item.id, postUserId : item.userId}
        })
    }





  return (
    <SafeAreaView className='h-full pb-32 relative' style={{backgroundColor:Colors.primary}} >
       
       { isLoading || !ownerUser || !activity ? (
            <View className='h-full justify-center items-center bg-primary'>
                <ActivityIndicator/>
            </View>
        ) : (
     
        <>
        <ScrollView className='bg-primary  relative ' 
            refreshControl={
                <RefreshControl
                    tintColor={Colors.secondary}
                    refreshing={isLoading}
                    onRefresh={refetch}
                />

            }
        >

        <View style={{gap:10, marginVertical:0, paddingTop:0, paddingHorizontal:20, paddingBottom:100}}  >
        <TouchableOpacity onPress={()=>router.back()} style={{paddingBottom:20}}>
              <BackIcon size={26} color={Colors.mainGray}/>
            </TouchableOpacity>
          <View className='gap-3' >
          <ActivityCard2 activity={activity} disableCommentsModal={true} />
          <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>

                { commentsData.length > 0 && (
                    <>
                    <FlatList
                    data={ commentsData}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    renderItem={({ item }) =>{
    
                        const shownReplies = visibleReplies[item.id] || 0;


                        const alreadyUpvotedComment = interactedComments.upvotes.some( i => i.commentId === item.id )
                        const alreadyDownvotedComment = interactedComments.downvotes.some( i => i.commentId === item.id )
                        

                        
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
                                const alreadyUpvotedReply = interactedComments.upvotes.some( i => i.commentId === reply.id )
                                const alreadyDownvotedReply = interactedComments.downvotes.some( i => i.commentId === reply.id )
                                return (


                                
                               <View key={reply.id}  className=' ml-10 pr-5 justify-center items-center gap-3 my-3' style={{ borderLeftWidth:1, borderColor:Colors.secondary, borderBottomLeftRadius:10, paddingHorizontal:15, paddingBottom:10 }}>
                            <View className='flex-row w-full justify-between items-center'>
                                    <TouchableOpacity onPress={()=>handleUserPress(reply)} className="flex-row  items-center gap-2 ">
                                        <Image
                                            source={{ uri: reply.user.profilePic || avatarFallbackCustom}}
                                            contentFit='cover'
                                            style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                                        />
                                        <Text className='text-mainGrayDark   ' >@{reply.user.username}</Text>
                                    </TouchableOpacity>
                                    <Text className='text-mainGrayDark '>{formatDate(reply.createdAt)}</Text>
                                </View>
                                <Text className='text-secondary text-lg uppercase font-pcourier'>{reply.user.firstName}</Text>
                                <Text className='text-white font-pcourier'>{reply.content}</Text>
                                
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

            </>
            )}


    </SafeAreaView>
  )
}

export default ActivityPage


ActivityPage.options = {
    headerShown: false,  // Optional: Hide header if not needed
  }


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
      bottom:100,
      height:200,
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
  