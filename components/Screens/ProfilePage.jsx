import { ActivityIndicator, StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView , RefreshControl, Linking,Platform,   InteractionManager} from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGetUser, useGetUserFull } from '../../api/auth'
import { Image } from 'expo-image'
import { avatarFallbackCustom, moviePosterFallback } from '../../constants/Images'
import { parseDept, unparseDept } from '../../lib/parseFilmDept'
import { ChevronRight, Link, MapPin, ShareIcon } from 'lucide-react-native'
import { Colors } from '../../constants/Colors'
import DialogueCard from '../DialogueCard'
import ArrowNextButton from '../ui/ArrowNextButton'
import { FilmIcon, TVIcon, ThreeDotsIcon } from '../../assets/icons/icons'
import { getYear } from '../../lib/formatDate'
import { Star, UserPen, CircleUserRound, UserPlus , UserCheck} from 'lucide-react-native'
import ListCard from '../ListCard'
import { useRouter } from 'expo-router'
import { followUser, unfollowUser } from '../../api/user'
import SetDaysGraph from '../SetDaysGraph'
import { useGetSetDayGraph } from '../../api/setDay'
import ViewShot,{ captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
// import ShareProfileCard from '../ui/ShareProfileCard'
import { shareToInstagramStory } from '../../lib/shareToIGStories'
import Share from "react-native-share";
import ShareProfileCard from '../../components/ui/ShareProfileCard'



const ProfilePage = ({userFetched, refetchUserFetched, loadingUser}) => {

    const {user:ownUserSimple} = useGetUser()
    const {userFull : ownerUser} = useGetUserFull(ownUserSimple?.id)
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const router = useRouter()
    const [ isBlocking, setIsBlocking ] = useState([])
    const [ followCounts, setFollowCounts ] = useState({
        followers : userFetched?.followers?.length,
        following : userFetched?.following?.length
    })
    const {data:setDaysGraphData, refetch:refetchSetDaysGraphData, loading: loadingSetDaysGraphData} = useGetSetDayGraph(userFetched?.id)
    const shareRef = useRef();  
    const viewShotRef = useRef(null);
    const [hasInstagramInstalled, setHasInstagramInstalled] = useState(false); // State to track if Instagram is installed on user's device or not


    const [hiddenShareView, setHiddenShareView] = useState(null)
    const [isSharing, setIsSharing] = useState(false);

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
        if (Platform.OS === "ios") {
        // If platform is IOS then check if instagram is installed on the user's device using the `Linking.canOpenURL` API
            Linking.canOpenURL("instagram://").then((val) =>
            setHasInstagramInstalled(val),
            );


        } else {
        // Else check on android device if instagram is installed in user's device using the `Share.isPackageInstalled` API
            Share.isPackageInstalled("com.instagram.android").then(
            ({ isInstalled }) => setHasInstagramInstalled(isInstalled),
            );
            
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
            params:{ userId : userFetched.id  }
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
            followerId : Number(userFetched.id),
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

    const handleMoreDialogues = () => {
        router.push({
            params : {userId:userFetched.id},
            pathname : 'user/dialogues'
        })
    }
    const handleMoreRecentlyWatched = () => {
        router.push({
            params : {userId:userFetched.id},
            pathname : 'user/recentlyWatched'
        })
    }
    const handleMoreRatings = () => {
        router.push({
            params : {userId:userFetched.id, firstName : userFetched.firstName},
            pathname : 'user/userRatings'
        })
    }
    const handleMoreLists = () => {
        router.push({
            params : {userId:userFetched.id, firstName : userFetched.firstName},
            pathname : 'user/lists'
        })
    }


    const handleFollowersList = (listType) => {
        router.push({
            pathname : `/user/followersPage`,
            params : { listType, userId : userFetched.id }
        })
    }

    const handleGraphPress = () => {
        router.push({
            pathname:`/user/setDays`,
            params : {userId : userFetched.id}
        })
    }

    // const handleShareProfile = async () => {
    //     try {
    //       const uri = await captureRef(shareRef, { format: 'png', quality: 1 });
    //       const res = await Sharing.shareAsync(uri, { mimeType: 'image/png' });
    //       console.log('uri', uri)
    //       console.log('res', res)

    //     } catch (e) {
    //       console.log(e);
    //     }
    // };

  const handleShareProfile = async () => {
    if (!userFetched) return;

    if (!shareRef.current) return;




    try {
      const uri = await captureRef(shareRef, { format: 'png', quality: 1 });

      const data = {
        appId: "1546768846366888", // Note: replace this with your own appId from facebook developer account, it won't work without it. (https://developers.facebook.com/docs/development/register/)
        stickerImage: uri,
        social: Share.Social.INSTAGRAM_STORIES,
        backgroundBottomColor: "#0e1010", // You can use any hexcode here and below
        backgroundTopColor: "#0e1010",
        // backgroundImage: '...', // This field is optional like the other fields (except appId) and you have to put a base64 encoded image here if you want to use it!
      }
        await shareToInstagramStory(data, hasInstagramInstalled)
      //   await Sharing.shareAsync(uri, { mimeType: 'image/png' }); 
    //   console.log('Shared:', uri)
    } catch (e) {
      console.log('Capture failed:', e);
    }

    setShareVisible(false);
  };

//   const handleShareProfile = async () => {
//     if (!userFetched) return;

//     if (!viewShotRef.current) return console.log('Ref not ready!');


//     const { default: ShareProfileCard } = await import('../../components/ui/ShareProfileCard');
//     const shareRef = React.createRef();

//     const shareView = (
//         <ShareProfileCard ref={shareRef} user={userFetched} setDaysData={setDaysGraphData.graphData}/>
//       );    

//       setHiddenShareView(shareView);



//       await new Promise(resolve => requestAnimationFrame(resolve));

//       try {
//         const uri = await captureRef(shareRef, { format: 'png', quality: 1 });
//         await Share.shareSingle({
//           appId: 'YOUR_FACEBOOK_APP_ID',
//           stickerImage: uri,
//           social: Share.Social.INSTAGRAM_STORIES,
//         });
//       } catch (e) {
//         console.log('Capture failed:', e);
//       }
    
//       setHiddenShareView(null); // remove from UI after sharing
//     };


//     try {
//       const uri = await captureRef(viewShotRef, { format: 'png', quality: 1 });

//       const data = {
//         appId: "1546768846366888", // Note: replace this with your own appId from facebook developer account, it won't work without it. (https://developers.facebook.com/docs/development/register/)
//         stickerImage: uri,
//         social: Share.Social.INSTAGRAM_STORIES,
//         backgroundBottomColor: "#0e1010", // You can use any hexcode here and below
//         backgroundTopColor: "#0e1010",
//         // backgroundImage: '...', // This field is optional like the other fields (except appId) and you have to put a base64 encoded image here if you want to use it!
//       }
//       console.log('data', data)
//       console.log('hasInstagraminstalled', hasInstagramInstalled)
//         await shareToInstagramStory(data, hasInstagramInstalled)
//       //   await Sharing.shareAsync(uri, { mimeType: 'image/png' }); 
//     //   console.log('Shared:', uri)
//     } catch (e) {
//       console.log('Capture failed:', e);
//     }

//     setShareVisible(false);
//   };

   

    
    if (!userFetched ){
        return <ActivityIndicator/>
    }
    return (
    <SafeAreaView className='bg-primary flex-1'  edges={['top']}>

            {/* {hiddenShareView && ( */}
            <View style={{ position: 'absolute', top: -9999 }}>
                {/* {hiddenShareView} */}
                <ShareProfileCard ref={shareRef} user={userFetched} setDaysData={setDaysGraphData} totalWorked = {setDaysGraphData?.totalWorked} />
            </View>
            {/* )} */}

     
        <ScrollView 
            refreshControl={
                <RefreshControl
                refreshing={loadingUser}
                onRefresh={refetchUserFetched}
                />
            }
            showsVerticalScrollIndicator={false} 
        >
            <View  className='px-6 h-full  justify-center items-center '>

            <View className='flex flex-col justify-center items-start gap-3 w-full pb-24'>
            <View  style={{ backgroundColor:Colors.primary, borderRadius:30,  flexDirection: 'column', gap: 12, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <View className='flex flex-col gap-3 justify-center items-start mb-4 w-full'>
                    <Image
                        source={{ uri: userFetched?.profilePic  || avatarFallbackCustom}}
                        height={100}
                        width={100}
                        style={{borderRadius:50}}
                    />
                    <View className='gap-0 flex flex-col '>
                        <View className='flex flex-row gap-3 justify-center items-end'>
                            <Text style={{ alignSelf: 'baseline' }}  className='text-secondary font-pbold text-3xl '>{userFetched.firstName}{userFetched?.lastName && ` ${userFetched.lastName}`}</Text>
                            { userFetched?.accountType === 'FILMMAKER' && userFetched?.filmRole?.role ? (
                                <Text style={{ alignSelf: 'baseline', lineHeight: 24 }}
                                className='text-mainGray font-semibold'>{unparseDept(userFetched.filmRole.role)}</Text>
                            ): userFetched?.accountType === 'FILMLOVER' && (
                                <Text style={{ alignSelf: 'baseline', lineHeight: 24 }}
                                className='text-mainGray font-semibold'>Film Lover</Text>
                            )}
                        </View>
                        <Text className='text-white font-bold text-lg  '>@{userFetched.username}</Text>
                    </View>
                    {userFetched?.bio && ( 
                        <Text className='text-mainGrayDark  font-pcourier'>{userFetched?.bio}</Text> 
                    )} 
                    <View className='flex flex-col items-start justify-center gap-3 pt-3 '>
                        { ( userFetched?.locationFormatted ||  userFetched?.city || userFetched?.country) && (
                            <View className='flex flex-row gap-2'>
                                <MapPin  size={16} color={Colors.newLightGray} />
                                <Text className='text-mainGray text-md'>{ userFetched?.locationFormatted ? userFetched.locationFormatted : userFetched?.city ? `${userFetched.city}, ${userFetched.country}` : userFetched?.country && userFetched.country}</Text>
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

                            <TouchableOpacity onPress={handleFollow} style={{ paddingVertical:10, paddingHorizontal:15, backgroundColor:isFollowing ? Colors.secondary : Colors.primaryDark , borderRadius:10,  flexDirection:'row', justifyContent:'center', alignItems:'center', gap:5 }}>

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
                            <TouchableOpacity onPress={handleShareProfile } style={{ paddingVertical:10, paddingHorizontal:10,  backgroundColor:Colors.primaryDark, borderRadius:10, flexDirection:'row', gap:5, justifyContent:'center', alignItems:'center' }}> 
                                    <ShareIcon color={Colors.mainGray}/>
                            </TouchableOpacity>

                        </View>
                    ) }
                </View>

                    {setDaysGraphData?.totalWorked > 0 && (

                        <View >
                            {loadingSetDaysGraphData?.graphData ? (
                                <ActivityIndicator />
                            ) : (
                            <View className=' flex flex-col w-full justify-start items-center gap-3'>
                                <TouchableOpacity onPress={handleGraphPress} className='flex flex-row gap-1 self-start items-center'>
                                        <Text className='text-mainGray font-bold text-xl '>SetDays</Text>
                                    <Text className='text-mainGrayDark  text-sm  pt-1'>({setDaysGraphData.totalWorked} days worked in the last 365 days)</Text>
                                </TouchableOpacity>
                                    <SetDaysGraph data={setDaysGraphData.graphData} loading={loadingSetDaysGraphData} refetch={refetchSetDaysGraphData} />
                            </View>
                            )}
                        </View>
                    )}

                    
                    {/* Recently Watched */}
                    {userFetched?.userWatchedItems?.length > 0 && (
                    <View className=' h-[130px] w-full'>
                        <View className='gap-2'>
                            <TouchableOpacity onPress={handleMoreRecentlyWatched}>
                                <Text className='text-mainGray font-bold text-xl '>Recently Watched</Text>
                            </TouchableOpacity>
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
                        </View>
                    )}

                    </View>

                
                {/* Dialogues */}
                <View className='flex-1 gap-3  w-full'>
                    {userFetched?.dialogues && (
                        <View className='gap-2 justify-start items-start  flex flex-col'>
                            <Text className='text-mainGray font-bold text-xl '>Dialogues  ({userFetched._count.dialogues})</Text>
                            <FlatList
                                data={userFetched.dialogues.slice(0,3)}
                                scrollEnabled={false}
                                key={(item,index) => `${item.title}-${index}`}
                                contentContainerStyle={{gap:10, justifyContent:'center', alignItems:'center', width:'100%'}}
                                renderItem={({item}) => {
                                    return (
                                    <TouchableOpacity onPress={() => handleTitlePress(item)} style={{ marginRight:0 }}>
                                        <DialogueCard dialogue={item} isBackground={true} fromHome={true} isReposted={item.activityType === 'REPOST'} />
                                    </TouchableOpacity>
                                )}}
                                ListFooterComponent={(
                                    <TouchableOpacity onPress={handleMoreDialogues} className='h-[45px] w-[45px] rounded-full justify-center items-center bg-primaryDark self-center'>
                                            <Text className='text-mainGray font-bold  text-xl pb-2'>...</Text>
                                    </TouchableOpacity>
                                )}
                               
                            />
                    </View>
                    )}
                </View>
                
                {/* Ratings & Reviews */}
                <View className='flex-1 pt-8 gap-3'>
                    {userFetched?.ratings?.length > 0 && (
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
                            <TouchableOpacity onPress={handleMoreRatings} className='h-[45] w-[45px] rounded-full justify-center items-center bg-primaryDark self-center'>
                                <Text className='text-mainGray font-bold  text-xl pb-2'>...</Text>
                            </TouchableOpacity>
                    </View>
                    )}
                </View>

                {/* Lists */}
                    {userFetched?.listCreator?.length > 0 && (
                    <View className='flex-1 pt-8 gap-3'>
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
                                    <TouchableOpacity onPress={handleMoreLists}   className='h-[45] w-[45px] rounded-full justify-center items-center bg-primaryDark self-center'>
                                            <Text className='text-mainGray font-bold  text-xl pb-2'>...</Text>
                                    </TouchableOpacity>
                                )}
                               
                            />
                    </View>
                    </View>
                    )}


            </View>
        </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default ProfilePage

const styles = StyleSheet.create({})