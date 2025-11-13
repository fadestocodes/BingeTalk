import { ActivityIndicator, StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView , RefreshControl, Linking} from 'react-native'
import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGetUser, useGetUserFull } from '../../api/auth'
import { Image } from 'expo-image'
import { avatarFallbackCustom, moviePosterFallback } from '../../constants/Images'
import { parseDept, unparseDept } from '../../lib/parseFilmDept'
import { ChevronRight, Link, MapPin } from 'lucide-react-native'
import { Colors } from '../../constants/Colors'
import DialogueCard from '../DialogueCard'
import ArrowNextButton from '../ui/ArrowNextButton'
import { FilmIcon, TVIcon, ThreeDotsIcon } from '../../assets/icons/icons'
import { getYear } from '../../lib/formatDate'
import { Star, UserPen, CircleUserRound, UserPlus , UserCheck} from 'lucide-react-native'
import ListCard from '../ListCard'
import { useRouter } from 'expo-router'


const ProfilePage = ({userFetched, refetchUserFetched, loadingUser}) => {

    const {user:ownUserSimple} = useGetUser()
    const {userFull : ownerUser} = useGetUserFull(ownUserSimple?.id)
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const router = useRouter()
    const [ isBlocking, setIsBlocking ] = useState([])



    const [ isFollowing, setIsFollowing ] = useState(null)

    useEffect(()=>{
        const checkFollow = userFetched?.followers.some( item => item.followingId === ownerUser?.id );
        const userBlockList = ownerUser?.blockedUsers
        const alreadyBlocking = userBlockList?.some( item => item?.userBeingBlocked === userFetched?.id  )
        setIsBlocking(alreadyBlocking)
    if (checkFollow){
        setIsFollowing(true);

    } else {
        setIsFollowing(false)
    }
    }, [userFetched, ownerUser])

    const isOwnersPage = userFetched.id === ownUserSimple?.id


    const isFilmmaker = userFetched?.accountType === 'FILMMAKER'
    // console.log('isfilmamker', userFetched)

    const handleReviewPress = (item) => {
        router.push(`/review/${item.review.id}`)
    }

    const handleAccount = () => {
        router.push({
            pathname:`/user/account/accountHome`,
            params:{ userId : user.id  }
        })
    }

    
    const handleTitlePress = (item) => {
        if (item?.movie){
            router.push(`/movie/${item.movie.tmdbId}`)
        }
        else if  (item?.tv){
            router.push(`/tv/${item.tv.tmdbId}`)
        }
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
    
    const handleEditProfile = () => {
        router.push('/edit-profile')
    }

   
    const handleUserThreeDots = () => {
        router.push({
            pathname:'/user/account/blockUserModal',
            params:{blockedBy : ownerUser.id, userBeingBlocked:userFetched.id, isBlocking}
        })
    }

    const handleLinkPress = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url); // Opens in default browser
        } else {
            Alert.alert("Can't open this URL", url);
        }
    };

    const handleBadgePress = () => {
        router.push('/user/badges/')
    }



    const handleFollowersList = (listType) => {
        router.push({
            pathname : `/user/followersPage`,
            params : { listType, userId : userFetched.id }
        })
    }
    
    if (!userFetched ){
        return <ActivityIndicator/>
    }
    return (
    <SafeAreaView className='bg-primary flex-1'  edges={['top']}>
        <ScrollView 
            refreshControl={
                <RefreshControl
                refreshing={loadingUser}
                onRefresh={refetchUserFetched}
                />
            }
            showsVerticalScrollIndicator={false} 
        >
            <View className='px-6 h-full pt-4  justify-center items-center '>

            <View className='flex flex-col justify-center items-start gap-3 w-full'>

                <View className='flex flex-col gap-3 justify-center items-start'>
                    <Image
                        source={{ uri: userFetched?.profilePic  || avatarFallbackCustom}}
                        height={100}
                        width={100}
                        style={{borderRadius:50}}
                    />
                    <View className='gap-0 flex flex-col '>
                        <View className='flex flex-row gap-3 justify-center items-end'>
                            <Text style={{ alignSelf: 'baseline' }}  className='text-secondary font-pbold text-3xl '>{userFetched.firstName}{userFetched?.lastName && ` ${userFetched.lastName}`}</Text>
                            { isFilmmaker ? (
                                <Text style={{ alignSelf: 'baseline', lineHeight: 24 }}
                                className='text-mainGray font-semibold'>{unparseDept(userFetched.filmRole.role)}</Text>
                            ):(
                                <Text style={{ alignSelf: 'baseline', lineHeight: 24 }}
                                className='text-mainGray font-semibold'>Film Lover</Text>
                            )}
                        </View>
                        <Text className='text-white font-bold text-lg  '>@{userFetched.username}</Text>
                    </View>
                    {userFetched?.bio && ( 
                        <Text className='text-mainGrayLight opacity-50 font-pcourier'>{userFetched?.bio}</Text> 
                    )} 
                    <View className='flex flex-col items-start justify-center gap-3 pt-3 '>
                        { (userFetched?.city || userFetched?.country) && (
                            <View className='flex flex-row gap-2'>
                                <MapPin  size={16} color={Colors.newLightGray} />
                                <Text className='text-mainGray text-md'>{userFetched?.city ? `${userFetched.city}, ${userFetched.country}` : userFetched?.country && userFetched.country}</Text>
                            </View>
                        ) }
                        { userFetched?.bioLink && (
                        <TouchableOpacity onPress={()=>handleLinkPress(userFetched.bioLink)} className='flex flex-row gap-2'>
                            <Link size={16} color={Colors.newLightGray}/>
                            <Text className='text-mainGray text-md'>{userFetched.bioLink}</Text>
                        </TouchableOpacity>
                        )}
                        <View className='flex flex-row gap-2 justify-center items-center'>
                            <TouchableOpacity onPress={()=>handleFollowersList('Followers')} className='flex flex-row gap-2 justify-center items-center'>
                                <Text className='text-mainGray text-md font-bold'>{ userFetched.followers.length }</Text>
                                <Text className='text-mainGray text-md font-bold'>{ userFetched.followers.length > 0 ? 'Follower' :  'Followers'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>handleFollowersList('Following')} className='flex flex-row gap-2 justify-center items-center'>
                                <Text className='text-mainGray text-md font-bold'>{ userFetched.following.length }</Text>
                                <Text className='text-mainGray text-md font-bold'>{ 'Following'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    { !isOwnersPage ? (
                        <View className='flex-row gap-2 pt-4 items-center'>

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
                           
                            <TouchableOpacity onPress={handleUserThreeDots} style={{paddingLeft:10}}>
                                <ThreeDotsIcon size={22} color={Colors.mainGray} />
                            </TouchableOpacity>

                        </View>
                    ) : (
                        <View className='flex-row gap-2 '>
                            <TouchableOpacity onPress={handleEditProfile} style={{ paddingVertical:10, paddingHorizontal:10, backgroundColor:Colors.primaryDark, borderRadius:10, flexDirection:'row', gap:5, justifyContent:'center', alignItems:'center' }} >
                                <UserPen color={Colors.mainGray} size={16}/>
                                <Text style={{fontWeight:'bold', fontFamily:'Geist-Medium' ,color:Colors.mainGray  }}>Edit profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleAccount}  style={{ paddingVertical:10, paddingHorizontal:10, backgroundColor:Colors.primaryDark, borderRadius:10, flexDirection:'row', gap:5, justifyContent:'center', alignItems:'center' }} >
                            <CircleUserRound color={Colors.mainGray} size={16}/>
                                    <Text className='' style={{fontWeight:'bold', fontFamily:'Geist-Medium' ,color:Colors.mainGray}}>Account</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleBadgePress } style={{ paddingVertical:10, paddingHorizontal:10,  backgroundColor:Colors.primaryDark, borderRadius:10, flexDirection:'row', gap:5, justifyContent:'center', alignItems:'center' }}> 
                                    <Text className='' style={{fontWeight:'bold', fontFamily:'Geist-Medium' ,color:Colors.mainGray}}>Badges</Text>
                            </TouchableOpacity>

                        </View>
                    ) }
                </View>

                {/* Recently Watched */}
                <View className=' h-[150px] w-full pt-4'>
                    
                    {userFetched?.userWatchedItems && (
                        <View className='gap-2'>
                            <Text className='text-mainGray font-bold text-xl '>Recently Watched</Text>
                            <FlatList
                                data={userFetched.userWatchedItems}
                                horizontal
                                key={(item,index) => `${item.title}-${index}`}
                                contentContainerStyle={{gap:10}}
                                renderItem={({item}) => {
                                    return (
                                    <TouchableOpacity onPress={() => handleTitlePress(item)} style={{ marginRight:10 }}>
                                        <Image
                                            source={{uri: item.movie ? `${posterURLlow}${item?.movie?.posterPath}` : item.tv ? `${posterURLlow}${item.tv.posterPath}` : moviePosterFallback }}
                                            placeholder={moviePosterFallback}
                                            contentFit='cover'
                                            style={{ width:50, height:80, borderRadius:10, overflow:'hidden' }}
                                        />
                                    </TouchableOpacity>
                                
                                )}}
                               
                            />
                        </View>
                    )}

                </View>
                
                {/* Dialogues */}
                <View className='flex-1 gap-3 '>
                    {userFetched?.dialogues && (
                        <View className='gap-2 justify-start items-start  flex flex-col'>
                            <Text className='text-mainGray font-bold text-xl '>Dialogues  ({userFetched._count.dialogues})</Text>
                            <FlatList
                                data={userFetched.dialogues.slice(0,3)}
                                scrollEnabled={false}
                                key={(item,index) => `${item.title}-${index}`}
                                contentContainerStyle={{gap:10}}
                                renderItem={({item}) => {
                                    return (
                                    <TouchableOpacity onPress={() => handleTitlePress(item)} style={{ marginRight:10 }}>
                                        <DialogueCard dialogue={item} isBackground={true} fromHome={true} isReposted={item.activityType === 'REPOST'} />
                                    </TouchableOpacity>
                                )}}
                                ListFooterComponent={(
                                    <View className='h-[45px] w-[45px] rounded-full justify-center items-center bg-primaryDark self-center'>
                                            <Text className='text-mainGray font-bold  text-xl pb-2'>...</Text>
                                    </View>
                                )}
                               
                            />
                    </View>
                    )}
                </View>
                
                {/* Ratings & Reviews */}
                <View className='flex-1 pt-8 gap-3'>
                    {userFetched?.ratings && (
                        <View className='gap-2 justify-start items-start  flex flex-col'>
                            <View className='flex flex-row gap-2 justify-center items-center'>
                                <Text className='text-mainGray font-bold text-xl '>Ratings & Reviews ({userFetched._count.ratings})</Text>
                            </View>
                            <FlatList
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                                data={userFetched.ratings}
                                keyExtractor={item => item.id}
                                contentContainerStyle={{gap:15, paddingTop:20,paddingHorizontal:20, paddingBottom:20, backgroundColor:Colors.mainGrayDark, borderRadius:15}}
                                onEndReachedThreshold={0}
                                renderItem={({item,index}) => {
                                    return(
                                    <View className='flex flex-col gap-3'>
                                        { index !== 0 && (
                                            <View className='h-[2px] bg-primaryLight w-full ' />
                                        ) }
                                        <View className="flex-row w-full justify-between items-center gap-2">
                                            <TouchableOpacity  onPress={()=>{handleTitlePress(item)}} className='flex-row gap-2 justify-center items-center'>
                                                <View className='flex-row gap-3 justify-center items-center'>
                                                    <Image
                                                    source={{ uri: `${posterURL}${item.movie ? item.movie.posterPath : item.tv && item.tv.posterPath }` }}
                                                    placeholder={moviePosterFallback}

                                                    contentFit='cover'
                                                    style={{ width:40, height:55, borderRadius:8 }}
                                                    />
                                                    <View className='flex-row gap-2' style={{width:120}}>
                                                        { item.movie ? (
                                                            <FilmIcon size={16} color={Colors.secondary} />
                                                        ) : item.tv && (
                                                            <TVIcon size={16} color={Colors.secondary} />
                                                        ) }
                                                        <Text className='text-mainGray  text-sm font-pbold'>{item?.movie?.title || item?.tv?.title} ({ getYear(item?.movie?.releaseDate || item?.tv?.releaseDate)})</Text>
                                                    </View>
                                                </View>
                                                
                                            </TouchableOpacity>
                                            <View className='flex-row gap-5 justify-center items-center'>
                                                <View className='flex-row justify-center items-center gap-2'>
                                                    <Star size={20} color={Colors.secondary}/>
                                                    <Text className='text-mainGray text-3xl font-pbold'>{item.rating}</Text>
                                                </View>                            
                                                { isOwnersPage ? (
                                                <TouchableOpacity onPress={()=>handleThreeDots(item)}>
                                                    <ThreeDotsIcon size={18} color={Colors.mainGray} />
                                                </TouchableOpacity>
                                                ) : (
                                                    <View />
                                                ) }
                                            </View>
                                        </View>
                                        { item.review?.review && (
                                        <TouchableOpacity onPress={()=>handleReviewPress(item)}>
                                            <Text className='text-white font-pcourier py-2 px-4' numberOfLines={5}>{item.review.review}</Text>
                                        </TouchableOpacity>
                                        ) }
                                    </View>
                                    )}}
                            />
                            <View className='h-[45] w-[45px] rounded-full justify-center items-center bg-primaryDark self-center'>
                                <Text className='text-mainGray font-bold  text-xl pb-2'>...</Text>
                            </View>
                    </View>
                    )}
                </View>

                {/* Lists */}
                <View className='flex-1 pt-8 gap-3'>
                    {userFetched?.listCreator?.length > 0 && (
                        <View className='gap-2 justify-start items-start  flex flex-col'>
                            <Text className='text-mainGray font-bold text-xl '>Lists ({userFetched.listCreator.length})</Text>
                            <FlatList
                                data={userFetched.listCreator}
                                scrollEnabled={false}
                                key={(item,index) => `${item.title}-${index}`}
                                contentContainerStyle={{gap:10}}
                                renderItem={({item}) => {
                                    return (
                                    <TouchableOpacity  style={{ marginRight:0 }}>
                                        <ListCard list={item} />
                                    </TouchableOpacity>
                                )}}
                                ListFooterComponent={(
                                    <TouchableOpacity    className='h-[45] w-[45px] rounded-full justify-center items-center bg-primaryDark self-center'>
                                            <Text className='text-mainGray font-bold  text-xl pb-2'>...</Text>
                                    </TouchableOpacity>
                                )}
                               
                            />
                    </View>
                    )}
                </View>


            </View>
        </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default ProfilePage

const styles = StyleSheet.create({})