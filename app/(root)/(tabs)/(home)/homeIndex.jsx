import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl,  } from 'react-native'
import React, {useState, useEffect} from 'react'
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
    const [ loading, setLoading ] = useState(false);
    // const [ hasMore, setHasMore ] = useState(true);
    const [ hasMoreFeed, setHasMoreFeed ] = useState(true)
    const [ hasMoreThreads, setHasMoreThreads ] = useState(true)
    // const [ cursor, setCursor ] = useState(null);
    const [ feedCursor, setFeedCursor ] = useState(null);
    const [ threadCursor, setThreadCursor ] = useState(null);
    const [ unreadNotifs, setUnreadNotifs ]  = useState([])
    const [ trigger, setTrigger ] = useState(true)
    const getFeed = async () => {
        // if (!hasMoreFeed ) return
        try {
          const notifsData = await getAllNotifs( ownerUser.id, null , true )
          // setNotifications(notifsData)
          const unread = notifsData.filter( item => item.isRead === false)
          setUnreadNotifs(unread)
        } catch {
          console.log('error fetchign notifs')
        }
        if (!hasMoreFeed && !hasMoreThreads)return 
        try {
            setLoading(true);
            const request = await fetch (`${nodeServer.currentIP}/feed?userId=${ownerUser.id}&limit=5&feedCursor=${feedCursor}&threadCursor=${threadCursor}&hasMoreFeed=${hasMoreFeed}&hasMoreThreads=${hasMoreThreads}`);
            const response = await request.json();
            setData( prev => [ ...prev, ...response.items ] );
            setFeedCursor(response.nextFeedCursorServer)
            setThreadCursor(response.nextThreadCursorServer)
            // setHasMore(!!response.hasMore)
            setHasMoreFeed(response.hasMoreFeedServer)
            setHasMoreThreads(response.hasMoreThreadsServer)

        } catch (err) {
            console.log(err)
        }
        setLoading(false);
    }

    const refetchFeed = async () => {
      try {
        setLoading(true);
        const request = await fetch (`${nodeServer.currentIP}/feed?userId=${ownerUser.id}&limit=5&feedCursor=null&threadCursor=null&hasMoreFeed=true&hasMoreThreads=true`);
        const response = await request.json();
        console.log("REFETCH RESPONSE", response)
        setData( response.items );
        setFeedCursor(response.nextFeedCursorServer)
        setThreadCursor(response.nextThreadCursorServer)
        // setHasMore(!!response.hasMore)
        setHasMoreFeed(response.hasMoreFeedServer)
        setHasMoreThreads(response.hasMoreThreadsServer)

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
      console.log('data to handle like', likeData)
      const likedActivity = await likeActivity(likeData)
      console.log('liekdactivty', likedActivity)
      // setData()
      // setTrigger(prev => !prev)
      // setData(  )
      refetchOwner()
      await refetchFeed()
    } 

  
    if (isLoadingOwnerUser  || !ownerUser) {
      return <ActivityIndicator />;
    }

  return (
    <SafeAreaView className='w-full h-full bg-primary'>
     
    <View className='w-full  pt-3 px-4 gap-5' style={{paddingBottom:200}}>
      <View className="gap-3">
          <View className='flex-row gap-2 justify-start items-center'>

            {/* <TVIcon size={30} color='white' /> */}
            <Text className='text-white font-pbold text-3xl'>Home</Text>
          </View>
          <Text className='text-mainGray font-pmedium'>Check out the most bingeable shows right now.</Text>
      </View>
      <TouchableOpacity onPress={()=>{setUnreadNotifs([]);router.push('/notification')}} style={{ position:'absolute', top:0, right:30 }}>
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
            getFeed()
        }}
        onEndReachedThreshold={0}
        // renderItem={({item}) => {
        //   // console.log('flatlist item', item)
        //   const alreadyLikedActivity = ownerUser.activityInteractions.some( interaction => interaction.activityId === item.id  )
        //   return (
        //   <>
        //     { item.activityType === 'DIALOGUE'  ? (
        //       <TouchableOpacity onPress={()=>{router.push(`/dialogue/${item.dialogue.id}`)}} style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15, gap:15 }}>
        //         <DialogueCard dialogue ={item.dialogue} isBackground={false} fromHome={true} activity={item.description} refetch={getFeed}/>
        //       </TouchableOpacity>
        //     ) : item.threads ? (
        //       <TouchableOpacity  onPress={()=>{router.push(`/threads/${item.threads.id}`)}} style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15, gap:15 }}>
        //       {/* <Text className='text-mainGray text font-pregular text-center ' >{item.description}</Text> */}
        //       {/* <ThreadCard thread ={item.threads} isBackground={false} showThreadTopic={true} isShortened={true} fromHome={true} activity={item.description}/> */}
        //       <View className='w-full justify-between items-center flex-row  '>
        //           <TouchableOpacity onPress={()=>handleUserPress(item.user)} className='flex-row gap-2 items-center justify-center'>
        //             <Image
        //               source={{ uri : item.user.profilePic }}
        //               contentFit='cover'
        //               style={{ width:30, height:30, borderRadius:50 }}
        //             />
        //             <Text className='text-mainGrayDark '>@{item.user.username}</Text>
        //           </TouchableOpacity>
        //           <Text className='  text-mainGrayDark'>{formatDate(item.createdAt)}</Text>
        //       </View>
              
        //       <View className='flex-row gap-2 justify-center items-center '>
        //         <MessagesSquare size={18} color={Colors.secondary} />
        //         <Text className='text-mainGray'>{item.user.firstName} {item.description}</Text>
        //       </View>
        //       <Image
        //         source={{ uri: `${posterURL}${item?.threads.movie?.backdropPath || item?.threads.tv?.backdropPath}` }}
        //         placeholder={{ uri: `${posterURLlow}${item?.threads.movie?.backdropPath || item?.threads.tv?.backdropPath}` }}
        //         placeholderContentFit='cover'
        //         contentFit='cover'
        //         style ={{ width:'100%', height:150, borderRadius:15 }}
        //       />
        //       <View className='w-full flex-start items-start flex-row gap-2 '>
        //           <TouchableOpacity onPress={()=>handleLike(item)} style={{ flexDirection:'row', gap:5, alignItems:'center', justifyContent:'center' }}>
        //             <Heart size={20} strokeWidth={2.5} color={ alreadyLikedActivity ? Colors.secondary : Colors.mainGray}></Heart>
        //           <Text className='text-mainGray text-xs font-pbold'>{item.likes}</Text>
        //           </TouchableOpacity>
        //         </View>
        //       </TouchableOpacity>
        //     ) : item.list ? (
        //         <ListCard list={item.list}  activity={item.description} fromHome={true}  />
        //     ) : item.activityType === 'WATCHED' || item.activityType === 'CURRENTLY_WATCHING' || item.activityType === 'WATCHLIST' || item.activityType === 'RATING' ?  (
        //       <View style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15, justifyContent:'center', alignItems:'center', gap:15,  }}>
        //         <View className='w-full justify-between items-center flex-row'>
        //           <TouchableOpacity onPress={()=>handleUserPress(item.user)} className='flex-row gap-2 items-center justify-center'>
        //             <Image
        //               source={{ uri : item.user.profilePic }}
        //               contentFit='cover'
        //               style={{ width:30, height:30, borderRadius:50 }}
        //             />
        //             <Text className='text-mainGrayDark '>@{item.user.username}</Text>
        //           </TouchableOpacity>
        //           <Text className='  text-mainGrayDark'>{formatDate(item.createdAt)}</Text>
        //         </View>
        //         <View className='flex-row gap-3 items-center justify-center w-full px-4 '>
        //           { item.rating ? <Star size={18} color={Colors.secondary} /> : item.activityType === 'WATCHED' ? <Eye size={18} color={Colors.secondary} /> :
        //           item.activityType === 'CURRENTLY_WATCHING' ? <ProgressCheckIcon size={18} color={Colors.secondary} /> : item.activityType==='WATCHLIST' && <ListChecks size={18} color={Colors.secondary} />  }
        //           <Text className='text-mainGray font-pregular  ' >{`${item.user.firstName} ${item.description}`}</Text>
        //         </View>
        //         <TouchableOpacity onPress={()=>handlePosterPress(item)} style={{width:'100%'}} >
        //           <Image
        //             contentFit='cover'
        //             source={{ uri: `${posterURL}${item?.movie?.backdropPath || item?.tv?.backdropPath || item?.rating?.movie?.backdropPath || item?.rating?.tv?.backdropPath }` }}
        //             placeholder={{ uri: `${posterURLlow}${item?.movie?.backdropPath || item?.tv?.backdropPath || item?.rating?.movie?.backdropPath || item?.rating?.tv?.backdropPath }` }}
        //             placeholderContentFit='cover'
        //             style ={{ width:'100%', height:150, borderRadius:15 }}
        //           />
        //         </TouchableOpacity>
        //         <View className='w-full flex-start items-start flex-row gap-2'>
        //           <TouchableOpacity onPress={()=>handleLike(item)} style={{ flexDirection:'row', gap:5, alignItems:'center', justifyContent:'center' }}>
        //             <Heart size={20} strokeWidth={2.5} color={ alreadyLikedActivity ? Colors.secondary : Colors.mainGray}></Heart>
        //           <Text className='text-mainGray text-xs font-pbold'>{item.likes}</Text>
        //           </TouchableOpacity>
        //         </View>
        //       </View>
        //     ) : item.type === 'thread' ? (
        //         <ThreadActivityCard thread={item} refetch={refetchFeed} />
        //     ): (
        //       <>
        //       { console.log('item in fragment',item) }
        //       <View className='border-2 border-green-400'></View>
        //       </>
        //     ) }
        //     </> 
        // )}}

        renderItem={({item}) => {
          console.log('item ', item)

          return (
          <ActivityCard activity={item}  />
        )}}
      />

      </View>
      </View>
      </SafeAreaView>
  )
}

export default homeIndex

const styles = StyleSheet.create({})