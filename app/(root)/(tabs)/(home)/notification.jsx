import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, RefreshControl } from 'react-native'
import { Image } from 'expo-image'
import React, {useState, useEffect} from 'react'
import { useUser } from '@clerk/clerk-expo'
import { followUser, unfollowUser, useFetchOwnerUser } from '../../../../api/user'
import { useGetAllNotifs, markNotifRead } from '../../../../api/notification'
import { Colors } from '../../../../constants/Colors'
import { formatDate, formatDateNotif } from '../../../../lib/formatDate'
import { Star, ListChecks, MessagesSquare, MessageSquare, Heart, ThumbsUp, ThumbsDown, Handshake, UserPlus } from 'lucide-react-native'
import { ProgressCheckIcon, RepostIcon , MessageIcon} from '../../../../assets/icons/icons'
import { useRouter } from 'expo-router'


const Notification = () => {
  const { user : clerkUser } = useUser();
  const { data : ownerUser } = useFetchOwnerUser({email : clerkUser.emailAddresses[0].emailAddress})
  const { data : notifications, loading , hasMore, refetch, isFollowingIds, setIsFollowingIds, unreadIds, setUnreadIds} = useGetAllNotifs(ownerUser.id, 10);
  
  
  
  const router = useRouter()
  
    
    // useEffect(()=>{
    //     const isFollowingId = notifications.filter( notif => ownerUser.following.some( f =>  f.followerId === notif.userId ) ).map( element => element.id );
    //     setIsFollowing(isFollowingId)

    // },[])
    

    

  const handlePress = async (item) => {
    console.log('notif', item)
   
    setUnreadIds( prev => prev.filter( i => i !== item.id ))
    const readNotif = await markNotifRead( item.id )

    // await refetch()
    if (item.parentActivityId){
      router.push(`/activity/${item.parentActivityId}`)
    } else if (item.threads){
      router.push(`/threads/${item.threads.id}?replyCommentId=${item.replyCommentId}`)
    } else if (item.dialogue){
      router.push(`/dialogue/${item.dialogue.id}?replyCommentId=${item.replyCommentId}`)
    } else if (item.listId) {
      router.push(`/list/${item.listId}`)
    } else if (item.tv){
      router.push(`/tv/${item.tv.tmdbId}`)
    } else if (item.movie){
      router.push(`/movie/${item.movie.tmdbId}`)
    } else if (item.castCrew){
      router.push(`/cast/${item.castCrew.tmdbId}`)
    } else if (item.activityType === 'FOLLOW'){
      router.push(`/user/${item.userId}`)
    } else if (item.commentId && item.comment.dialogueId){
      router.push({
        pathname:`/dialogue/${item.comment.dialogueId}`,
        params:{ replyCommentId: item.comment.id}
      })
    }
   
  }

  const handleFollowBack = async (checkFollow, item) => {

    
    const data = {
      followerId : item.user.id,
      followingId : ownerUser.id
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


  return (
    <SafeAreaView className='w-full h-full bg-primary' style={{}}>
      { loading ? (
        <View className='h-full justify-center items-center'>
          <ActivityIndicator />
        </View>
      ) : (

    <View className='w-full  pt-3 px-4 gap-5' style={{paddingBottom:200}}>
      <View className="gap-3">
          <View className='flex-row gap-2 justify-start items-center'>

            {/* <TVIcon size={30} color='white' /> */}
            <Text className='text-white font-pbold text-3xl'>Notifications</Text>
          </View>
          <Text className='text-mainGray font-pmedium'>Check out the most bingeable shows right now.</Text>
      </View>
      {/* <TouchableOpacity  style={{ position:'absolute', top:0, right:30 }}>
        <Image
          source={{ uri: ownerUser.profilePic }}
          contentFit='cover'
          style={{ width:30, height:30, borderRadius:50 }}
        />
      </TouchableOpacity> */}

      <View className='w-full my-2 gap-3' style={{paddingBottom:30}}>
        <FlatList
          refreshControl={
            <RefreshControl
              onRefresh={refetch}
              refreshing={loading}
              tintColor={Colors.secondary}
            />
          }
          data={notifications }
          keyExtractor={(item, index) => item.id}
          onEndReached={()=>{
            if (hasMore){
              refetch()
            }
          }}
          onEndReachedThreshold={0}
          contentContainerStyle={{width:'100%',  gap:15}}
          renderItem={({item}) => {
              //  const checkFollow = ownerUser?.following.some( followingItem => followingItem?.followerId === item.userId );
              const checkFollow = isFollowingIds.includes( item.userId )
              const unread = unreadIds.includes( item.id )
            
            return (
            <TouchableOpacity  onPress={()=>handlePress(item)} className='w-full justify-start items-start' style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15, minHeight:110, gap:15, opacity: unread ? 1 : 0.4  }}>
              <View className='flex-row gap-2 justify-between items-center w-full'>
                <View className='flex-row gap-2 justify-center items-center'>
                  <Image 
                    source={{ uri : item.user.profilePic }}
                    style={{ width:30, height:30, borderRadius:50 }}
                    contentFit='cover'
                  />
                  <Text className='text-mainGrayDark'>@{item.user.username}</Text>
                </View>
                <Text className='text-mainGrayDark'>{ formatDateNotif(item.createdAt)}</Text>
              </View>
              <View className='flex-row gap-3 justify-center items-center px-4' >
              { item.activityType === 'RATING' ? <Star size={18} color={Colors.secondary} /> : item.activityType === 'DIALOGUE' ? <MessageSquare size={18} color={Colors.secondary} /> :
                  item.activityType === 'CURRENTLY_WATCHING' ? <ProgressCheckIcon size={18} color={Colors.secondary} /> : item.activityType==='WATCHLIST' ? <ListChecks size={18} color={Colors.secondary} /> :
                  item.activityType === 'LIKE' ? <Heart size={18} color={Colors.secondary} /> : item.activityType === 'UPVOTE' ? <ThumbsUp size={18} color={Colors.secondary} /> : 
                  item.activityType === 'DOWNVOTE' ? <ThumbsDown size={18} color={Colors.secondary} />  : item.activityType === 'REPOST' ? <RepostIcon size={18} color={Colors.secondary} /> : 
                  item.activityType === 'COMMENT' ? <MessageIcon size={18} color={Colors.secondary} /> : item.activityType === 'RECOMMENDATION' ? <Handshake size={18} color={Colors.secondary} /> : 
                  item.activityType === 'FOLLOW' && <UserPlus size={18} color={Colors.secondary} /> } 
                <Text className='text-mainGray' numberOfLines={2}>{item.user.firstName} {item.description}</Text>

              </View>
              { item.activityType === 'FOLLOW' && (
                <TouchableOpacity  onPress={()=>handleFollowBack(checkFollow, item)} style={{ borderRadius:10, padding:5, borderColor:Colors.secondary, borderWidth:1,  backgroundColor: checkFollow ? 'none' : Colors.secondary, alignSelf:'flex-end' }}>
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