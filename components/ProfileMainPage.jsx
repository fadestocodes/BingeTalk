import {  Text, View, FlatList, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard , Linking} from 'react-native'
import { ImageBackground,  } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import React, {useEffect, useState} from 'react'
import {feed} from '../lib/fakeData'
import { RepostIcon, UpIcon, DownIcon, PrayingHandsIcon, MessageIcon, ArrowUpIcon, ArrowDownIcon, ThreeDotsIcon } from '../assets/icons/icons'
import { Colors } from '../constants/Colors'
import { Redirect } from 'expo-router'
import { useRouter } from 'expo-router'
import { LinkIcon } from '../assets/icons/icons'
import { useUserDB } from '../lib/UserDBContext'
import { fetchUser, useCheckBadgeNotifications, useFetchOwnerUser, useGetAuteurProgression, useGetBadges, useGetConversationalistProgression, useGetCriticProgression, useGetCuratorProgression, useGetHistorianProgression, useGetPeoplesChoiceProgression } from '../api/user'
import { formatDate } from '../lib/formatDate'
import DialogueCard from './DialogueCard'
import { useFetchDialogues } from '../api/dialogue'
import { useFetchUser } from '../api/user'
import { followUser, unfollowUser } from '../api/user'
import { UserCheck, UserPlus,Send, UserPen,  LogOut, CircleUserRound } from 'lucide-react-native'; // Example icons
import { useGetProfileFeed } from '../api/feed'
import ListCard from './ListCard'
import { usePostRemoveContext } from '../lib/PostToRemoveContext'
import { avatarFallback } from '../lib/fallbackImages'
import { avatarFallbackCustom, moviePosterFallback } from '../constants/Images'
import ReviewCard from './Screens/ReviewCard'
import { useGetUser, useGetUserFull } from '../api/auth'
 

    const ProfileMainPage = ( { user, refetchUser, isFetchingUser } ) => {

    


        const {user:userSimple,refetch:refetchUserHook} = useGetUser()
        const {userFull:ownerUser, loading:loadingUser} = useGetUserFull(userSimple?.id)


        const router = useRouter();
        const posterURL = 'https://image.tmdb.org/t/p/original';
        const isOwnersProfilePage = user?.id === userSimple?.id
        const [ isFollowing, setIsFollowing ] = useState(null)
        const { data : profileDialogues, hasMore, refetch:refetchFeed, loading, removeItem , fetchMore} = useGetProfileFeed(user?.id, 15)
        const [ followCounts, setFollowCounts ] = useState({
            followers : user?.followers?.length,
            following : user?.following?.length
        })
        const {criticProgression} = useGetCriticProgression(user?.id)
        const {historianProgression} = useGetHistorianProgression(user?.id)
        const {curatorProgression} = useGetCuratorProgression(user?.id)
        const {auteurProgression} = useGetAuteurProgression(user?.id)
        const {conversationalistProgression} = useGetConversationalistProgression(user?.id)
        const {badgeNotifications} = useCheckBadgeNotifications(user?.id)
        const {peoplesChoiceProgression} = useGetPeoplesChoiceProgression(user?.id)
        const {badgeList} = useGetBadges(user?.id)

        const [ refreshingPage, setRefreshingPage ] = useState(false)

        const { postToRemove, updatePostToRemove } = usePostRemoveContext()
        const [ isBlocking, setIsBlocking ] = useState([])
        const [ ratingsLength, setRatingsLength ] = useState(0)

        useEffect(()=>{
            const checkFollow = user?.followers.some( item => item.followingId === ownerUser?.id );
            const userBlockList = ownerUser?.blockedUsers
            const alreadyBlocking = userBlockList?.some( item => item?.userBeingBlocked === user?.id  )
            setIsBlocking(alreadyBlocking)
            const ratingsLengthData = user?.ratings?.length
            setRatingsLength(ratingsLengthData)
        if (checkFollow){
            setIsFollowing(true);

        } else {
            setIsFollowing(false)
        }
        }, [user, ownerUser])


        useEffect(()=>{
            removeItem( postToRemove.id, postToRemove.postType )
        },[postToRemove])
       

       
        const handleRotationPress = (item) => {
            if (item.movie) {
                router.push(`/movie/${item.movieTMDBId}`)
            } else if (item.tv) {
                router.push(`/tv/${item.tvTMDBId}`)
            }
        }

        

        const handleItemPress = (item) => {
            if(item.dialogueInteractions){
                router.push(`/dialogue/${item.id}`)
            } else if (item.threadInteractions){
                router.push(`/threads/${item.id}`)
            } else if (item.listInteractions){
                router.push(`/list/${item.id}`)
            }
        }

        const handleEditProfile = () => {
            router.push('/edit-profile')
        }

        const handleFollow = async () => {

            const followData = {
                followerId : Number(user.id),
                followingId : Number(ownerUser?.id)
            }
            if (isFollowing){
                const unfollow = await unfollowUser( followData )
                setFollowCounts(prev => ({
                    ...prev,
                    followers : prev.followers - 1,
                }))
            } else {
                const follow = await followUser( followData )
                setFollowCounts(prev => ({
                    ...prev,
                    followers : prev.followers + 1
                }))
            }
            setIsFollowing(prev => !prev)
        }
    
        const handleLinkPress = async (url) => {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url); // Opens in default browser
            } else {
                Alert.alert("Can't open this URL", url);
            }
        };

        const handleFollowersList = (listType) => {
            router.push({
                pathname : `/user/followersPage`,
                params : { listType, userId : user.id }
            })
        }

        const handleAccount = () => {
            router.push({
                pathname:`/user/account/accountHome`,
                params:{ userId : user.id  }
            })
        }


        const handleThreeDots = () => {
            router.push({
                pathname:'/user/account/blockUserModal',
                params:{blockedBy : ownerUser.id, userBeingBlocked:user.id, isBlocking}
            })
        }

        const handleUserRatings = () => {
            router.push({
                pathname:'/user/userRatings',
                params:{userId:user.id, firstName : user.firstName}
            })
        }
        
        const handleBadgePress = () => {
            router.push('/user/badges/')
        }


  return (

    <View className='w-full h-full bg-primary' style={{paddingBottom:0}}>
        { !ownerUser || isFetchingUser ? (
            <View className="bg-primary w-full h-full justify-center items-center">
            <ActivityIndicator></ActivityIndicator>
        </View>
        ) : (

        <FlatList
            data={profileDialogues}
            refreshControl={
                <RefreshControl
                tintColor={Colors.secondary}
                refreshing={isFetchingUser}
                onRefresh={()=>{console.log('refreshinguser...');refetchUser(); refetchFeed()}} 
                />
                }
            onEndReached={()=> {
                    fetchMore()
            }}
            initialNumToRender={10}
            windowSize={8}
            onEndReachedThreshold={0.3}
            keyboardShouldPersistTaps="handled" 
            keyExtractor={ (item,index) => `${item.id}-${index}` }
            ListHeaderComponent={(
               
                <View className='justify-center items-center flex gap-3 ' style={{  marginTop:0, overflow:'hidden'}}>
                    <Image
                        style={{
                        width: '100%',
                        top:0,
                        height: 400,
                        position: 'absolute',
                        borderRadius:30
                        }}
                        source={{ uri: user?.profilePic  || avatarFallbackCustom}}
                        contentFit="cover" // Same as resizeMode='cover'
                        transition={300} // Optional: Adds a fade-in effect
                    />
                    <LinearGradient
                        colors={['transparent', Colors.primary]}
                        style={{
                        height: 400,
                        width: '100%',
                        position: 'absolute',
                        top:0,
                        }}
                    />
                    <View className='px-4 items-center ' style={{marginTop:275, gap:15}}>
                        
                        <View className='items-center' style={{gap:10}}>
                            <View className='gap-1 justify-center items-center '>
                                <Text className='text-secondary font-pblack text-2xl'>{user.firstName} {user.lastName}</Text>
                                <Text className='text-white font-pbold ' >@{user.username}</Text>
                            </View>
                            { user.bio && (
                                <Text className='text-third font-pcourier leading-5 ' style={{paddingHorizontal:20}}>{user.bio}</Text>
                            ) }
                        </View>
                        { user.bioLink && (
                        <TouchableOpacity onPress={()=>handleLinkPress(user.bioLink)} className='flex-row gap-2 opacity-60 mt-5'  style={{backgroundColor:'black', paddingVertical:5, paddingHorizontal:20, borderRadius:10}}>
                            <LinkIcon size={16} color={Colors.mainGray} />
                            <Text className='text-mainGray text-sm  font-psemibold' >{user.bioLink}</Text>
                        </TouchableOpacity>
                        ) }
                        <View className='flex-row gap-6' style={{marginTop:0}}>
                            <TouchableOpacity onPress={()=>handleFollowersList('Followers')} className='flex-row gap-2 justify-center items-center'>
                                <Text className='text-gray-400 text-lg font-pblack'>{followCounts.followers}</Text>
                                <Text className='text-gray-400 text-lg font-psemibold'>Followers</Text>
                            </TouchableOpacity >
                            <TouchableOpacity onPress={()=>handleFollowersList('Following')} className='flex-row gap-2 justify-center items-center'>
                                <Text className='text-gray-400 text-lg font-pblack'>{followCounts.following}</Text>
                                <Text className='text-gray-400 text-lg font-psemibold'>Following</Text>
                            </TouchableOpacity >
                            <TouchableOpacity onPress={handleUserRatings}  className='flex-row gap-2 justify-center items-center'>
                            <Text className='text-gray-400 text-lg font-pblack'>{ratingsLength}</Text>
                            <Text className='text-gray-400 text-lg font-psemibold'>Ratings</Text>
                            </TouchableOpacity>
                           
                        </View>
                        <View className='w-full justify-center items-center mt-4' >
                            <Text className='font-pbold text-mainGray'>Current Rotation</Text>
                            { user.currentRotation.length > 0 ? (
                            <FlatList
                                data={user.currentRotation}
                                horizontal
                              
                                contentContainerStyle={{ width:'100%', height:100, justifyContent:'center', alignItems:'center' }}
                                scrollEnabled={false}
                                keyExtractor={item => item.id}
                                renderItem={ ({item}) => {
                                    // console.log('ROTATIONITEM', item)
                                    return (
    
                                    <TouchableOpacity onPress={() => handleRotationPress(item)} style={{ marginRight:10 }}>
                                        <Image
                                            source={{uri: item.movie ? `${posterURL}${item?.movie?.posterPath}` : item.tv ? `${posterURL}${item.tv.posterPath}` : moviePosterFallback }}
                                            placeholder={moviePosterFallback}
                                            contentFit='cover'
                                            style={{ width:50, height:80, borderRadius:10, overflow:'hidden' }}
                                        />
                                    </TouchableOpacity>
                                ) }}
                            >
    
                            </FlatList>

                            ) : (
                                <Text className='text-mainGray text-sm mb-5'>(No titles added)</Text>
                            ) }
                        </View>
                    </View>

                    { isOwnersProfilePage ? (
                    <View className='flex-row gap-2 mb-10'>
                        <TouchableOpacity onPress={handleEditProfile} style={{ paddingVertical:6, paddingHorizontal:10, borderWidth:1.5, borderColor:Colors.mainGray, borderRadius:10, flexDirection:'row', gap:5, justifyContent:'center', alignItems:'center' }} >
                            <UserPen color={Colors.mainGray} size={16}/>
                            <Text style={{fontWeight:'bold', fontFamily:'Geist-Medium' ,color:Colors.mainGray  }}>Edit profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleAccount}  style={{ paddingVertical:6, paddingHorizontal:10, borderWidth:1.5, borderColor:Colors.mainGray, borderRadius:10, flexDirection:'row', gap:5, justifyContent:'center', alignItems:'center' }} >
                        <CircleUserRound color={Colors.mainGray} size={16}/>
                                <Text className='' style={{fontWeight:'bold', fontFamily:'Geist-Medium' ,color:Colors.mainGray}}>Account</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleBadgePress } style={{ paddingVertical:6, paddingHorizontal:10, borderWidth:1.5, borderColor:Colors.mainGray, borderRadius:10, flexDirection:'row', gap:5, justifyContent:'center', alignItems:'center' }}> 
                                <Text className='' style={{fontWeight:'bold', fontFamily:'Geist-Medium' ,color:Colors.mainGray}}>Badges</Text>
                        </TouchableOpacity>

                    </View>
                    ) :(
                        <View className='flex-row gap-2 mb-10 items-center'>

                            <TouchableOpacity onPress={handleFollow} style={{ paddingVertical:6, paddingHorizontal:10, borderWidth:1.5, backgroundColor:isFollowing ? Colors.secondary : null , borderColor:Colors.secondary, borderRadius:10,  flexDirection:'row', justifyContent:'center', alignItems:'center', gap:5 }}>

                                 { isFollowing ? (
                                    < View  className='flex-row gap-3'>
                                    <UserCheck strokeWidth={2.5} color={ isFollowing ? Colors.primary : Colors.secondary} size={18}/>
                                    <Text style={{fontWeight:'bold', fontFamily:'Geist-Medium' ,color:Colors.primary }} >Following</Text>
                                    </View>
                                ) : (
                                    <View  className='flex-row gap-3'>
                                    <UserPlus strokeWidth={2.5} color={Colors.secondary} size={18} />
                                    <Text style={{fontWeight:'bold', fontFamily:'Geist-Medium' ,color:Colors.secondary }} >Follow</Text>
                                    </View>
                                ) } 
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={{ paddingVertical:6, paddingHorizontal:10, borderWidth:1.5, borderColor:Colors.secondary, borderRadius:10, flexDirection:'row', justifyContent:'center', alignItems:'center', gap:5 }}>
                                <Send color={Colors.secondary} size={18} ></Send><Text style={{ fontWeight:'bold', fontFamily:'Geist-Medium', color:Colors.secondary  }}>Message</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={handleThreeDots} style={{paddingLeft:10}}>
                                <ThreeDotsIcon size={22} color={Colors.mainGray} />
                            </TouchableOpacity>

                        </View>
                    )}
    
                   
    
                </View>
            )}
            contentContainerStyle={{gap:15}}
            renderItem={({item}) => {
                // console.log("FLATLISTITEM", item)
            return (
                <>
                { item.feedType === 'dialogue' ? (

                    <TouchableOpacity key={item.id} onPress={()=>{handleItemPress(item)}}  style={{ paddingHorizontal:15 }}>
                        <DialogueCard  dialogue={item}  isBackground={true} isReposted={ item.repostDate }  />
                    </TouchableOpacity>

                ) : item?.feedType === 'list' ?  (
                
                    <TouchableOpacity key={item.id} onPress={()=>{handleItemPress(item)}}  style={{ paddingHorizontal:15 }}>
                        <ListCard  list={item}  isReposted={item.repostDate} pressDisabled={true} />
                    </TouchableOpacity>
                ) : item?.feedType === 'review' && (
                    <TouchableOpacity onPress={()=>{router.push(`review/${item.id}`)}} isReposted={item.activityType === 'REPOST'} style={{paddingHorizontal:15}}>
                        <ReviewCard review={item} fromHome={false} cardStyle={true} isBackground={true} />
                    </TouchableOpacity>
                )} 
                </>
            ) }}
            >
    
    
    
        </FlatList>

        ) }
    </View>
  )
}

export default ProfileMainPage
