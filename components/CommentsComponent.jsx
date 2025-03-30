import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl, TextInput } from 'react-native'
import React, {useState, useRef} from 'react'
import { Colors } from '../constants/Colors'
import { formatDateNotif } from '../lib/formatDate'
import { Image } from 'expo-image'
import { CloseIcon } from '../assets/icons/icons'
import { ThumbsDown, ThumbsUp} from 'lucide-react-native'
import { useFetchOwnerUser } from '../api/user'
import { useCustomFetchSingleDialogue } from '../api/dialogue'
import { useCustomFetchSingleThread } from '../api/thread'
import { useCustomFetchSingleList } from '../api/list'
import { useUser } from '@clerk/clerk-expo'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, useAnimatedKeyboard } from 'react-native-reanimated';
import { createComment, commentInteraction } from '../api/comments'

const CommentsComponent = ({ postType, dialogueId, threadId, listId}) => {



    let dialogue, thread, list, interactedComments, commentsData, isLoading, refetch, setInteractedComments, setCommentsData;

    if (postType === 'dialogue') {
        // Destructure the values from useCustomFetchSingleDialogue hook
        ({ dialogue, interactedComments, commentsData, isLoading, refetch, setInteractedComments, setCommentsData } = useCustomFetchSingleDialogue(Number(dialogueId)));
    } else if (postType === 'thread') {
        // Destructure the values from useCustomFetchSingleThread hook
        ({ thread, interactedComments, commentsData, isLoading, refetch, setInteractedComments, setCommentsData } = useCustomFetchSingleThread(Number(threadId)));
    } else if (postType === 'list'){
        ({ list, interactedComments, commentsData, isLoading, refetch, setInteractedComments, setCommentsData } = useCustomFetchSingleList(Number(listId)));
    }
    const [ input, setInput ] = useState('')
    const inputRef = useRef(null);  // Create a ref for the input
    const [ replyingTo, setReplyingTo ] = useState(null)
    const [ replying, setReplying ] = useState(false)
    const [ visibleReplies, setVisibleReplies  ] = useState({})
    const { user : clerkUser } = useUser();
    const { data: ownerUser, refetch:refetchOwnerUser } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })


   
    const userId = ownerUser.id




    const keyboard = useAnimatedKeyboard(); // Auto tracks keyboard height
    const translateY = useSharedValue(0); // Tracks modal position
    const atTop = useSharedValue(true); // Track if at top of FlatList
  
    // Move input with keyboard automatically
    const animatedStyle = useAnimatedStyle(() => ({
      bottom: withTiming(keyboard.height.value-20, { duration: 0 }),
    }));


    if (!dialogue && !thread && !list ){ 
        return <ActivityIndicator/>
    }



    const handleReply= (item, parentId) => {
        inputRef.current?.focus();  // Focus the input
        setReplying(true);
        setInput(`@${item.user.username} `)
        
        const replyingToData = {
            user : item.user,
            dialogueId : dialogue ? Number(dialogue.id) : null,
            threadId : thread ? Number(thread.id) : null,
            listId : list ? Number(list.id) : null,
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
            dialogueId : Number(dialogueId) || null,
            threadID : Number(threadId) || null,
            listId : Number(listId) || null,
            content : input,
            parentId : replyingTo?.parentId || null,
            replyingToUserId : replyingTo?.user?.id || null,
            description: dialogue ? `commented on your dialogue "${input}"` : thread ?  `commented on your thread "${input}"` : list && `commented on your list "${input}"` ,
            recipientId : dialogue ?  dialogue.user.id : thread ? thread.user.id : list && list.user.id,
            replyDescription : replyingTo ? `replied to your comment "${input}"` : null,
        }
    
        const newComment = await createComment( commentData );
        setInput('');
        setReplyingTo(null)
        setReplying(false)
        inputRef.current?.blur();
        // await refetch();
        // await getThread()
        refetch();

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
                            // Check if the comment is the one we're interested in (with the parentId)
                            if (c.id === parentId) {
                                // Update the specific reply's upvotes or downvotes
                                const updatedReplies = c.replies.map(reply => {
                                    // Check if the reply id matches the comment we want to update
                                    if (reply.id === comment.id) {
                                        return { ...reply, upvotes: reply.upvotes - 1 };  // Example: Decrement the upvotes
                                    }
                                    return reply;  // Keep other replies the same
                                });
                
                                // Return the updated comment with updated replies
                                return { ...c, replies: updatedReplies };
                            }
                
                            return c; // Return the comment unchanged if it's not the one we want
                        });
                
                        return updatedComments;
                    }); 
                } else {
                    setCommentsData(prev => {
                        const updatedComments = prev.map(i => 
                            i.id === comment.id 
                                ? { ...i, upvotes: i.upvotes - 1 }  // Update the upvotes of the matching comment
                                : i  // Leave other comments unchanged
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
                            // Check if the comment is the one we're interested in (with the parentId)
                            if (c.id === parentId) {
                                // Update the specific reply's upvotes or downvotes
                                const updatedReplies = c.replies.map(reply => {
                                    // Check if the reply id matches the comment we want to update
                                    if (reply.id === comment.id) {
                                        return { ...reply, upvotes: reply.upvotes + 1 };  // Example: Decrement the upvotes
                                    }
                                    return reply;  // Keep other replies the same
                                });
                
                                // Return the updated comment with updated replies
                                return { ...c, replies: updatedReplies };
                            }
                
                            return c; // Return the comment unchanged if it's not the one we want
                        });
                
                        return updatedComments;
                    }); 
                } else {
                    setCommentsData(prev => {
                        const updatedComments = prev.map(i => 
                            i.id === comment.id 
                                ? { ...i, upvotes: i.upvotes + 1 }  // Update the upvotes of the matching comment
                                : i  // Leave other comments unchanged
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
                            // Check if the comment is the one we're interested in (with the parentId)
                            if (c.id === parentId) {
                                // Update the specific reply's upvotes or downvotes
                                const updatedReplies = c.replies.map(reply => {
                                    // Check if the reply id matches the comment we want to update
                                    if (reply.id === comment.id) {
                                        return { ...reply, downvotes: reply.downvotes - 1 };  // Example: Decrement the upvotes
                                    }
                                    return reply;  // Keep other replies the same
                                });
                
                                // Return the updated comment with updated replies
                                return { ...c, replies: updatedReplies };
                            }
                
                            return c; // Return the comment unchanged if it's not the one we want
                        });
                
                        return updatedComments;
                    }); 
                } else {
                    setCommentsData(prev => {
                        const updatedComments = prev.map(i => 
                            i.id === comment.id 
                                ? { ...i, downvotes: i.downvotes - 1 }  // Update the upvotes of the matching comment
                                : i  // Leave other comments unchanged
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
                            // Check if the comment is the one we're interested in (with the parentId)
                            if (c.id === parentId) {
                                // Update the specific reply's upvotes or downvotes
                                const updatedReplies = c.replies.map(reply => {
                                    // Check if the reply id matches the comment we want to update
                                    if (reply.id === comment.id) {
                                        return { ...reply, downvotes: reply.downvotes + 1 };  // Example: Decrement the upvotes
                                    }
                                    return reply;  // Keep other replies the same
                                });
                
                                // Return the updated comment with updated replies
                                return { ...c, replies: updatedReplies };
                            }
                
                            return c; // Return the comment unchanged if it's not the one we want
                        });
                
                        return updatedComments;
                    }); 
                } else {
                    setCommentsData(prev => {
                        const updatedComments = prev.map(i => 
                            i.id === comment.id 
                                ? { ...i, downvotes: i.downvotes + 1 }  // Update the upvotes of the matching comment
                                : i  // Leave other comments unchanged
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
            recipientId : comment.user.id
        }
        const updatedComment = await commentInteraction(data)
        // refetch();
        // refetchOwnerUser()
    }




  return (
    <SafeAreaView className='h-full pb-32 relative' style={{backgroundColor:Colors.primary, borderRadius:30}} >

     
        <>
        <View style={{ width:55, height:7, borderRadius:10,  backgroundColor:Colors.mainGray, position:'sticky', alignSelf:'center',  marginVertical:30}} />

        <ScrollView className='bg-primary pt-0  relative '  style={{borderRadius:30}}
            refreshControl={
                <RefreshControl
                tintColor={Colors.secondary}
                refreshing={isLoading}
                onRefresh={refetch}
                />
            }
         
        >

        <View style={{gap:10, marginVertical:0, paddingTop:0, paddingHorizontal:20, paddingBottom:100}}  >
          <View className='gap-3' >

          <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>

                { commentsData.length > 0 ? (
                    <>
                    <FlatList
                    refreshControl={
                        <RefreshControl
                            tintColor={Colors.secondary}
                            refreshing={isLoading}
                            onRefresh={refetch}
                        />
        
                    }
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
                                    <View className="flex-row items-center gap-2">
                                        <Image
                                            source={{ uri: item.user.profilePic }}
                                            contentFit='cover'
                                            style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                                        />
                                        <Text className='text-mainGrayDark' >@{item.user.username}</Text>
                                    </View>
                                    <Text className='text-mainGrayDark '>{formatDateNotif(item.createdAt)}</Text>
                                </View>
                                <Text className='text-secondary text-lg uppercase font-pcourier'>{item.user.firstName}</Text>
                                <Text className='text-white text-custom font-pcourier'>{item.content}</Text>
    
                                <View className='flex-row gap-5 w-full justify-start items-center'>
    
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
                                    <View className="flex-row items-center gap-2 pl-10">
                                        <Image
                                            source={{ uri: reply.user.profilePic }}
                                            contentFit='cover'
                                            style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                                        />
                                        <Text className='text-mainGrayDark   ' >@{reply.user.username}</Text>
                                    </View>
                                    <Text className='text-mainGrayDark '>{formatDateNotif(reply.createdAt)}</Text>
                                </View>
                                <Text className='text-secondary text-lg uppercase font-pcourier'>{reply.user.firstName}</Text>
                                <Text className='text-white text-custom font-pcourier'>{reply.content}</Text>
    
                                <View className='flex-row gap-5 w-full justify-start items-center'>
                                    
                                    <TouchableOpacity onPress={()=>handleReply(reply, item.id)}  style={{borderRadius:5, borderWidth:1, borderColor:Colors.mainGray, paddingVertical:3, paddingHorizontal:8}} >
                                        <Text className='text-mainGray text-sm'>Reply</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={()=>{handleCommentInteraction('upvotes',reply, alreadyUpvotedReply,item.id )}}  >
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

                ) : (
                    <>
                    <Text className='text-mainGray text-2xl font-pbold text-center py-4'>No comments</Text>
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


    </SafeAreaView>
  )
}

export default CommentsComponent


CommentsComponent.options = {
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
      paddingHorizontal: 20,
      minHeight: 40,
      maxHeight: 150,
      textAlignVertical: 'center',
    },
    sendButton: {
      position: 'absolute',
      bottom: 12,
      right: 20,
      backgroundColor: Colors.secondary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 15,
    },
  });
  