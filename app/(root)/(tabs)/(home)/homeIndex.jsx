import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView,  } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { homeCategories } from '../../../../lib/CategoryOptions'
import { Colors } from '../../../../constants/Colors';
import { useGetFeed } from '../../../../api/feed';
import { Image } from 'expo-image';
import { useUser } from '@clerk/clerk-expo';
import { fetchUser, useFetchOwnerUser } from '../../../../api/user';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserDB } from '../../../../lib/UserDBContext';
import * as nodeServer from '../../../../lib/ipaddresses'
import DialogueCard from '../../../../components/DialogueCard';
import { formatDate } from '../../../../lib/formatDate';
import ThreadCard from '../../../../components/ThreadCard';
import { Eye, EyeOff, ListChecks, Handshake, Star, Ellipsis , List, MessagesSquare, Heart} from 'lucide-react-native'
import { ProgressCheckIcon, ThumbsUp, ThumbsDown, MessageIcon, RepostIcon } from '../../../../assets/icons/icons';
import ListCard from '../../../../components/ListCard';
import { toPascalCase } from '../../../../lib/ToPascalCase';
import { getAllNotifs, useGetAllNotifs } from '../../../../api/notification';
import { likeActivity } from '../../../../api/activity';
import ActivityCard2 from '../../../../components/ActivityCard2';
import { useNotificationCountContext } from '../../../../lib/NotificationCountContext';
import debounce from 'lodash.debounce';
import ReviewCard from '../../../../components/Screens/ReviewCard';

