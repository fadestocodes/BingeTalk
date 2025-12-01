import { StyleSheet, Text, View, SafeAreaView, ScrollView , RefreshControl, TextInput, TouchableOpacity, ActivityIndicator, FlatList} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../../constants/Colors'
import { Image } from 'expo-image'

import React, { useState, useRef, useCallback } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useGetRecommendation, deleteRecommendation, acceptRecommendation, removeRecommendationFlag } from '../../api/recommendation'
import { TVIcon, FilmIcon, CloseIcon , BackIcon, ThreeDotsIcon, PlaylistCheck} from '../../assets/icons/icons'
import { commentInteraction, createComment } from '../../api/comments'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, useAnimatedKeyboard } from 'react-native-reanimated';
import { getYear, formatDate } from '../../lib/formatDate'
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake,X , Ellipsis, EllipsisVertical, Minus, Trash2} from 'lucide-react-native';
import { PlaylistAdd, PlaylistMinus } from '../../assets/icons/icons'
import { useFetchOwnerUser } from '../../api/user'
import { avatarFallbackCustom } from '../../lib/fallbackImages'
import { avatarFallbackCustomCustom, moviePosterFallback } from '../../constants/Images'
import ToastMessage from '../ui/ToastMessage'
import { useNotificationCountContext } from '../../lib/NotificationCountContext'


