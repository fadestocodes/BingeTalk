import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, RefreshControl } from 'react-native'
import { Image } from 'expo-image'
import { useFocusEffect } from '@react-navigation/native';

import React, {useState, useEffect, useCallback} from 'react'

import { followUser, unfollowUser, useFetchOwnerUser } from '../../../../api/user'
import { useGetAllNotifs, markNotifRead } from '../../../../api/notification'
import { Colors } from '../../../../constants/Colors'
import { formatDate, formatDateNotif } from '../../../../lib/formatDate'
import { Star, ListChecks, MessagesSquare, MessageSquare, Heart, ThumbsUp, ThumbsDown, Handshake, UserPlus } from 'lucide-react-native'
import { ProgressCheckIcon, RepostIcon , MessageIcon} from '../../../../assets/icons/icons'
import { useRouter } from 'expo-router'
import { useNotificationCountContext } from '../../../../lib/NotificationCountContext'
import { BackIcon } from '../../../../assets/icons/icons'
import { notificationFilterCategories } from '../../../../lib/CategoryOptions'
import { avatarFallback } from '../../../../lib/fallbackImages';
import { avatarFallbackCustom } from '../../../../constants/Images';
import { useGetUser, useGetUserFull } from '../../../../api/auth';
import Username from '../../../../components/ui/Username';