const homeIndex = () => {
  const { notifCount, updateNotifCount } = useNotificationCountContext()
    const [selected, setSelected] = useState('All');
    const { user: clerkUser } = useUser();
    const { data: ownerUser, isLoading: isLoadingOwnerUser, refetch:refetchOwner } = useFetchOwnerUser({
      email: clerkUser?.emailAddresses[0].emailAddress,
    });
    const router = useRouter()
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    // const [ hasMore, setHasMore ] = useState(true);
    const [ hasMoreFeed, setHasMoreFeed ] = useState(true)
    const [ hasMoreThreads, setHasMoreThreads ] = useState(true)
    const [ hasMoreRotations, setHasMoreRotations ] = useState(true)
    // const [ cursor, setCursor ] = useState(null);
    const [ feedCursor, setFeedCursor ] = useState(null);
    const [ threadCursor, setThreadCursor ] = useState(null);
    const [ rotationCursor, setRotationCursor ] = useState(null);
    const [ unreadNotifs, setUnreadNotifs ]  = useState([])
    const flatListRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    const getFeed = async () => {
        if (loading) return
        try {
          setLoading(true)
          const notifsData = await getAllNotifs( ownerUser?.id, null , true, updateNotifCount )
          const unread = notifsData.filter( item => item.isRead === false)
          setUnreadNotifs(unread)
        } catch {
          console.log('error fetchign notifs')
        }
        if (!hasMoreFeed && !hasMoreThreads &&!hasMoreRotations )return 
        try {
            const request = await fetch (`${nodeServer.currentIP}/feed?userId=${ownerUser?.id}&limit=15&feedCursor=${feedCursor}&threadCursor=${threadCursor}&rotationCursor=${rotationCursor}&hasMoreFeed=${hasMoreFeed}&hasMoreThreads=${hasMoreThreads}&hasMoreRotations=${hasMoreRotations}`);
            const response = await request.json();
            setData( prev => [ ...prev, ...response.items ] );
            setFeedCursor(response.nextFeedCursorServer)
            setThreadCursor(response.nextThreadCursorServer)
            setRotationCursor(response.nextRotationCursorServer)
            // setHasMore(!!response.hasMore)
            setHasMoreFeed(response.hasMoreFeedServer)
            setHasMoreThreads(response.hasMoreThreadsServer)
            setHasMoreRotations(response.hasMoreRotationsServer)


        } catch (err) {
            console.log(err)
        } finally {
          setLoading(false);
        }
    }

    const refetchFeed = async () => {
      setLoading(true)
      try {
        await refetchOwner();
        const notifsData = await getAllNotifs( ownerUser?.id, null , true, updateNotifCount )
        const unread = notifsData.filter( item => item.isRead === false)
        setUnreadNotifs(unread)
        const request = await fetch (`${nodeServer.currentIP}/feed?userId=${ownerUser?.id}&limit=15&feedCursor=null&threadCursor=null&rotationCursor=null&hasMoreFeed=true&hasMoreThreads=true&hasMoreRotations=true`);
        const response = await request.json();
        setData( response.items );
        setFeedCursor(response.nextFeedCursorServer)
        setThreadCursor(response.nextThreadCursorServer)
        setRotationCursor(response.nextRotationCursor)
        // setHasMore(!!response.hasMore)
        setHasMoreFeed(response.hasMoreFeedServer)
        setHasMoreThreads(response.hasMoreThreadsServer)
        setHasMoreRotations(response.hasMoreRotations)


    } catch (err) {
        console.log(err)
    }
    setLoading(false);
    }




    useEffect(() => {
        if (ownerUser){
          getFeed()
        }
        
    }, [ownerUser])

     


    
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
      refetchOwner()
      await refetchFeed()
    } 

    const handlePress =(item) => {
      console.log("ITEMMMM", item)

      if (item.dialogue){
        router.push(`(home)/dialogue/${item.dialogue.id}`)
      } else if (item.threads){
        router.push(`(home)/threads/${item.threads.id}`)
      } else if (item.feedFrom === 'threadFromWatched' || item.feedFrom === 'threadFromRotations'){
        router.push(`(home)/threads/${item.id}`)
      } else if (item.review){
        console.log('tryingtorouterpush')
        router.push(`(home)/review/${item.id}`)
      }
    } 

    const debouncedGetFeed = debounce(async () => {
      if (!loading) {
        await getFeed();
      }
    }, 500); 






  

  return (
    <SafeAreaView className='w-full h-full bg-primary' >
      {  !ownerUser  ? (
        <View className='bg-primary h-full justify-center items-center'>
          <ActivityIndicator />
        </View>
      ) : (

     
    <View className='w-full  px-4 gap-5' style={{paddingBottom:130}}>
      <View className="gap-3">
          <View className='flex-row gap-2 justify-start items-center'>
        
            <Text className='text-white font-pbold text-3xl'>Home</Text>
          </View>
          <Text className='text-mainGray font-pmedium'>See what your friends are up to.</Text>
      </View>
      <TouchableOpacity onPress={()=>{router.push('/notification')}} style={{ position:'absolute', top:0, right:30 }}>
        <View className='relative' >
          <Image
            source={{ uri: ownerUser.profilePic }}
            contentFit='cover'
            style={{ width:30, height:30, borderRadius:50 }}
          />
          { notifCount > 0 ? (
            <Text className='text-primary font-psemibold text-sm text-center leading-6' style={{ textAlignVertical:'center' ,borderRadius:50, height:23, width:23, backgroundColor:Colors.secondary, position:'absolute' ,bottom:20, left:20 }} >{notifCount}</Text>
          ) : null}
        </View>
      </TouchableOpacity>

      <View className='w-full my-2 gap-3' style={{paddingBottom:100}}>
      {/* <FlatList
        horizontal
        data={homeCategories}
        keyExtractor={(item,index) => index}
        contentContainerStyle={{ gap:10 }}
        renderItem={({item}) => (
          <TouchableOpacity onPress={()=>{setSelected(item)}} style={{ borderRadius:15, backgroundColor:selected===item ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
            <Text className=' font-pmedium' style={{ color : selected===item ? Colors.primary : 'white' }}>{item}</Text>
          </TouchableOpacity>
        )}
      /> */}

     

         {data.length < 1 ? (
          <ScrollView style={{height:'100%'}} refreshControl={
            <RefreshControl
              tintColor={Colors.secondary}
              refreshing={loading}
              onRefresh={refetchFeed}
            />
          }> 
            <Text className='text-mainGray font-pbold text-2xl self-center pt-12'>Nothing to show yet...</Text>
          </ScrollView>
        ) : (
              <View className='h-full'>
                <FlatList
                  data = {data}
                  refreshControl={
                    <RefreshControl
                      tintColor={Colors.secondary}
                      refreshing={loading}
                      onRefresh={refetchFeed}
                    />
                  }
                  removeClippedSubviews
                  initialNumToRender={10}
                  windowSize={8}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={{gap:10}}
                  onEndReached={debouncedGetFeed}
                  onEndReachedThreshold={0}
          
                  renderItem={({item}) => 
                    (
                      <>
                    { item.feedFrom === 'activity' ? (
                      <View>
                        { item.postType === 'dialogue' ? (
                          <TouchableOpacity onPress={()=>{refetchOwner();handlePress(item)}}>
                           <DialogueCard dialogue={item.dialogue} isBackground={true} fromHome={true} isReposted={item.activityType === 'REPOST'}/>
                          </TouchableOpacity>
                        ) : item.postType === 'thread' ? (
                          <TouchableOpacity onPress={()=>{refetchOwner();handlePress(item)}}>
                            <ThreadCard thread={item.threads} isBackground={true} fromHome={true} isReposted={item.activityType === 'REPOST'}/>
                          </TouchableOpacity>
          
                        ) : item.postType === 'list' ? (
                          <TouchableOpacity onPress={()=>{refetchOwner();handlePress(item)}}>
                            <ListCard list={item.list} fromHome={true} isReposted={item.activityType === 'REPOST'}/>
                          </TouchableOpacity>
          
                        ) : item.postType === 'review' ? (
                          <TouchableOpacity onPress={()=>{refetchOwner();router.push(`(home)/review/${item.id}`)}} isReposted={item.activityType === 'REPOST'}>
                            <ReviewCard review={item.review} fromHome={true}  isBackground={true} />
                          </TouchableOpacity>
                        ):(
                          <TouchableOpacity onPress={ ()=>{  refetchOwner(); console.log('activitypress',item) ;router.push(`(home)/activity/${item.id}`)}}>
                            <ActivityCard2 activity={item} fromHome={true} isBackground={true}/>
                          </TouchableOpacity>
                        ) }
                      </View>
                    ) : (
                      <TouchableOpacity onPress={()=>{refetchOwner();handlePress(item)}}>
                        <ThreadCard thread={item} isBackground={true} fromHome={true} isReposted={item.activityType === 'REPOST'}/>
                      </TouchableOpacity>
                    ) }
                  </>
                  )}
                  />
                  </View>

      ) }

      </View>
      </View>
      ) }
      </SafeAreaView>
  )
}

export default homeIndex

const styles = StyleSheet.create({})

