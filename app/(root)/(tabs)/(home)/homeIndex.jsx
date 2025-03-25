import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl,  } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { homeCategories } from '../../../../lib/CategoryOptions'
import { Colors } from '../../../../constants/Colors';
import { useGetFeed } from '../../../../api/feed';
import { Image } from 'expo-image';
import { useUser } from '@clerk/clerk-expo';
import { useFetchOwnerUser } from '../../../../api/user';
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
import ThreadActivityCard from '../../../../components/ThreadActivityCard';
import ActivityCard from '../../../../components/ActivityCard';
import ActivityCard2 from '../../../../components/ActivityCard2';


const homeIndex = () => {
    const [selected, setSelected] = useState('All');
    const { user: clerkUser } = useUser();
    const { data: ownerUser, isLoading: isLoadingOwnerUser, refetch:refetchOwner } = useFetchOwnerUser({
      email: clerkUser.emailAddresses[0].emailAddress,
    });
    const router = useRouter()
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(true);
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
        if (!hasMoreFeed ) return
        try {
          const notifsData = await getAllNotifs( ownerUser.id, null , true )
          const unread = notifsData.filter( item => item.isRead === false)
          setUnreadNotifs(unread)
        } catch {
          console.log('error fetchign notifs')
        }
        if (!hasMoreFeed && !hasMoreThreads &&!hasMoreRotations )return 
        try {
            const request = await fetch (`${nodeServer.currentIP}/feed?userId=${ownerUser.id}&limit=15&feedCursor=${feedCursor}&threadCursor=${threadCursor}&rotationCursor=${rotationCursor}&hasMoreFeed=${hasMoreFeed}&hasMoreThreads=${hasMoreThreads}&hasMoreRotations=${hasMoreRotations}`);
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
        }
        setLoading(false);
    }

    const refetchFeed = async () => {
      try {
        const notifsData = await getAllNotifs( ownerUser.id, null , true )
        const unread = notifsData.filter( item => item.isRead === false)
        setUnreadNotifs(unread)

        const request = await fetch (`${nodeServer.currentIP}/feed?userId=${ownerUser.id}&limit=15&feedCursor=null&threadCursor=null&rotationCursor=null&hasMoreFeed=true&hasMoreThreads=true&hasMoreRotation=true`);
        const response = await request.json();
        console.log("REFETCH RESPONSE", response)
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

     


    const handleUserPress = (item) => {
      router.push(`/(home)/user/${item.id}`)
    }
    
    const handlePosterPress = (item) => {
      if (item?.movie || item?.rating?.movie){
        router.push(`/(home)/movie/${item?.movie?.tmdbId || item?.rating?.movie?.tmdbId}`)
      } else if (item?.tv || item?.rating?.tv ){
        router.push(`/(home)/tv/${item?.tv?.tmdbId || item?.rating?.tv?.tmdbId }`)
      }
    }

    const handleLike = async (item) => {
      console.log('item', item)
      const likeData = {
        userId : ownerUser.id,
        activityId : item.id
      }
      const likedActivity = await likeActivity(likeData)
      // setData()
      // setTrigger(prev => !prev)
      // setData(  )
      refetchOwner()
      await refetchFeed()
    } 

    const handlePress =(item) => {
      console.log("PRESSED ITEM", item)
      if (item.dialogue){
        router.push(`(home)/dialogue/${item.dialogue.id}`)
      } else if (item.threads){
        router.push(`(home)/threads/${item.threads.id}`)
      } else if (item.feedFrom === 'threadFromWatched'){
        router.push(`(home)/threads/${item.id}`)
      }
    }



  
    // if (isLoadingOwnerUser ) {
    //   return(
    //   <View className='bg-primary h-full justify-center items-center'>
    //     <ActivityIndicator />
    //   </View>)
    // }
    

  return (
    <SafeAreaView className='w-full h-full bg-primary'>
      { isLoadingOwnerUser ? (
        <View className='bg-primary h-full justify-center items-center'>
          <ActivityIndicator />
        </View>
      ) : (

     
    <View className='w-full  pt-3 px-4 gap-5' style={{paddingBottom:200}}>
      <View className="gap-3">
          <View className='flex-row gap-2 justify-start items-center'>

            {/* <TVIcon size={30} color='white' /> */}
            <Text className='text-white font-pbold text-3xl'>Home</Text>
          </View>
          <Text className='text-mainGray font-pmedium'>Check out the most bingeable shows right now.</Text>
      </View>
      <TouchableOpacity onPress={()=>{router.push('/notification')}} style={{ position:'absolute', top:0, right:30 }}>
        <View className='relative' >
          <Image
            source={{ uri: ownerUser.profilePic }}
            contentFit='cover'
            style={{ width:30, height:30, borderRadius:50 }}
          />
          { unreadNotifs.length > 0 && (
            <Text className='text-primary font-psemibold text-sm text-center leading-6' style={{ textAlignVertical:'center' ,borderRadius:50, height:23, width:23, backgroundColor:Colors.secondary, position:'absolute' ,bottom:20, left:20 }} >{unreadNotifs.length}</Text>
          ) }
        </View>
      </TouchableOpacity>

      <View className='w-full my-2 gap-3' style={{paddingBottom:100}}>
      <FlatList
        horizontal
        data={homeCategories}
        keyExtractor={(item,index) => index}
        contentContainerStyle={{ gap:10 }}
        renderItem={({item}) => (
          <TouchableOpacity onPress={()=>{setSelected(item)}} style={{ borderRadius:15, backgroundColor:selected===item ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
            <Text className=' font-pmedium' style={{ color : selected===item ? Colors.primary : 'white' }}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      { loading ? (
        <ActivityIndicator />
      ) : (

      <FlatList
        data = {data}
        refreshControl={
          <RefreshControl
            tintColor={Colors.secondary}
            refreshing={loading}
            onRefresh={refetchFeed}
          />
        }
        keyExtractor={(item,index) => index}
        contentContainerStyle={{gap:10, }}
        onEndReached={()=>{
          if (hasMoreFeed || hasMoreThreads){
            getFeed()
          }
        }}
        onEndReachedThreshold={0.3}
      

        renderItem={({item}) => {
          return (
            <>
          {/* // <ActivityCard activity={item} refetch={refetchFeed} /> */}
          { item.feedFrom === 'activity' ? (
            <View>
              { item.postType === 'dialogue' ? (
                <TouchableOpacity onPress={()=>handlePress(item)}>
                 <DialogueCard dialogue={item.dialogue} isBackground={true} fromHome={true} isReposted={item.activityType === 'REPOST'}/>
                </TouchableOpacity>
              ) : item.postType === 'thread' ? (
                <TouchableOpacity onPress={()=>handlePress(item)}>
                  <ThreadCard thread={item.threads} isBackground={true} fromHome={true} isReposted={item.activityType === 'REPOST'}/>
                </TouchableOpacity>

              ) : item.postType === 'list' ? (
                <TouchableOpacity onPress={()=>handlePress(item)}>
                  <ListCard list={item.list} fromHome={true} isReposted={item.activityType === 'REPOST'}/>
                </TouchableOpacity>

              ) : (
                <ActivityCard2 activity={item} fromHome={true} />
              ) }
            </View>
          ) : (
            <TouchableOpacity onPress={()=>handlePress(item)}>
              <ThreadCard thread={item} isBackground={true} fromHome={true} isReposted={item.activityType === 'REPOST'}/>
            </TouchableOpacity>

          ) }

        </>
        )}}
      />
      ) }

      </View>
      </View>
      ) }
      </SafeAreaView>
  )
}

export default homeIndex

const styles = StyleSheet.create({})