const RecommendationPage = () => {
    const { type, recommendationId , userId, replyCommentId} = useLocalSearchParams()
    const data = {
        id : recommendationId,
        userId : Number(userId)
    }
    const { recommendation, ownerUser, refetch, loading, commentsData,status, setStatus, alreadyInWatchlist, setAlreadyInWatchlist, setCommentsData, interactedComments, setInteractedComments, didOwnerSend , directorOrCreator, ratings } = useGetRecommendation(data)
    const [ input, setInput ] = useState('')
    const inputRef = useRef(null);  
    const [ visibleReplies, setVisibleReplies  ] = useState({})
    const [ replyingTo, setReplyingTo ] = useState(null)
    const [ replying, setReplying ] = useState(false)
    const [ toastMessage, setToastMessage ] = useState(null)
    const [ toastIcon, setToastIcon ] = useState(null)
    const { pendingRecsNotifCount, updatePendingRecsNotifCount } = useNotificationCountContext()


    const router = useRouter()
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w342';

    const keyboard = useAnimatedKeyboard(); 

    const animatedStyle = useAnimatedStyle(() => ({
      bottom: withTiming(keyboard.height.value-80, { duration: 0 }),
    }));


   



    const handlePress = () => {
      if (recommendation.movie){
        router.push(`/movie/${recommendation.movie.tmdbId}`)
     
      }
      if (recommendation.tv){
        router.push(`/tv/${recommendation.tv.tmdbId}`)
     
      }
  }
  
      const ITEM_HEIGHT = 50

      const handleOptions = () => {
          
      }



  const handleReply= (item, parentId) => {
    inputRef.current?.focus();  
    setReplying(true);
    setInput(`@${item.user.username} `)
    
    const replyingToData = {
        user : item.user,
        recommendationId : Number(recommendationId),
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


// const handleRemove = async  (type) => {
//   try {
//     if (didOwnerSend){
//         const data = {
//             recipientId : recommendation.recipientId,
//             recommenderId : recommendation.recommenderId,
//             movieId : recommendation?.movie?.id || null,
//             tvId : recommendation?.tv?.id || null
//         }
//         const deletedRec = await deleteRecommendation(data)
//         // removeSentItems(item)
  
//     } else {
//         const data = {
//             recipientId : recommendation.recipientId,
//             recommenderId : recommendation.recommenderId,
//             movieId : recommendation?.movie?.id || null,
//             tvId : recommendation?.tv?.id || null
//         }
//         const deletedRec = await deleteRecommendation(data)
//         // removeReceivedItems(item)
//     }
//   } catch (err){
//     console.log(err)
//   } finally {
//     setTimeout(() => {
//       router.back()
//     }, 1300)
//   }
  
// }



const handlePostComment =  async ({ parentId = null }) => {

    const commentData = {
        userId : Number(ownerUser.id),
        recommendationId : Number(recommendationId),
        content : input,
        parentId : replyingTo?.parentId || null,
        replyingToUserId : replyingTo?.user?.id || null,
        description: `commented on your recommendation "${input}"`,
        recipientId : replyingTo ? replyingTo.user.id : recommendation.recommenderId,
        replyDescription : replyingTo ? `replied to your comment "${input}"` : null,
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

  const handleRecommendedList = () => {
    router.push(`/list/recommended/${ownerUser.id}`)
  }

  const handleThreeDots = (item, fromReply) => {

    const fromOwnPost = item.userId === ownerUser?.id
    router.push({
        pathname:'/postOptions',
        params: { fromOwnPost : fromOwnPost ? 'true' : 'false', ownerId : ownerUser?.id, postType : fromReply ? 'REPLY' : 'COMMENT', postId : item.id, postUserId : item.userId}
    })
  }

  const handleAddToWatchlist = async (item) => {
    // setStatus('ACCEPTED')
    const data = {
        recommenderId : item.recommenderId,
        recommendationId : item.id,
        type : 'ACCEPTED',
        movieId : item?.movie ? item.movie.id : null,
        tvId : item?.tv ? item.tv.id : null
    }
        setStatus('ACCEPTED')
        const res = await acceptRecommendation(data)
        if (res?.success){
            setToastIcon(< PlaylistAdd color={Colors.secondary} size={30} />)
            setToastMessage("Accepted recommendation and added to your Watchlist")
        }

        if (pendingRecsNotifCount && pendingRecsNotifCount > 0){
            updatePendingRecsNotifCount( pendingRecsNotifCount - 1 )
        }

        await checkTastemakerBadge(item.recommenderId)
        
        
        
    }
    
    const handleDeclineRecommendation = async (item) => {
      const data = {
          recommenderId : item.recommenderId,
          recommendationId : item.id,
          type : 'DECLINED',
          movieId : item?.movie ? item.movie.id : null,
          tvId : item?.tv ? item.tv.id : null
      }
      const res = await acceptRecommendation(data)
      setStatus('DECLINED')

        if (res?.success){
            setToastIcon(< X color={Colors.secondary} size={30} />)
            setToastMessage("Declined recommendation")
        }   

        removeReceivedItems(item)

        if (pendingRecsNotifCount && pendingRecsNotifCount > 0){
            updatePendingRecsNotifCount( pendingRecsNotifCount - 1 )
        }

  }


  const handleRemove = async  (type, item) => {
    let res
    if (type === 'sent'){

        // const data = {
        //     recipientId : item.recipientId,
        //     movieId : item?.movie?.id || null,
        //     tvId : item?.tv?.id || null
        // }
        // const deletedRec = await deleteRecommendation(data)
        const removeData = {
            recommendationId : item.id,
            removedBy : 'RECOMMENDER'
        }
        res = await removeRecommendationFlag(removeData)
        
        removeSentItems(item)
        
    } else if (type === 'pending'){
        // const data = {
            //     recipientId : item.recipientId,
            //     recommenderId : item.recommenderId,
            //     movieId : item?.movie?.id || null,
            //     tvId : item?.tv?.id || null
            // }
        
        const removeData = {
            recommendationId : item.id,
            removedBy : 'RECIPIENT'
        }
        res = await removeRecommendationFlag(removeData)
        removeReceivedItems(item)

    }  else if (type === 'accepted'){
        
        const removeData = {
            recommendationId : item.id,
            removedBy : 'RECIPIENT'
        }
        res = await removeRecommendationFlag(removeData)
        removeAcceptedItem(item)
    } else if (type === 'declined'){
        const removeData = {
            recommendationId : item.id,
            removedBy : 'RECIPIENT'
        }
        res = await removeRecommendationFlag(removeData)
        removeDeclineItem(item)
    }

    if (res?.success){
        setToastIcon(< Trash2 color={Colors.secondary} size={30} />)
        setToastMessage("Removed recommendation")
    }

    if (pendingRecsNotifCount && pendingRecsNotifCount > 0){
        updatePendingRecsNotifCount( pendingRecsNotifCount - 1 )
    }
    
}

  if (!recommendation || !ownerUser ){
    return (
      <View className='w-full h-full bg-primary justify-center items-center'>
        <ActivityIndicator />
      </View>
    )
  }
    

  return (
    <SafeAreaView className='h-full  relative' style={{backgroundColor:Colors.primary}} >
      <ScrollView className='bg-primary h-full  relative ' style={{paddingHorizontal:15}}
          refreshControl={
            <RefreshControl 
              refreshing={loading} 
              onRefresh={refetch}
              tintColor={Colors.secondary}
            />
          }
        >
       <View style={{height:'100%', paddingBottom:200}}>
       <ToastMessage message={toastMessage} onComplete={()=>{setToastMessage(null); setToastIcon(null)}} icon={toastIcon}  />

       
           <TouchableOpacity onPress={()=>router.back()} style={{justifyContent:'flex-start', alignSelf:'flex-start' }}>
        <BackIcon size={26} color={Colors.mainGray} />
    </TouchableOpacity>
        <View style={{paddingTop:15, gap:15, paddingBottom:15}}>
           <View className='gap-1 flex flex-col justify-center items-start'>
               <View className="flex-row w-full justify-start items-center gap-2 py-1">
                   <Handshake color='white'  />
                   <Text className='text-white text-3xl  font-pbold'>Recommendations</Text>
               </View>
                   <Text className='text-mainGray font-medium'>Accept and add to your Watchlist or decline.</Text>
           </View>
         <View className='w-full justify-center items-center flex-row' style={{paddingHorizontal:15}}>
         <TouchableOpacity onPress={()=>handlePress(recommendation)} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:180, width:125 ,overflow:'hidden'}}>
              <Image
              style={{
              width: '100%',
              height: '100%',
              }}
              source={{ uri: `${posterURL}${recommendation.movie ? recommendation.movie.posterPath : recommendation.tv && recommendation.tv.posterPath }` }}
              placeholder={moviePosterFallback}

              placeholderContentFit="cover"
              contentFit="cover" // Same as resizeMode='cover'
              transition={300} // Optional: Adds a fade-in effect
          />
          
          </TouchableOpacity>
              <View className=' justify-center items-center  gap-3' style={{paddingHorizontal:15, paddingVertical:15}}>

                  <View  className='' style={{ maxWidth:170}} > 
                      <TouchableOpacity onPress={handlePress  } className = ' gap-0 justify-start items-center ' >
                      
                          <View className='flex-row gap-1 justify-center items-center'>
                              { recommendation.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                              <Text className='text-white text font-pbold'>{ recommendation?.movieId ? `${recommendation.movie.title} (${getYear(recommendation.movie.releaseDate)})` : `${recommendation.tv.title} (${getYear(recommendation.tv.releaseDate)})` }</Text>
                          </View>
                          {directorOrCreator && (
                          <Text className='text-mainGray font-pmedium text-xs  '>{type === 'TV' ? 'Created by:' : type === 'MOVIE' ? 'Directed by:' : ''} {directorOrCreator.name}</Text>
                          )}
                      </TouchableOpacity>
                                  
                  </View>
                  <View className='justify-center items-center'>
                    <Text className='text-mainGray text-sm'>Overall rating</Text>
                    <Text className='text-mainGray text-3xl font-pbold' >{ratings}</Text>
                  </View>
                        
                    { status === 'PENDING' && (
                    <View className='flex flex-row gap-5 justify-center items-center'>
                        <TouchableOpacity onPress={()=>handleAddToWatchlist(recommendation)  } className={`py-4 px-4  w-[50px] bg-primaryLight justify-center items-center rounded-2xl`}>
                            <PlaylistCheck size={24} color={'green'} />
                            {/* <Text className='text-mainGray text-sm' >Accept & Add to Watchlist</Text> */}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleAddToWatchlist(recommendation)  } className={`py-4 px-4  w-[50px] bg-primaryLight justify-center items-center rounded-2xl`}>
                            <X size={24} color={'red'} />
                            {/* <Text className='text-mainGray text-sm' >Accept & Add to Watchlist</Text> */}
                        </TouchableOpacity>
                        <TouchableOpacity onPressIn={()=>handleDeclineRecommendation(recommendation)}  className='py-4 px-4  w-[50px] bg-primaryLight justify-center items-center  rounded-2xl' >
                            <Trash2 size={24} color={Colors.mainGray}/>
                        </TouchableOpacity>
                    </View>
                    )  }
                      
                </View>
              </View>
                <TouchableOpacity onPress={()=>router.push(`user/${recommendation.recommender.id}`)} className="w-full justify-center items-start">
                  <View className='flex-row justify-start items-center w-full gap-2 '>
                      <Image
                              source={{ uri: didOwnerSend ? (recommendation.recipient.profilePic || avatarFallbackCustomCustom ):  (recommendation.recommender.profilePic || avatarFallbackCustom)}}
                              resizeMethod = 'cover'
                              style={{ width:25, height : 25, borderRadius : '50%' }}
                          />
                       
                      <Text className='text-mainGray  text-center font-psemibold text-sm '> {didOwnerSend
                        ? `Recommended to @${recommendation.recipient.username} on ${formatDate(recommendation.createdAt)}`
                        : recommendation.recipient
                        ? `Recommended by @${recommendation.recommender.username} on ${formatDate(recommendation.createdAt)}`
                        : ''}</Text>
                  </View>
                    
                  </TouchableOpacity>
              { recommendation.message && (
                <>
                
                  <View className='w-full justify-center items-center'>
                    <Text className='text-secondary text-lg uppercase font-pcourier'>{recommendation.recommender.firstName}</Text>
                    <Text className='text-white font-pcourier' style={{}}>{recommendation.message}</Text>
                  </View>
                </>
              ) }
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
                                <TouchableOpacity onPress={()=> handleThreeDots(reply, 'fromReply')}>
                                    <ThreeDotsIcon size={20} color={Colors.mainGray} />
                                </TouchableOpacity>
                                </View>
                            </View>
    
                            )}) }
    
                            { shownReplies < item.replies.length && (
                                <View className='px-4'>
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

                <TouchableOpacity onPress={handleRecommendedList} style={{ paddingTop: 30 }}>
                  <Text className='text-mainGray text-sm font-pregular'>See the rest of your recommendations</Text>
                </TouchableOpacity>



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

export default RecommendationPage


RecommendationPage.options = {
  headerShown: false, 
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
