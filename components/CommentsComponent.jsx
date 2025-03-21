import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, {useState, useRef} from 'react'
import { Colors } from '../constants/Colors'
import { formatDateNotif } from '../lib/formatDate'
import { Image } from 'expo-image'
import { ThumbsDown, ThumbsUp} from 'lucide-react-native'

const CommentsComponent = ({ commentsData, interactedComments, setInteractedComments, inputRef,input, setInput, replyingTo, setReplyingTo }) => {


    // const handleReply= (item, parentId) => {
    //     inputRef.current?.focus();  // Focus the input
    //     setReplying(true);
    //     setInput(`@${item.user.username} `)
        
    //     const replyingToData = {
    //         user : item.user,
    //         threadId : Number(thread.id),
    //         content : item.content,
    //         parentId
    //     }
    //     setReplyingTo(replyingToData)
    // }






    const handleCommentInteraction =  async (type, comment, isAlready) => {
        console.log('PARAMS', type,comment.id, isAlready)

        let description

        
        console.log('interacted comments BEFORE', interactedComments)
        if ( type === 'upvotes' ){
            description = `upvoted your comment "${comment.content}"`
            if (isAlready){
                // setInteractedComments(prev => ({
                //     ...prev,
                //     upvotes : prev.upvotes.filter( i => i.commentId !== comment.id )
                // }))

                setInteractedComments(prev => {
                    const updatedUpvotes = prev.upvotes.filter(i => i.commentId !== comment.id);
                    console.log('Updated upvotes:', updatedUpvotes);
                    return {
                        ...prev,
                        upvotes: updatedUpvotes
                    };
                });
                setCommentsData(prev => {
                    const updatedComments = prev.map(i => 
                        i.id === comment.id 
                            ? { ...i, upvotes: i.upvotes - 1 }  // Update the upvotes of the matching comment
                            : i  // Leave other comments unchanged
                    );
                    console.log('Updated comments data:', updatedComments);
                    return updatedComments;
                });
                
                console.log("HELLO FROM 1") 
            } else {
                comment.interactionType = 'UPVOTE'
                comment.commentId = comment.id
                setInteractedComments(prev => ({
                    ...prev,
                    upvotes : [ ...prev.upvotes, comment ]
                }))

                setCommentsData(prev => {
                    const updatedComments = prev.map(i => 
                        i.id === comment.id 
                            ? { ...i, upvotes: i.upvotes + 1 }  // Update the upvotes of the matching comment
                            : i  // Leave other comments unchanged
                    );
                    console.log('Updated comments data:', updatedComments);
                    return updatedComments;
                });
            }
            
        } else if (type === 'downvotes'){
            description = `downvoted your comment "${comment.content}"`
            if (isAlready){
                setInteractedComments(prev => ({
                    ...prev,
                    downvotes : prev.downvotes.filter( i => i.commentId !== comment.id )
                }))
                setCommentsData(prev => {
                    const updatedComments = prev.map(i => 
                        i.id === comment.id 
                            ? { ...i, downvotes: i.downvotes - 1 }  // Update the upvotes of the matching comment
                            : i  // Leave other comments unchanged
                    );
                    console.log('Updated comments data:', updatedComments);
                    return updatedComments;
                });
            } else {
                comment.interactionType = 'DOWNVOTE'
                comment.commentId = comment.id
                setInteractedComments(prev => ({
                    ...prev,
                    downvotes : [ ...prev.downvotes, comment ]
                }))
                setCommentsData(prev => {
                    const updatedComments = prev.map(i => 
                        i.id === comment.id 
                            ? { ...i, downvotes: i.downvotes + 1 }  // Update the upvotes of the matching comment
                            : i  // Leave other comments unchanged
                    );
                    console.log('Updated comments data:', updatedComments);
                    return updatedComments;
                });
            }
        }

        console.log('made it this far')
        const data = {
            type,
            commentId : comment.id,
            userId : ownerUser.id,
            description,
            recipientId : comment.user.id
        }
        const updatedComment = await commentInteraction(data)
        console.log('updatedcomment', updatedComment)
        // refetch();
        // refetchOwnerUser()
        console.log('after interaction AFTER', interactedComments)
    }

  return (

                    <>
                    <FlatList
                    data={commentsData}
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
                                        <ThumbsUp  size='20' color={ alreadyUpvotedComment ? Colors.secondary : Colors.mainGray} />
                                            <Text className='text-xs font-pbold text-gray-400' style={{color:alreadyUpvotedComment ? Colors.secondary : Colors.mainGray}}>{item.upvotes}</Text>
                                    </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>handleCommentInteraction('downvotes',item, alreadyDownvotedComment)}  >
                                    <View className='flex-row  justify-center items-center  gap-1 ' style={{height:32, borderColor:Colors.mainGray}}>
                                        <ThumbsDown  size='20' color={ alreadyDownvotedComment ? Colors.secondary :  Colors.mainGray} />
                                            <Text className='text-xs font-pbold  text-gray-400' style={{ color : alreadyDownvotedComment ? Colors.secondary : Colors.mainGray }}>{item.downvotes}</Text>
                                    </View>
                                    </TouchableOpacity>
                                    


                                </View>
                            </View>
                        ) }
    
    
                        { item.replies.length > 0 && (
                            <>
                            { item.replies.slice(0, shownReplies).map((reply) => (
                               <View key={reply.id}  className=' ml-4 pr-5 justify-center items-center gap-3 my-3' style={{ borderLeftWidth:1, borderColor:Colors.secondary, borderBottomLeftRadius:10, paddingHorizontal:15, paddingBottom:10 }}>
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

                                    <TouchableOpacity onPress={()=>handleCommentInteraction('upvotes',reply, alreadyUpvotedComment)}  >
                                    <View className='flex-row  justify-center items-center  gap-1 ' style={{height:32, borderColor:Colors.mainGray}}>
                                        <ThumbsUp  size='20' color={ alreadyUpvotedComment ? Colors.secondary : Colors.mainGray} />
                                            <Text className='text-xs font-pbold text-gray-400' style={{color:alreadyUpvotedComment ? Colors.secondary : Colors.mainGray}}>{reply.upvotes}</Text>
                                    </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>handleCommentInteraction('downvotes',reply, alreadyDownvotedComment)}  >
                                    <View className='flex-row  justify-center items-center  gap-1 ' style={{height:32, borderColor:Colors.mainGray}}>
                                        <ThumbsDown  size='20' color={ alreadyDownvotedComment ? Colors.secondary :  Colors.mainGray} />
                                            <Text className='text-xs font-pbold  text-gray-400' style={{ color : alreadyDownvotedComment ? Colors.secondary : Colors.mainGray }}>{reply.downvotes}</Text>
                                    </View>
                                    </TouchableOpacity>
                                    


                                </View>
                            </View>
    
                            )) }
    
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

  )
}

export default CommentsComponent

const styles = StyleSheet.create({})