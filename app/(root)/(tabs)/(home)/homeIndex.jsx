import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView,  } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { homeCategories } from '../../../../lib/CategoryOptions'
import { Colors } from '../../../../constants/Colors';
import { useGetFeed } from '../../../../api/feed';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as nodeServer from '../../../../lib/ipaddresses'
import DialogueCard from '../../../../components/DialogueCard';
import { formatDate } from '../../../../lib/formatDate';

import { Eye, EyeOff, ListChecks, Handshake, Star, Ellipsis , List, MessagesSquare, Heart, EllipsisVertical} from 'lucide-react-native'
import { ProgressCheckIcon, ThumbsUp, ThumbsDown, MessageIcon, RepostIcon, TVIcon , FilmIcon } from '../../../../assets/icons/icons';
import ListCard from '../../../../components/ListCard';
import { toPascalCase } from '../../../../lib/ToPascalCase';
import { getAllNotifs, useGetAllNotifs } from '../../../../api/notification';
import { likeActivity } from '../../../../api/activity';
import ActivityCard2 from '../../../../components/ActivityCard2';
import { useNotificationCountContext } from '../../../../lib/NotificationCountContext';
import debounce from 'lodash.debounce';
import ReviewCard from '../../../../components/Screens/ReviewCard';
import { avatarFallback } from '../../../../lib/fallbackImages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import WhatsNewModal from '../../../../components/Screens/WhatsNewModal';
import { avatarFallbackCustom } from '../../../../constants/Images';
import { apiFetch, clearAuthTokens, useGetUser, useGetUserFull, useSignOutUser } from '../../../../api/auth';
import { deleteInterested, useCheckBadgeNotifications, useGetAuteurProgression, useGetBadges, useGetConversationalistProgression, useGetCriticProgression, useGetCuratorProgression, useGetHistorianProgression, useGetInterestedItems, useGetPeoplesChoiceProgression, useGetWatchlistItems } from '../../../../api/user';
import { LinearGradient } from 'expo-linear-gradient';
import { getYear } from '../../../../lib/formatDate';
import { markMovieWatchlist } from '../../../../api/movie';
import { markTVWatchlist } from '../../../../api/tv';
import SetDayCard from '../../../../components/SetDayCard';


// import { ratingToReview } from '../../constants/Images' 




