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

    const { data : followers, loading: loadingFollowers, refetch: refetchFollowers, isFollowingIds, setIsFollowingIds } = useGetFollowersListInfinite( userId, limit )
    const { data : followings, loading: loadingFollowings, refetch: refetchFollowings, isFollowingIds:isFollowingIdsFromFollowing, setIsFollowingIds : setIsFollowingIdsFromFollowing } = useGetFollowingListInfinite( userId, limit )
    const {user : clerkUser} = useUser()
    const { data : ownerUser } = useFetchOwnerUser({email : clerkUser.emailAddresses[0].emailAddress})

    

    const isOwnersPage = userId === ownerUser.id;


    const handleFollowBack = async (checkFollow, item) => {
        let toUse 
        if (whichList === 'Followers'){
            toUse = item.following
        } else if (whichList === 'Following'){
            toUse = item.follower
        }
        const data = {
        followerId : toUse.id,
        followingId : ownerUser.id
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


  return (
    <SafeAreaView className='w-full h-full bg-primary'>
    <View className='w-full  pt-10 px-6 gap-5' style={{paddingBottom:200}}>
      <View className="gap-3">
          <View className='flex-row gap-2 justify-start items-center'>

            {/* <FilmIcon size={30} color='white' /> */}
            <Text className='text-white font-pbold text-3xl'>Your network</Text>
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

            <FlatList
                showsVerticalScrollIndicator={false}
                data={ whichList === 'Followers' ? followers : (whichList === 'Following' ? followings : [] )}
                refreshControl={<RefreshControl
                    tintColor={Colors.secondary}
                    onRefresh={whichList === 'Followers' ? refetchFollowers : refetchFollowings}
                    refreshing={whichList === 'Followers' ? loadingFollowers : loadingFollowings}
                />}
                keyExtractor={item => item.id}
                contentContainerStyle={{gap:15}}
                renderItem={({item}) => {
                    const checkFollowFromFollower = isFollowingIds.includes( item?.following?.id ) 
                    const checkFollowFromFollowing = isFollowingIdsFromFollowing.includes( item?.follower?.id ) 
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
                                <>
                                    <TouchableOpacity onPress={()=>handleFollowBack( whichList === 'Followers' ? checkFollowFromFollower : checkFollowFromFollowing , item)} style={{backgroundColor:checkFollowFromFollower || checkFollowFromFollowing ?  'transparent' : Colors.secondary, borderWidth:1, borderColor:Colors.secondary,borderRadius:10, padding:5}}>
                                        <Text className='   font-pbold text-sm' style={{color: checkFollowFromFollower || checkFollowFromFollowing ? Colors.secondary : Colors.primary}}>{checkFollowFromFollower || checkFollowFromFollowing ? 'Already following' : isOwnersPage ? 'Follow back' : 'Follow'}</Text>
                                    </TouchableOpacity>

                                </>
                        </View>
                    </TouchableOpacity>
                )}}
            />
            </View>

        </View>
   </SafeAreaView>
  )
}

export default FollowersFollowingsList

const styles = StyleSheet.create({})