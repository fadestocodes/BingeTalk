import { SafeAreaView, StyleSheet, Text, View, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator, ScrollView , TextInput} from 'react-native'
import { Image } from 'expo-image'
import React, {useState, useRef} from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCustomFetchSingleList, useFetchSpecificList } from '../../api/list'
import { Colors } from '../../constants/Colors'
import { formatDate, getYear } from '../../lib/formatDate'
import { BackIcon, ThreeDotsIcon, CloseIcon, MessageIcon } from '../../assets/icons/icons'
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react-native'
import { RepostIcon } from '../../assets/icons/icons'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../api/user'
import { usePostRemoveContext } from '../../lib/PostToRemoveContext'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, useAnimatedKeyboard } from 'react-native-reanimated';
import { commentInteraction } from '../../api/comments'
import { createComment } from '../../api/comments'
import { listInteraction } from '../../api/list'


const ListIdScreen = () => {

    const { listId } = useLocalSearchParams();
    const { list, refetch,isLoading, commentsData, setCommentsData, interactedComments, setInteractedComments, already, setAlready, interactionCounts, setInteractionCounts} = useCustomFetchSingleList(listId);
    const { user:clerkUser } = useUser()
    const { data:ownerUser } = useFetchOwnerUser({email : clerkUser.emailAddresses[0].emailAddress})



    const { replyCommentId } = useLocalSearchParams();
    const [ input, setInput ] = useState('')
    const inputRef = useRef(null);  // Create a ref for the input
    const [ replyingTo, setReplyingTo ] = useState(null)
    const [ replying, setReplying ] = useState(false)
    const [ visibleReplies, setVisibleReplies  ] = useState({})
    const { postToRemove, updatePostToRemove } = usePostRemoveContext()

    
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const router = useRouter()



    const keyboard = useAnimatedKeyboard(); // Auto tracks keyboard height
    const translateY = useSharedValue(0); // Tracks modal position
    const atTop = useSharedValue(true); // Track if at top of FlatList
  
    // Move input with keyboard automatically
    const animatedStyle = useAnimatedStyle(() => ({
      bottom: withTiming(keyboard.height.value-20, { duration: 0 }),
    }));

    // useEffect(()=>{
    //     console.log('triggeredf from useeffect')
    //     removeItem( postToRemove.id, postToRemove.postType )
    //     // refetch()
    // },[postToRemove])
   






    if (!list || !ownerUser){
        return (
            <View className='h-full bg-primary justify-center items-center'>
        <ActivityIndicator tintColor={Colors.secondary} />
        </View>
    )
    }


    const handleInteraction =  async (type, item) => {
        console.log(item)
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
        console.log('data', data)
        const updatedList = await listInteraction(data)
        console.log('updatedlist', updatedList)
        refetch();
    }

    

    const handlePress = (item) => {
        
        if ( item.movie ){
            router.push(`/movie/${item.movie.tmdbId}`)
        } else if (item.tv) {
            router.push(`/tv/${item.tv.tmdbId}`)
        } else {
            router.push(`/cast/${item.castCrew.tmdbId}`)
        }
    }



    const handleReply= (item, parentId) => {
        inputRef.current?.focus();  // Focus the input
        setReplying(true);
        setInput(`@${item.user.username} `)
        
        const replyingToData = {
            user : item.user,
            listId : Number(list.id),
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
        console.log('hello')

        const commentData = {
            userId : Number(ownerUser.id),
            listId : Number(list.id),
            content : input,
            parentId : replyingTo?.parentId || null,
            replyingToUserId : replyingTo?.user?.id || null,
            description: `commented on your list "${input}"`,
            recipientId : list.user.id,
            replyDescription : replyingTo ? `replied to your comment "${input}"` : null,
        }
    
        console.log('commentData,', commentData)
        const newComment = await createComment( commentData );
        console.log('newcomment', newComment)
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
    <SafeAreaView style={{ backgroundColor : Colors.primary, width:'100%', height : '100%'}} >
         <ScrollView
         showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl 
                onRefresh={refetch}
                refreshing={isLoading}
                tintColor={Colors.secondary}
            />}
         >
            <View className='w-full h-full  px-4 gap-3' style={{paddingBottom:120}}>

            <TouchableOpacity onPress={()=>router.back()}>
              <BackIcon size={22} color={Colors.mainGray}/>
            </TouchableOpacity>
            <View className='w-full flex-row justify-between items-center'>
        <TouchableOpacity onPress={()=>router.push(`user/${list.user.id}`)} className='flex-row justify-start items-center gap-3 '>
        <Image
            source={{ uri: list.user.profilePic }}
            contentFit='cover'
            style={{ borderRadius:'50%', overflow:'hidden', width:30, height:30 }}
        />
        <Text className='text-mainGray'>Curated by @{list.user.username}</Text>


        </TouchableOpacity>
        <Text className='text-mainGray'>{formatDate(list.user.createdAt)}</Text>
      </View>
      <View className="gap-3 px-3">
          <View className='flex-row gap-2 justify-start items-center'>

            {/* <TVIcon size={30} color='white' /> */}
            <Text className='text-white font-pbold text-3xl'>{list.title}</Text>
          </View>
          { list.caption && (
              <Text className='text-mainGray text-lg font-psemibold'>{list.caption}</Text>
          ) }
      </View>
      
        <View className='flex-row justify-between items-center' style={{marginTop:10}}>

      <View className='flex-row gap-8 justify-start items-center' >
                            <TouchableOpacity onPress={()=>handleInteraction('upvotes', list)} className='flex-row gap-2 justify-center items-center'>
                                <ThumbsUp size={24} color={ already.upvoted ? Colors.secondary : Colors.mainGray} />
                                <Text className='text-gray-400 text-lg font-pblack' style={{color: already.upvoted ? Colors.secondary : Colors.mainGray}}>{list.upvotes}</Text>
                            </TouchableOpacity >
                            <TouchableOpacity onPress={()=>handleInteraction('downvotes', list)} className='flex-row gap-2 justify-center items-center'>
                                <ThumbsDown size={24} color={ already.downvoted ? Colors.secondary : Colors.mainGray} />
                                <Text className='text-gray-400 text-lg font-pblack' style={{color: already.downvoted ? Colors.secondary : Colors.mainGray}}>{list.downvotes}</Text>
                            </TouchableOpacity >
                            <View  className='flex-row gap-2 justify-center items-center'>
                                <MessageIcon size={24} color={Colors.mainGray} />
                                <Text className='text-gray-400 text-lg font-pblack' >{list.comments.length}</Text>
                            </View >
                            <TouchableOpacity onPress={()=>handleInteraction('reposts', list)} className='flex-row gap-2 justify-center items-center'>
                                <RepostIcon size={24} color={ already.reposted ? Colors.secondary : Colors.mainGray} />
                                <Text className='text-gray-400 text-lg font-pblack' style={{color: already.reposted ? Colors.secondary : Colors.mainGray}}>{list.reposts}</Text>
                            </TouchableOpacity >
                           
                        </View>
                        <ThreeDotsIcon  size={20} color={Colors.mainGray}/>
        </View>

        <View className='w-full justify-center ' style={{paddingBottom:120}} >

        <FlatList
            data={list.listItem}
            keyExtractor={item => item.id}
            columnWrapperStyle={{ justifyContent: 'flex-start', gap: 10, paddingHorizontal: 15 }}  
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            numColumns={4}
            contentContainerStyle={{ paddingTop:30, marginLeft:12, rowGap:20, paddingBottom:50}}
            renderItem={({item}) => {
                // console.log('item from flatlist', item)
                return (
                <TouchableOpacity onPress={()=>handlePress(item)}  >
                    <Image 
                        source = {{ uri : item.movie ? `${posterURL}${item.movie.posterPath}` : item.tv ? `${posterURL}${item.tv.posterPath}` : item.castCrew &&  `${posterURL}${item.castCrew.posterPath}` }}
                        placeholder = {{ uri : item.movie ? `${posterURLlow}${item.movie.posterPath}` : item.tv ? `${posterURLlow}${item.tv.posterPath}` : item.castCrew &&  `${posterURLlow}${item.castCrew.posterPath}` }}
                        placeholderContentFit='cover'
                        style= {{ width: 70, height :100, borderRadius:10  }}
                        contentFit='cover'
                        transition={300}
                    />
                    <Text className='text-mainGray text-sm font-pbold' style={{width:70 }} numberOfLines={2}>{ item.castCrew ? `${item.castCrew.name}` : item.movie ? `${item.movie.title}` : item.tv && `${item.tv.title}` }</Text>
                    <Text className='text-mainGray text-xs'>{ item.castCrew ? `(${getYear(item.castCrew.dob)})` : item.movie ? `(${getYear(item.movie.releaseDate)})` : item.tv && `(${ getYear(item.tv.releaseDate) })` }</Text>
                </TouchableOpacity>
            )}}

          

          
        />

        <View style={{paddingTop:30, gap:15}}>
        <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>
        <>
       

        <View style={{gap:10, marginVertical:0, paddingTop:0, paddingHorizontal:0, paddingBottom:100}}  >
      
          <View className='gap-3' >

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
                                            source={{ uri: item.user.profilePic }}
                                            contentFit='cover'
                                            style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                                        />
                                        <Text className='text-mainGrayDark' >@{item.user.username}</Text>
                                    </TouchableOpacity>
                                    <Text className='text-mainGrayDark '>{formatDate(item.createdAt)}</Text>
                                </View>
                                <Text className='text-secondary text-lg uppercase font-pcourier'>{item.user.firstName}</Text>
                                <Text className='text-white text-custom font-pcourier'>{item.content}</Text>
    
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
                                            source={{ uri: reply.user.profilePic }}
                                            contentFit='cover'
                                            style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                                        />
                                        <Text className='text-mainGrayDark   ' >@{reply.user.username}</Text>
                                    </TouchableOpacity>
                                    <Text className='text-mainGrayDark '>{formatDate(reply.createdAt)}</Text>
                                </View>
                                <Text className='text-secondary text-lg uppercase font-pcourier'>{reply.user.firstName}</Text>
                                <Text className='text-white text-custom font-pcourier'>{reply.content}</Text>
                                
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

       
           

            </>


            </View>

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
    </SafeAreaView>
  )
}

export default ListIdScreen


const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: Colors.primary,
    },
    inputContainer: {
      width: '100%',
      paddingHorizontal: 15,
      backgroundColor: Colors.primary,
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
  