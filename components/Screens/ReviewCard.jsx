import { StyleSheet, Text, View , TouchableOpacity, FlatList, ActivityIndicator} from 'react-native'
import React, {act, useEffect, useState} from 'react'
import { Image } from 'expo-image'
import { Colors } from '../../constants/Colors'
import { MessageIcon, ThreeDotsIcon, RepostIcon, ProgressCheckIcon } from '../../assets/icons/icons'
import { ThumbsUp, ThumbsDown, Heart, MessagesSquare, MessageSquare, ListChecks , Star, Eye} from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { formatDate, formatDateNotif, getYear } from '../../lib/formatDate'
import { toPascalCase } from '../../lib/ToPascalCase'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../api/user'
// import { likeActivity, activityInteraction, useFetchActivityId } from '../../api/review'
import { likeActivity,activityInteraction, useFetchActivityId } from '../../api/activity'
import { getReadingTime } from '../../lib/getReadingTIme'
import { NotebookPen } from 'lucide-react-native'
import { reviewInteraction } from '../../api/review'

const ReviewCard = ({review:item, fromHome, disableCommentsModal, isBackground, isReposted}) => {


        const { user:clerkUser } = useUser();
        const { data:ownerUser, refetch:refetchOwner } = useFetchOwnerUser({email : clerkUser?.emailAddresses[0]?.emailAddress});
        const posterURL = 'https://image.tmdb.org/t/p/w500';
        const router = useRouter()
        const [ alreadyInteractions, setAlreadyInteractions ] = useState({
            upvoted : false,
            downvoted : false,
            reposted : false
        })
    
        const [ interactionCounts, setInteractionCounts ] = useState({
            upvotes : item.upvotes ,
            downvotes : item.downvotes ,
            reposts : item.reposts
        })
    
    
        useEffect(()=>{
    
            const alreadyUpvoted = item.reviewInteractions.some( i => i.interactionType === 'UPVOTE' && i.userId === ownerUser?.id )
            const alreadyDownvoted = item.reviewInteractions.some( i => i.interactionType === 'DOWNVOTE'  && i.userId === ownerUser?.id )
            const alreadyReposted = item.reviewInteractions.some( i => i.interactionType === 'REPOST'  && i.userId === ownerUser?.id )
            setAlreadyInteractions({
                upvoted: alreadyUpvoted,
                downvoted:alreadyDownvoted,
                reposted : alreadyReposted
            })
            setInteractionCounts({
                upvotes: item.upvotes,
                downvotes : item.downvotes,
                reposts : item.reposts
            })
        }, [item, ownerUser?.id])
    
        // const alreadyUpvoted = item.reviewInteractions.some( i => i.interactionType === 'UPVOTE' && i.userId === ownerUser?.id )
        // const alreadyDownvoted = item.reviewInteractions.some( i => i.interactionType === 'DOWNVOTE'  && i.userId === ownerUser?.id )
        // const alreadyReposted = item.reviewInteractions.some( i => i.interactionType === 'REPOST'  && i.userId === ownerUser?.id )
    
        // const [ already, setAlready ] = useState({
        //     upvoted : alreadyUpvoted,
        //     downvoted : alreadyDownvoted,
        //     reposted : alreadyReposted
        // })
    
        
    
     
    
    
        const handleReviewPress = ( item ) => {
            if (fromHome){
                router.push(`(home)/review/${item.id}`)
            } else {
                router.push(`/review/${item.id}`)
            }
        }
    
      
    
        const handleInteraction =  async (type, item) => {
            if (type === 'upvotes'){
                setAlreadyInteractions(prev => ({...prev, upvoted : !prev.upvoted}))
                if (alreadyInteractions.upvoted){
                    setInteractionCounts(prev => ({...prev, upvotes : prev.upvotes - 1}))
                } else {
                    setInteractionCounts(prev => ({...prev, upvotes : prev.upvotes + 1}))
                }
            } else if (type === 'downvotes'){
                setAlreadyInteractions(prev => ({...prev, downvoted : !prev.downvoted}))
                if (alreadyInteractions.downvoted){
                    setInteractionCounts(prev => ({...prev, downvotes : prev.downvotes - 1}))
                } else {
                    setInteractionCounts(prev => ({...prev, downvotes : prev.downvotes + 1}))
                }
            } else if (type === 'reposts'){
                setAlreadyInteractions(prev => ({...prev, reposted : !prev.reposted}))
                if (alreadyInteractions.reposted){
                    setInteractionCounts(prev => ({...prev, reposts : prev.reposts - 1}))
                } else {
                    setInteractionCounts(prev => ({...prev, reposts : prev.reposts + 1}))
                }
            }
            let description
            if ( type === 'upvotes' ){
                description = `upvoted your review for "${item?.movie?.title || item?.tv?.title}"`
                
            } else if (type === 'downvotes'){
                description = `downvoted your review for "${item?.movie?.title || item?.tv?.title}"`
               
            }else  if ( type === 'reposts' ){
                description = `reposted your review for "${item?.movie?.title || item?.tv?.title}"`
               
            }
            const data = {
                type,
                reviewId : item.id,
                userId : ownerUser.id,
                description,
                recipientId : item.user.id
            }
            console.log("DATAFORREVIEWINTERACTION", data)
            const updatedReview = await reviewInteraction(data)
            refetchOwner();
        }
    
    
        
        const handleThreeDots = (review) => {
    
            const fromOwnPost = review.userId === ownerUser?.id
            router.push({
                pathname:'/postOptions',
                params: { fromOwnPost : fromOwnPost ? 'true' : 'false', ownerId : ownerUser?.id, postType : 'REVIEW', postId : review.id, postUserId : review.userId}
            })
        }
    
    
        const handleComment = (item) => {
            refetchOwner()
            console.log('COMMENT ON REVIEW', item)
          
            if (fromHome){
                router.push({
                    pathname:`(home)/commentsModal`,
                    params : { userId : ownerUser?.id, reviewId : item.id }
                })
            } else {
                router.push({
                    pathname:`/commentsModal`,
                    params : { userId : ownerUser?.id, reviewId : item.id }
                })
            }
        }
    
    
        const handleUserPress = (item) => {
            if (fromHome){
                router.push(`/(home)/user/${item.user.id}`)
            } else {
                router.push(`/user/${item.user.id}`)
            }
        }
        
        const handlePoster = (item) => {
            if (item.movie){
                router.push(`/movie/${item.movie.tmdbId}`)
            } else if (item.tv){
                router.push(`/tv/${item.tv.tmdbId}`)
            }
        }
    
        if (!item || !ownerUser){
            return (
                <View className='h-full bg-primary'>
                    <ActivityIndicator/>
                </View>
            )
        }
    
    
    
    
      return (
        <View className='w-full' >
                        <TouchableOpacity disabled={!fromHome}  onPress={()=>handleReviewPress(item)}  style={{ backgroundColor:isBackground && Colors.mainGrayDark, paddingVertical:isBackground && 12, paddingHorizontal: isBackground && 15, borderRadius:15, gap:15 }}  >
                            <View className='gap-3 '>
                                <View className='gap-3'>
                                    <View className='flex-row w-full gap-2 justify-between items-center '>
                                        <View className='flex-row gap-2 justify-center items-center'>
                                            { isReposted ? (
                                                <RepostIcon size={20} color={Colors.mainGray} style={{marginRight:10}}/>
                                            ) : null}
                                            <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', gap:5}} onPress={()=>handleUserPress(item)}>
                                                <Image
                                                source ={{ uri :item.user.profilePic }}
                                                contentFit='cover'
                                                style={{ width:25, height :25, borderRadius:50 }}
                                                />
                                                <Text className='text-mainGrayDark'>@{item.user.username}</Text>

                                            </TouchableOpacity>
                                        </View>
                                        <Text className='text-mainGrayDark'>{formatDate(item.createdAt)}</Text>
                                    </View>
                                    { !fromHome && (
                                        <View className='flex-row justify-center items-center gap-2'>
                                            <NotebookPen size={24} color={Colors.secondary}  />
                                            <View className='justify-center items-center'>
                                                <Text className='text-white font-pbold text-2xl'>{item?.movie?.title || item?.tv?.title} ({getYear(item?.movie?.releaseDate || item?.tv?.releaseDate)})</Text>
                                            </View>
                                        </View>

                                    ) }
                                    { fromHome && (
                                        <View className='flex-row gap-2 justify-center items-center px-4 '>
                                            <NotebookPen size={20} color={Colors.secondary} />
                                            <Text className='text-mainGray'>{item.user.firstName} wrote a review for '{item?.movie?.title || item?.tv?.title} ({getYear(item?.movie?.releaseDate || item?.tv?.releaseDate)})'</Text>
                                        </View>
                                    ) }
                                    <TouchableOpacity onPress={()=>handlePoster(item)}>
                                        <Image
                                            source={{ uri: `${posterURL}${item?.movie?.backdropPath || item?.tv?.backdropPath}` }}
                                            contentFit='cover'
                                            style={{ width:'100%', height :150, borderRadius:15,  }}
                                        />
                                    </TouchableOpacity>
                                </View>
                          
                                <View className='justify-between items-start flex-row'>
                                    <View className='flex justify-start items-start'>
                                        <Text className='text-mainGrayLight ' style={{ fontStyle:'italic', fontWeight:'600'}}>Written by {item.user.firstName}</Text>
                                        <Text className='text-mainGrayLight' style={{fontStyle:'italic'}}>~{getReadingTime(item.review.length)} min read</Text>
                                    </View>
                                    <View className='justify-center items-center flex-row gap-2'>
                                        <Star size={20} color={Colors.secondary} />
                                        <Text className='text-mainGrayLight text-2xl font-pbold '>{item.rating.rating}</Text>
                                    </View>

                        </View>
                        { item?.reviewTraits?.length > 0 && (

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                            
                                {item.reviewTraits.map((item, index) => {

                                return (
                                    <View key={index}   style={{ borderRadius: 15,backgroundColor: 'white' ,paddingHorizontal: 8,paddingVertical: 3,borderWidth: 1,borderColor: 'white',marginRight: 8,marginBottom: 8,}}> 
                                    <Text className="font-pmedium " style={{ color: Colors.primary }}>{item.traitName} </Text>
                                    </View>
                                        
                                    )})
                                }
                            
                            </View>
                        )  }
                                <Text className='  font-pcourier text-lg text-white ' style={{lineHeight:18, paddingTop:10}} numberOfLines={fromHome ? 3 : undefined}>{ item.review }</Text>
                            </View>
    
                                
                            <View className='w-full flex-row justify-between items-center'>
                                <View className='flex-row gap-5 justify-center items-center'>
                                    <TouchableOpacity onPress={()=> handleInteraction('upvotes',item) } >
                                        <View className='flex-row gap-1 justify-center items-center'>
                                            <ThumbsUp size={20} color={ alreadyInteractions.upvoted ? Colors.secondary :  Colors.mainGray} ></ThumbsUp>
                                            <Text className='text-xs font-pbold ' style={{ color: alreadyInteractions.upvoted ? Colors.secondary : Colors.mainGray }}>{ interactionCounts.upvotes }</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity  onPress={()=> handleInteraction('downvotes',item) } >
                                    <View className='flex-row gap-1 justify-center items-center'>
                                        <ThumbsDown size={20}  color={ alreadyInteractions.downvoted ? Colors.secondary :  Colors.mainGray}></ThumbsDown>
                                        <Text  className='text-xs font-pbold text-mainGray' style={{ color: alreadyInteractions.downvoted ? Colors.secondary : Colors.mainGray }}>{ interactionCounts.downvotes }</Text>
                                    </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>handleComment(item)}>
                                    <View className='flex-row gap-1 justify-center items-center'>
                                        <MessageIcon size={20} color={Colors.mainGray}></MessageIcon>
                                        <Text className='text-xs font-pbold text-mainGray'>{ item.comments.length}</Text>
                                        </View>
                                    </TouchableOpacity>
    
                                    
                                    <TouchableOpacity onPress={()=> handleInteraction('reposts',item) } >
                                    <View className='flex-row gap-1 justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                                        <RepostIcon className='' size={20}  color={ alreadyInteractions.reposted ? Colors.secondary :  Colors.mainGray}/>
                                        <Text className='text-xs font-pbold text-mainGray  'style={{ color: alreadyInteractions.reposted ? Colors.secondary : Colors.mainGray }}> {interactionCounts.reposts}</Text>
                                    </View>
    
                                    </TouchableOpacity>
                                </View>
                                <View className='relative' >
                                    <TouchableOpacity onPress={()=>handleThreeDots(item)}  >
                                        <ThreeDotsIcon className='' size={20} color={Colors.mainGray} />
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
    
    
                        </TouchableOpacity>
                    </View>
      )
    }
export default ReviewCard

const styles = StyleSheet.create({})