const homeIndex = () => {
  const { notifCount, updateNotifCount } = useNotificationCountContext()
    const [selected, setSelected] = useState('Feed');
    const {user, updateUser } = useGetUser()
    const {userFull:ownerUser, refetch:refetchOwner} = useGetUserFull(user?.id)
   

    const { data : watchlistItems, loading:loadingWatchlist, refetch:refetchWatchlist, hasMore:hasMoreWatchlist, fetchMore:fetchMoreWatchlist, removeItem:removeWatchlist } = useGetWatchlistItems(ownerUser?.id)
    const { data : interestedItems, loading:loadingInterested, refetch:refetchInterested, hasMore:hasMoreInterested,removeItem:removeInterested, fetchMore :fetchMoreInterested } = useGetInterestedItems(ownerUser?.id)
    const router = useRouter()
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    // const [ hasMore, setHasMore ] = useState(true);
    const [ hasMoreFeed, setHasMoreFeed ] = useState(true)
    const [ hasMoreSetDays, setHasMoreSetDays ] = useState(true)
    // const [ cursor, setCursor ] = useState(null);
    const [ feedCursor, setFeedCursor ] = useState(null);
    const [ setDaysCursor, setSetDaysCursor ] = useState(null);
    const [ unreadNotifs, setUnreadNotifs ]  = useState([])
    const flatListRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [ shouldShowWhatsNew, setShouldShowWhatsNew ] = useState(false)

    const {criticProgression} = useGetCriticProgression(user?.id)
    const {historianProgression} = useGetHistorianProgression(user?.id)
    const {curatorProgression} = useGetCuratorProgression(user?.id)
    const {auteurProgression} = useGetAuteurProgression(user?.id)
    const {conversationalistProgression} = useGetConversationalistProgression(user?.id)
    const {badgeNotifications} = useCheckBadgeNotifications(user?.id)
    const {peoplesChoiceProgression} = useGetPeoplesChoiceProgression(user?.id)
    const {badgeList} = useGetBadges(user?.id)

    const {signOutUser} = useSignOutUser()


    const WHATS_NEW_KEY = 'ALREADY_SHOWN_WHATS_NEW';
    const CURRENT_APP_VERSION = Constants.expoConfig.version     // e.g., '1.3.0'
    // console.log(`CURRENT VERSION: ${CURRENT_APP_VERSION}`)


    const getFeed = async () => {
      if (!hasMoreFeed && !hasMoreSetDays  )return 

        try {
          setLoading(true)
          const notifsData = await getAllNotifs( ownerUser?.id, null , true, updateNotifCount )
          const unread = notifsData.filter( item => item.isRead === false)
          setUnreadNotifs(unread)
        } catch (e) {
          console.error('error fetchign notifs', e)
        }
        try {
            const request = await apiFetch(`${nodeServer.currentIP}/feed?userId=${ownerUser?.id}&limit=15&feedCursor=${feedCursor}&setDaysCursor=${setDaysCursor}&hasMoreFeed=${hasMoreFeed}&hasMoreSetDays=${hasMoreSetDays}`);
            const response = await request.json();
            setData( prev => [ ...prev, ...response.items ] );
            setFeedCursor(response.nextFeedCursorServer)
            setSetDaysCursor(response.nextSetDaysCursorServer)
            setHasMoreFeed(!!response.nextFeedCursorServer)
            setHasMoreSetDays(!!response.nextSetDaysCursorServer)


        } catch (err) {
            console.log(err)
        } finally {
          setLoading(false);
        }
    }

    const refetchFeed = async () => {
      try {
        setLoading(true)
        // await refetchOwner();
        const notifsData = await getAllNotifs( ownerUser?.id, null , true, updateNotifCount )
        const unread = notifsData.filter( item => item.isRead === false)
        setUnreadNotifs(unread)
        const request = await apiFetch(`${nodeServer.currentIP}/feed?userId=${ownerUser?.id}&limit=15&feedCursor=null&setDaysCursor=null&hasMoreFeed=true&hasMoreSetDays=true`);
        const response = await request.json();
        setData( response.items );
        setFeedCursor(response.nextFeedCursorServer)
        setSetDaysCursor(response.nextSetDaysCursorServer)
        setHasMoreFeed(!!response.nextFeedCursorServer)
        setHasMoreSetDays(!!response.nextSetDaysCursorServer)

    } catch (err) {
        console.log(err)
    }
      setLoading(false);
    }

    const checkWhatsNew = async () => {

      const alreadyShown = await AsyncStorage.getItem(WHATS_NEW_KEY)

     
      
      if ( CURRENT_APP_VERSION === '2.0.0' && (!alreadyShown || (alreadyShown && alreadyShown !== CURRENT_APP_VERSION) )){
        
        setShouldShowWhatsNew(true)
      } 


    }

    const closeWhatsNew = async () => {
      await AsyncStorage.setItem(WHATS_NEW_KEY, CURRENT_APP_VERSION)
      setShouldShowWhatsNew(null)
    }




    useEffect(() => {
      
      
        if (ownerUser){
          refetchFeed()
        }
        checkWhatsNew()
        
    }, [ownerUser])

     
    const isEmpty =
      (selected === 'Feed' && data.length < 1) ||
      (selected === 'Watchlist' && watchlistItems.length < 1) ||
      (selected === 'Interested' && interestedItems.length < 1);


    
    const handlePosterPress = (item) => {
      if (item?.movie || item?.rating?.movie){
        router.push(`/(home)/movie/${item?.movie?.tmdbId || item?.rating?.movie?.tmdbId}`)
      } else if (item?.tv || item?.rating?.tv ){
        router.push(`/(home)/tv/${item?.tv?.tmdbId || item?.rating?.tv?.tmdbId }`)
      }
    }

    const handleLike = async (item) => {
      const likeData = {
        userId : ownerUser?.id,
        activityId : item.id
      }
      const likedActivity = await likeActivity(likeData)
      // refetchOwner()
      await refetchFeed()
    } 

    const handlePress =(item) => {

      if (item.dialogue){
        router.push(`(home)/dialogue/${item.dialogue.id}`)
      } else if (item.threads){
        router.push(`(home)/threads/${item.threads.id}`)
      } else if (item.feedFrom === 'threadFromWatched' || item.feedFrom === 'threadFromRotations'){
        router.push(`(home)/threads/${item.id}`)
      } else if (item.review){
        router.push(`(home)/review/${item.id}`)
      }
    } 

    const debouncedGetFeed = debounce(async () => {
      if (!loading) {
        await getFeed();
      }
    }, 500); 


    const handleRemove = async (item) => {

      if (selected === 'Interested'){
        const data = {
            userId : Number(ownerUser.id),
            movieId : item.movieId || null,
            tvId : item.tvId
        }
        const deletedItem = await deleteInterested(data)
        removeInterested(item)
      } else if (selected === 'Watchlist'){
        if (item.movie){
          const data = {
              movieId : item.movie.id,
              userId : Number(ownerUser.id)
          }
          const removedMovie = await markMovieWatchlist(data)
          removeWatchlist(item)

        } else if(item.tv){
            const data = {
                tvId : item.tv.id,
                userId : Number(ownerUser.id)
            }
            const removedMovie = await markTVWatchlist(data)
            removeWatchlist(item)
        }
      }
    } 

    const handleTitlePress = (item) => {
      if (item.movie){
        router.push(`/movie/${item.movie.tmdbId}`)
      }
      if (item.tv){
        router.push(`/tv/${item.tv.tmdbId}`)
      }
    }

    const handleSetDayPress = (item) => {
      router.push(`/setDay/${item.id}`)
    }



  
    if (!ownerUser){
      return <ActivityIndicator />
    }

  return (
    <SafeAreaView className='w-full h-full bg-primary' >
    
        <>
        { shouldShowWhatsNew && (
          <WhatsNewModal handleClose={closeWhatsNew} />
        ) }
      
     
    <View className='w-full flex flex-col  px-4 gap-5' style={{paddingBottom:0}}>
      <View className="gap-3">
          <View className='flex-row gap-2 justify-start items-center'>
        
            <Text className='text-white font-pbold text-3xl'>Home</Text>
          </View>
      </View>
      <TouchableOpacity onPress={()=>{router.push('/notification')}} style={{ position:'absolute', top:0, right:30 }}>
        <View className='relative' >
          <Image
            source={{ uri: ownerUser.profilePic || avatarFallbackCustom }}
            contentFit='cover'
            style={{ width:30, height:30, borderRadius:50 }}
          />
          { notifCount > 0 ? (
            <Text className='text-primary font-psemibold text-sm text-center leading-6' style={{ textAlignVertical:'center' ,borderRadius:50, height:23, width:23, backgroundColor:Colors.secondary, position:'absolute' ,bottom:20, left:20 }} >{notifCount}</Text>
          ) : null}
        </View>
      </TouchableOpacity>

        <FlatList
          horizontal
          data={homeCategories}
          keyExtractor={(item,index) => index}
          contentContainerStyle={{ gap:10 , paddingBottom:10}}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=>{setSelected(item)}} style={{ borderRadius:15, backgroundColor:selected===item ? 'white' : 'transparent',height:30, paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white', justifyContent:'center', alignItems:'center' }}>
              <Text className=' font-pmedium ' style={{ color : selected===item ? Colors.primary : 'white' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />
         { isEmpty ?  (
          <ScrollView style={{}} refreshControl={
            <RefreshControl
              tintColor={Colors.secondary}
              refreshing={selected === 'Feed' ? loading : selected === 'Watchlist' ? loadingWatchlist : loadingInterested}
              onRefresh={selected === 'Feed' ? refetchFeed : selected === 'Watchlist' ? refetchWatchlist : refetchInterested}
            />
          }> 
            <Text className='text-mainGray font-pbold text-2xl self-center pt-12'>Nothing to show yet...</Text>
          </ScrollView>
        ) : (
                <FlatList
                  data = { selected === 'Feed' ? data : selected === 'Watchlist' ? watchlistItems : interestedItems}
                  refreshControl={
                    <RefreshControl
                      tintColor={Colors.secondary}
                      refreshing={loading}
                      onRefresh={selected === 'Feed' ? refetchFeed : selected === "Watchlist" ? refetchWatchlist : selected === 'Interested' && refetchInterested}
                    />
                  }
                  removeClippedSubviews
                  initialNumToRender={10}
                  windowSize={8}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item,index) => `${item}-${index}-${selected}`}
                  contentContainerStyle={{gap:10, paddingBottom:200}}
                  onEndReached={debouncedGetFeed}
                  onEndReachedThreshold={0}
          
                  renderItem={({ item }) => {

                  return (
                    selected === 'Feed' ? (
                      item.feedFrom === 'activity' ? (
                        <View>
                          {item.postType === 'dialogue' ? (
                            <TouchableOpacity onPress={() => { refetchOwner(); handlePress(item); }}>
                              <DialogueCard dialogue={item.dialogue} isBackground={true} fromHome={true} isReposted={item.activityType === 'REPOST'} />
                            </TouchableOpacity>
                          ) : item.postType === 'list' ? (
                            <TouchableOpacity onPress={() => {refetchOwner(); handlePress(item); }}>
                              <ListCard list={item.list} fromHome={true} isReposted={item.activityType === 'REPOST'} />
                            </TouchableOpacity>
                          ) : item.postType === 'review' ? (
                            <TouchableOpacity onPress={() => {refetchOwner(); router.push(`(home)/review/${item.id}`); }}>
                              <ReviewCard review={item.review} fromHome={true} isBackground={true} />
                            </TouchableOpacity>
                          ) : (
                          
                            <TouchableOpacity onPress={() => { refetchOwner(); router.push(`(home)/activity/${item.id}`); }}>
                              <ActivityCard2 activity={item} fromHome={true} isBackground={true} />
                            </TouchableOpacity>
                          )}
                        </View>
                      ) : (
                        item.feedFrom === 'setDays' && (
                          <TouchableOpacity onPress={()=>handleSetDayPress(item)}>
                            <SetDayCard setDay={item} isBackground={true} fromHome={true}  />
                          </TouchableOpacity>
                        )
                      )
                    ) : (
                      <TouchableOpacity onPress={()=>{handleTitlePress(item)}} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:150, overflow:'hidden' }}>
                      <Image
                          style={{
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          }}
                          source={{ uri: `${posterURL}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }` }}
                          placeholder={{ uri: `${posterURLlow}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }`  }}
                          placeholderContentFit="cover"
                          contentFit="cover" // Same as resizeMode='cover'
                          transition={300} // Optional: Adds a fade-in effect
                      />
                      <LinearGradient
                          colors={['transparent', 'black']}
                          style={{
                          height: '100%',
                          width: '100%',
                          position: 'absolute',
                          }}
                      />
                      <View className='flex-row justify-between items-end w-full h-full' style={{paddingHorizontal:15, paddingVertical:15}}>

                      <View  className='justify-end items-start  h-full' style={{maxWidth:220}} > 
                          <TouchableOpacity onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                          
                              <View className='flex-row gap-1 justify-center items-center'>
                                  { item.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                                  <Text className='text-white text font-pbold'>{ item.movieId ? `${item.movie.title} (${getYear(item.movie.releaseDate)})` : `${item.tv.title} (${getYear(item.tv.releaseDate)})` }</Text>
                              </View>
                          </TouchableOpacity>
                                      <View className="">
                                         
                                          <Text className='text-mainGray text-sm '>Added on {formatDate(item.createdAt)}</Text>
                                      </View>
                      </View>
                      <View className='flex-row gap-3 items-center justify-center ' >
                                  <TouchableOpacity onPress={()=>handleRemove(item)} style={{ backgroundColor : Colors.secondary, paddingHorizontal:8, paddingVertical:5, borderRadius:10 }}>
                                      <Text className='text-primary font-pbold text-sm'>Remove</Text>
                                  </TouchableOpacity>
                                  {/* <TouchableOpacity style={{}}>
                                      <EllipsisVertical size={20} color={Colors.mainGray} />
                                  </TouchableOpacity> */}
                              </View>
                      </View>
                  </TouchableOpacity>
                    )
                  )}}
                  
                  />
      ) }
    </View>
      </>
      </SafeAreaView>
  )
}

export default homeIndex

const styles = StyleSheet.create({})

