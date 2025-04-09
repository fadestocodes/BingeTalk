import { StyleSheet, Text, View , FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl} from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { useGetFollowersListInfinite, useGetFollowingListInfinite, unfollowUser, followUser, useFetchOwnerUser } from '../../api/user'
import { formatDate } from '../../lib/formatDate'
import { followersListCategories } from '../../lib/CategoryOptions'
import { Colors } from '../../constants/Colors'
import { useUser } from '@clerk/clerk-expo'
import { router } from 'expo-router'


const FollowersFollowingsList = ({ userId, limit, whichList, setWhichList }) => {

    const { data : followers, loading: loadingFollowers, refetch: refetchFollowers, isFollowingIds, setIsFollowingIds, fetchMore, hasMore } = useGetFollowersListInfinite( userId, limit )
    const { data : followings, loading: loadingFollowings, refetch: refetchFollowings, isFollowingIds:isFollowingIdsFromFollowing, setIsFollowingIds : setIsFollowingIdsFromFollowing, fetchMore:fetchMoreFollowings, hasMore : hasMoreFollowings } = useGetFollowingListInfinite( userId, limit )
    const {user : clerkUser} = useUser()
    const { data : ownerUser } = useFetchOwnerUser({email : clerkUser.emailAddresses[0].emailAddress})

    

    const isOwnersPage = userId === ownerUser?.id;


    const handleFollowBack = async (checkFollow, item) => {
        let toUse 
        if (whichList === 'Followers'){
            toUse = item.following
        } else if (whichList === 'Following'){
            toUse = item.follower
        }
        const data = {
        followerId : toUse.id,
        followingId : ownerUser?.id
        }

        if (checkFollow) {
        const unfollowed = await unfollowUser(data)
        if (whichList === 'Followers'){
            setIsFollowingIds(prev => prev.filter( i => i !== toUse.id))
        } else {
            setIsFollowingIdsFromFollowing(prev => prev.filter( i => i !== toUse.id))
        }
        
        } else {
            const followBack = await followUser(data)
            if (whichList === 'Followers'){
                setIsFollowingIds(prev => [...prev, toUse.id])
            }else if (whichList === 'Following'){
                setIsFollowingIdsFromFollowing(prev => [...prev, toUse.id])
            }
        }
        // await   refetch()
    }

    const handleUserPress =(item) => {
        router.push(`/user/${item.id}`)
    }


    if ( !ownerUser){
        return (
            <View className='h-full justify-center items-center bg-primary'>
                <ActivityIndicator/>
            </View>
        )
    }


  return (
    <SafeAreaView className='w-full h-full bg-primary'>
    <View className='w-full  pt-10 px-6 gap-5' style={{paddingBottom:200}}>
      <View className="gap-3">
          <View className='flex-row gap-2 justify-start items-center'>

            {/* <FilmIcon size={30} color='white' /> */}
            <Text className='text-white font-pbold text-3xl'>Your friends</Text>
          </View>
          <Text className='text-mainGray font-pmedium'>View your followers and who you're following.</Text>
      </View>

     


      <View className='w-full my-5 gap-8' style={{paddingBottom:150}}>
        <FlatList
          horizontal
          data={followersListCategories}
          keyExtractor={(item,index) => index}
          contentContainerStyle={{ gap:10 }}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=>{setWhichList(item) }} style={{ borderRadius:15, backgroundColor:whichList===item ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
              <Text className=' font-pmedium' style={{ color : whichList===item ? Colors.primary : 'white' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        { whichList === 'Followers' && (
            <FlatList
            showsVerticalScrollIndicator={false}
            data={ followers }
            refreshControl={<RefreshControl
                tintColor={Colors.secondary}
                onRefresh={refetchFollowers }
                refreshing={loadingFollowers}
            />}
            keyExtractor={item => item.id}
            onEndReached={fetchMore}
            onEndReachedThreshold={0.2}
            contentContainerStyle={{gap:15}}
            renderItem={({item}) => {
                const checkFollowFromFollower = isFollowingIds.includes( item?.following?.id ) 
                // const checkFollowFromFollowing = isFollowingIdsFromFollowing.includes( item?.follower?.id ) 
                return (
                <TouchableOpacity onPress={()=>{console.log('presseditem', item)}}>
                   <View className="flex-row justify-between items-center gap-2">
                        <TouchableOpacity onPress={()=>handleUserPress(item?.follower || item?.following)} className='flex-row gap-2 justify-center items-center'>
                                <Image
                                source={{ uri : item?.follower?.profilePic || item?.following?.profilePic }}
                                contentFit='cover'
                                style={{ width:40, height:40, borderRadius:50 }}
                                />
                                <View>
                                    <Text className='text-mainGray font-pbold'>@{item?.follower?.username || item?.following?.username}</Text>
                                    <Text className='text-white font-pregular'>{item?.follower?.firstName || item?.following?.firstName} { item?.follower?.lastName || item?.following?.lastName }</Text>

                                </View>
                        </TouchableOpacity>
                        { item.following.id !== ownerUser.id && (

                                <TouchableOpacity onPress={()=>handleFollowBack(  checkFollowFromFollower  , item)} style={{backgroundColor:checkFollowFromFollower  ?  'transparent' : Colors.secondary, borderWidth:1, borderColor:Colors.secondary,borderRadius:10, padding:5}}>
                                    <Text className='   font-pbold text-sm' style={{color: checkFollowFromFollower  ? Colors.secondary : Colors.primary}}>{checkFollowFromFollower  ? 'Already following' : isOwnersPage ? 'Follow back' : item.following.id === ownerUser.id ? '' : 'Follow'}</Text>
                                </TouchableOpacity>
                        )  }

                    </View>
                </TouchableOpacity>
            )}}
        />
            
        ) }
        { whichList === 'Following' && (
            <FlatList
            showsVerticalScrollIndicator={false}
            data={ followings}
            refreshControl={<RefreshControl
                tintColor={Colors.secondary}
                onRefresh={refetchFollowings}
                refreshing={loadingFollowings}
            />}
            keyExtractor={item => item.id}
            onEndReached={()=>{
                if (hasMoreFollowings){
                    fetchMoreFollowings()
                }
            }}
            onEndReachedThreshold={0.2}
            contentContainerStyle={{gap:15}}
            renderItem={({item}) => {
                // const checkFollowFromFollower = isFollowingIds.includes( item?.following?.id ) 
                // const checkFollowFromFollowing = isFollowingIdsFromFollowing.includes( item?.follower?.id ) 
                // console.log('items',item)
                return (
                <TouchableOpacity onPress={()=>{console.log('presseditem', item)}}>
                   <View className="flex-row justify-between items-center gap-2">
                        <TouchableOpacity onPress={()=>handleUserPress(item?.follower || item?.following)} className='flex-row gap-2 justify-center items-center'>
                                <Image
                                source={{ uri : item?.follower?.profilePic || item?.following?.profilePic }}
                                contentFit='cover'
                                style={{ width:40, height:40, borderRadius:50 }}
                                />
                                <View>
                                    <Text className='text-mainGray font-pbold'>@{item?.follower?.username || item?.following?.username}</Text>
                                    <Text className='text-white font-pregular'>{item?.follower?.firstName || item?.following?.firstName} { item?.follower?.lastName || item?.following?.lastName }</Text>

                                </View>
                        </TouchableOpacity>

                        { item.follower.id !== ownerUser.id && (

                                <TouchableOpacity onPress={()=>handleFollowBack( item.alreadyFollowing , item)} style={{backgroundColor:item.alreadyFollowing ?  'transparent' : Colors.secondary, borderWidth:1, borderColor:Colors.secondary,borderRadius:10, padding:5}}>
                                    <Text className='   font-pbold text-sm' style={{color: item.alreadyFollowing ? Colors.secondary : Colors.primary}}>{item.alreadyFollowing ? 'Already following' : isOwnersPage ? 'Follow back' :  item.follower.id === ownerUser.id ? '' : 'Follow'}</Text>
                                </TouchableOpacity>
                        ) }

                    </View>
                </TouchableOpacity>
            )}}
        />
        ) }

            
            </View>

        </View>
   </SafeAreaView>
  )
}

export default FollowersFollowingsList

const styles = StyleSheet.create({})