const Notification = () => {

  const {user} = useGetUser()
  const {userFull:ownerUser} = useGetUserFull(user?.id)
  
  const { data : notifications, readNotifs, unreadNotifs, loading , hasMore, refetch, isFollowingIds, setIsFollowingIds, unreadIds, setUnreadIds, fetchMore} = useGetAllNotifs(user?.id, 10);
  const { updateNotifCount, notifCount } = useNotificationCountContext()
  const [selected, setSelected] = useState('All')
  

  useFocusEffect(
    useCallback(() => {
      refetch() // refetch from server
    }, [user?.id])
  )
  
  const router = useRouter()
  
    
    

  const handlePress = async (item) => {
   
    setUnreadIds( prev => prev.filter( i => i !== item.id ))
    const readNotif = await markNotifRead( item.id, notifCount, updateNotifCount )

    // await refetch()
    if (item?.parentActivityId){
      router.push(`/activity/${item?.parentActivityId}`)

    } else if (item?.activityType === 'RECOMMENDATION'){

 
      router.push({
        pathname : `/user/recommendations/${item?.recommendation.id}`,
        params:{ type : item.movie ? item.movie.id : item.tv.id, userId : ownerUser.id }
      })
    } else if (item?.threads  && !item?.commentId){

      router.push({
        pathname:`/threads/${item?.threads.id}`,
      })
    } else if (item?.dialogue && !item?.commentId){

      router.push({
        pathname:`/dialogue/${item?.dialogue.id}`,
      })
    } else if (item?.listId && !item?.commentId ) {
      router.push(`/list/${item?.listId}`)

    } else if (item?.recommendation){
      router.push({
        pathname : `/user/recommendations/${item?.recommendation.id}`,
        params:{ type : item.movie ? item.movie.id : item.tv ? item.tv.id : item.recommendation.movie ? item.recommendation.movieId : item.recommendation.tvId, userId : ownerUser.id }
      })

    } else if (item?.comment?.parentComment?.recommendationId){

      router.push({
        pathname : `/user/recommendations/${item?.comment.parentComment.recommendationId}`,
        params:{ type : item.comment.recommendation.movieId ?  item.comment.recommendation.movieId : item.comment.recommendation.tvId, userId : ownerUser.id }
      })
    } else if (item?.tv){

      router.push(`/tv/${item?.tv.tmdbId}`)
    } else if (item?.movie){

      router.push(`/movie/${item?.movie.tmdbId}`)
    } else if (item?.castCrew){

      router.push(`/cast/${item?.castCrew.tmdbId}`)
    } else if (item?.activityType === 'FOLLOW'){

      router.push(`/user/${item?.userId}`)
    } else if (item?.commentId && item?.comment?.dialogueId){

      router.push({
        pathname:`/dialogue/${item?.comment.dialogueId}`,
        params:{ replyCommentId: item?.comment.id}
      })
    }else if (item?.comment?.parentComment && item?.comment?.parentComment?.threadId){

      router.push({
        pathname:`/threads/${item?.comment.parentComment.threadId}`,
        params:{ replyCommentId: item?.comment.parentComment.id}
      })
    } else if (item?.comment?.parentComment && item?.comment?.parentComment?.dialogueId){

      router.push({
        pathname:`/dialogue/${item?.comment.parentComment.dialogueId}`,
        params:{ replyCommentId: item?.comment.parentComment.id}
      })
    } else if (item?.comment?.parentComment && item?.comment?.parentComment?.listId)  {

      router.push({
        pathname:`/list/${item?.comment.parentComment.listId}`,
        params:{ replyCommentId: item?.comment.parentComment.id}
      })
    } else if (item?.commentId && item?.comment?.threadId){

      router.push({
        pathname:`/threads/${item?.comment.threadId}`,
        params:{ replyCommentId: item?.comment.id}
      })
    } else if (item?.commentId && item?.comment?.listId){
      router.push({
        pathname:`/list/${item?.comment.listId}`,
        params:{ replyCommentId: item?.comment.id}
      })
    } else if (item?.comment?.recommendationId){
      router.push({
        pathname : `/user/recommendations/${item.comment.recommendationId}`,
        params:{ type : item.comment.recommendation.movieId ?  item.comment.recommendation.movieId :  item.comment.recommendation.tvId, userId : ownerUser.id }
      })
    }  else if(item?.comment?.activityIdCommentedOn){

      router.push(`activity/${item?.comment.activityIdCommentedOn}`)
    } else if (item?.comment?.parentComment?.activityIdCommentedOn){

      router.push(`activity/${item?.comment.parentComment.activityIdCommentedOn}`)
    } else {

    }
  }

  const handleFollowBack = async (checkFollow, item) => {

    
    const data = {
      followerId : item.user.id,
      followingId : ownerUser?.id
    }
    if (checkFollow) {
      const unfollowed = await unfollowUser(data)
      setIsFollowingIds(prev => prev.filter( i => i !== item.userId))
    } else {
      const followBack = await followUser(data)
      setIsFollowingIds(prev => [...prev, item.userId])
    }
    // await   refetch()
  }
  const filteredData =
  selected === 'Read'
    ? notifications.filter(n => n.isRead)
    : selected === 'Unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleMarkRead = () => {
    router.push({
      pathname:'markNotifReadModal',
      params:{ userId : ownerUser?.id}
    })
  }


  return (
    <SafeAreaView className='w-full h-full bg-primary' style={{}}>
      {  loading || !ownerUser || !user  ? (
        <View className='h-full justify-center items-center'>
          <ActivityIndicator />
        </View>
      ) : (

    <View className='w-full flex-1  px-4 gap-5' style={{paddingBottom:0}}>
            <TouchableOpacity onPress={()=>router.back()}>
              <BackIcon size={26} color={Colors.mainGray}/>
            </TouchableOpacity>
      <View className="gap-3">
          <View className='flex-row gap-2 justify-start items-center'>

            {/* <TVIcon size={30} color='white' /> */}
            <Text className='text-white font-pbold text-3xl'>Notifications</Text>
          </View>
          <Text className='text-mainGray font-pmedium'>See what you missed.</Text>
          <View className='w-full justify-between flex-row items-center'>
            <FlatList
              data = {notificationFilterCategories}
              horizontal={true}
              keyExtractor={(item, index) => index}
              contentContainerStyle={{ gap:10, width:'70%' }}
              renderItem={({item}) => (
                <TouchableOpacity onPress={()=>setSelected(item)} style={{ borderRadius:15, backgroundColor:selected===item ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
                  <Text className=' font-pmedium' style={{ color : selected===item ? Colors.primary : 'white' }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={handleMarkRead} style={{ backgroundColor:Colors.secondary, borderWidth:1.5, borderRadius:12, paddingHorizontal:7, paddingVertical:5 }}>
              <Text className='text-primary font-pbold text-sm '>Mark all as read</Text>
              </TouchableOpacity>


          </View>
      </View>
      {/* <TouchableOpacity  style={{ position:'absolute', top:0, right:30 }}>
        <Image
          source={{ uri: ownerUser.profilePic }}
          contentFit='cover'
          style={{ width:30, height:30, borderRadius:50 }}
        />
      </TouchableOpacity> */}

      <View className='w-full my-2 gap-3' style={{paddingBottom:0}}>

        <FlatList
          refreshControl={
            <RefreshControl
              onRefresh={refetch}
              refreshing={loading}
              tintColor={Colors.secondary}
            />
          }
          data={filteredData }
          keyExtractor={(item, index) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={()=>{
            if (hasMore){
              fetchMore()
            }
          }}
          onEndReachedThreshold={0}
          contentContainerStyle={{width:'100%',  gap:15, paddingBottom:200}}
          renderItem={({item}) => {
              //  const checkFollow = ownerUser?.following.some( followingItem => followingItem?.followerId === item.userId );
              const checkFollow = isFollowingIds.includes( item.userId )
              const unread = unreadIds.includes( item.id )
            
            return (
            <TouchableOpacity  onPress={()=>handlePress(item)} className='w-full justify-start items-start' style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15, minHeight:110, gap:15, opacity: unread ? 1 : 0.6  }}>
              <View className='flex-row gap-2 justify-between items-center w-full'>
                <TouchableOpacity onPress={()=>router.push(`user/${item.user.id}`)} className='flex-row gap-2 justify-center items-center'>

                  <Image 
                    source={{ uri : item.user.profilePic || avatarFallbackCustom}}
                    style={{ width:30, height:30, borderRadius:50 }}
                    contentFit='cover'
                  />
                  {/* <Text className='text-mainGrayDark'>@{item.user.username}</Text> */}
                  <Username size='sm' user={item.user} color={Colors.mainGrayDark2} reverse={true}/>

                </TouchableOpacity>
                <Text className='text-mainGrayDark'>{ formatDateNotif(item.createdAt)}</Text>
              </View>
              <View className='flex-row gap-3 justify-center items-center px-4' >
              { item.activityType === 'RATING' ? <Star size={18} color={Colors.secondary} /> : item.activityType === 'DIALOGUE' ? <MessageSquare size={18} color={Colors.secondary} /> :
                  item.activityType === 'CURRENTLY_WATCHING' ? <ProgressCheckIcon size={18} color={Colors.secondary} /> : item.activityType==='WATCHLIST' ? <ListChecks size={18} color={Colors.secondary} /> :
                  item.activityType === 'LIKE' ? <Heart size={18} color={Colors.secondary} /> : item.activityType === 'UPVOTE' ? <ThumbsUp size={18} color={Colors.secondary} /> : 
                  item.activityType === 'DOWNVOTE' ? <ThumbsDown size={18} color={Colors.secondary} />  : item.activityType === 'REPOST' ? <RepostIcon size={18} color={Colors.secondary} /> : 
                  item.commentId ? <MessageIcon size={18} color={Colors.secondary} /> : item.activityType === 'RECOMMENDATION' ? <Handshake size={18} color={Colors.secondary} /> : 
                  item.activityType === 'FOLLOW' && <UserPlus size={18} color={Colors.secondary} /> } 
                <Text className='text-mainGray' numberOfLines={2}>{item.user.firstName} {item.description}</Text>

              </View>
              { item.activityType === 'FOLLOW' && (
                <TouchableOpacity  onPress={()=>handleFollowBack(checkFollow, item)} style={{ borderRadius:10, padding:5, borderColor:Colors.secondary, borderWidth:1,  backgroundColor: checkFollow ? 'transparent' : Colors.secondary, alignSelf:'flex-end' }}>
                  <Text className='text-primary text-sm font-pbold' style={{color : checkFollow ? Colors.secondary : Colors.primary}}>{checkFollow ? 'Already following' :  'Follow back'}</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}}
        
        />
      
      </View>
    </View>
      ) }
     
  </SafeAreaView>
  )
}

export default Notification

const styles = StyleSheet.create({})