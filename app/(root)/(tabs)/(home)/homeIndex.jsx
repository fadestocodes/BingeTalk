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
import { Eye, EyeOff, ListChecks, Handshake, Star, Ellipsis , List, MessagesSquare} from 'lucide-react-native'
import { ProgressCheckIcon, ThumbsUp, ThumbsDown, MessageIcon, RepostIcon } from '../../../../assets/icons/icons';
import ListCard from '../../../../components/ListCard';
import { toPascalCase } from '../../../../lib/ToPascalCase';




const homeIndex = () => {
    const [selected, setSelected] = useState('All');
    const { user: clerkUser } = useUser();
    const { data: ownerUser, isLoading: isLoadingOwnerUser } = useFetchOwnerUser({
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

    const getFeed = async () => {
        // if (!hasMoreFeed ) return
        if (!hasMoreFeed && !hasMoreThreads)return 
        try {
            setLoading(true);
            console.log('fetching feed')
            console.log('hasMoreFEED' , hasMoreFeed,'hasMoreTHREADS', hasMoreThreads)
            const request = await fetch (`${nodeServer.currentIP}/feed?userId=${ownerUser.id}&limit=5&feedCursor=${feedCursor}&threadCursor=${threadCursor}&hasMoreFeed=${hasMoreFeed}&hasMoreThreads=${hasMoreThreads}`);
            const response = await request.json();
            // console.log('Feed response', response);
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
      <TouchableOpacity onPress={()=>router.push('/notification')} style={{ position:'absolute', top:0, right:30 }}>
        <Image
          source={{ uri: ownerUser.profilePic }}
          contentFit='cover'
          style={{ width:30, height:30, borderRadius:50 }}
        />
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
            onRefresh={getFeed}
          />
        }
        keyExtractor={(item,index) => index}
        contentContainerStyle={{gap:15}}
        onEndReached={()=>{
            getFeed()
        }}
        onEndReachedThreshold={0}
        renderItem={({item}) => {
          // console.log('flatlist item', item)
          return (
          // <View style={{ height:'auto', width:'100%', borderRadius:15, padding:10, gap:0 }} > 
          <>
            { item.dialogue  ? (
              <TouchableOpacity onPress={()=>{router.push(`/dialogue/${item.dialogue.id}`)}} style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15, gap:15 }}>
                <DialogueCard dialogue ={item.dialogue} isBackground={false} fromHome={true} activity={item.description} />
              </TouchableOpacity>
            ) : item.threads ? (
              <TouchableOpacity  onPress={()=>{router.push(`/threads/${item.threads.id}`)}} style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15, gap:15 }}>
              {/* <Text className='text-mainGray text font-pregular text-center ' >{item.description}</Text> */}
              {/* <ThreadCard thread ={item.threads} isBackground={false} showThreadTopic={true} isShortened={true} fromHome={true} activity={item.description}/> */}
              <View className='w-full justify-between items-center flex-row'>
                  <TouchableOpacity onPress={()=>handleUserPress(item.user)} className='flex-row gap-2 items-center justify-center'>
                    <Image
                      source={{ uri : item.user.profilePic }}
                      contentFit='cover'
                      style={{ width:30, height:30, borderRadius:50 }}
                    />
                    <Text className='text-mainGrayDark '>@{item.user.username}</Text>
                  </TouchableOpacity>
                  <Text className='  text-mainGrayDark'>{formatDate(item.createdAt)}</Text>
              </View>
              
              <View className='flex-row gap-2 justify-center items-center'>
                <MessagesSquare size={18} color={Colors.secondary} />
                <Text className='text-mainGray'>{item.user.firstName} {item.description}</Text>
              </View>
              <Image
                source={{ uri: `${posterURL}${item?.threads.movie?.backdropPath || item?.threads.tv?.backdropPath}` }}
                placeholder={{ uri: `${posterURLlow}${item?.threads.movie?.backdropPath || item?.threads.tv?.backdropPath}` }}
                placeholderContentFit='cover'
                contentFit='cover'
                style ={{ width:'100%', height:150, borderRadius:15 }}
              />

              </TouchableOpacity>
            ) : item.list ? (
              <ListCard list={item.list}  activity={item.description} fromHome={true} />
            ) : item.activityType === 'WATCHED' || item.activityType === 'CURRENTLY_WATCHING' || item.activityType === 'WATCHLIST' || item.activityType === 'RATING' ?  (
              <View style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15, minHeight:100, justifyContent:'center', alignItems:'center', gap:15 }}>
                <View className='w-full justify-between items-center flex-row'>
                  <TouchableOpacity onPress={()=>handleUserPress(item.user)} className='flex-row gap-2 items-center justify-center'>
                    <Image
                      source={{ uri : item.user.profilePic }}
                      contentFit='cover'
                      style={{ width:30, height:30, borderRadius:50 }}
                    />
                    <Text className='text-mainGrayDark '>@{item.user.username}</Text>
                  </TouchableOpacity>
                  <Text className='  text-mainGrayDark'>{formatDate(item.createdAt)}</Text>
                </View>
                <View className='flex-row gap-3 items-center justify-center w-full px-4 '>
                  { item.rating ? <Star size={18} color={Colors.secondary} /> : item.activityType === 'WATCHED' ? <Eye size={18} color={Colors.secondary} /> :
                  item.activityType === 'CURRENTLY_WATCHING' ? <ProgressCheckIcon size={18} color={Colors.secondary} /> : item.activityType==='WATCHLIST' && <ListChecks size={18} color={Colors.secondary} />  }
                  <Text className='text-mainGray font-pregular  ' >{`${item.user.firstName} ${item.description}`}</Text>
                </View>
                <TouchableOpacity onPress={()=>handlePosterPress(item)} style={{width:'100%'}} >
                  <Image
                    contentFit='cover'
                    source={{ uri: `${posterURL}${item?.movie?.backdropPath || item?.tv?.backdropPath || item?.rating?.movie?.backdropPath || item?.rating?.tv?.backdropPath }` }}
                    placeholder={{ uri: `${posterURLlow}${item?.movie?.backdropPath || item?.tv?.backdropPath || item?.rating?.movie?.backdropPath || item?.rating?.tv?.backdropPath }` }}
                    placeholderContentFit='cover'
                    style ={{ width:'100%', height:150, borderRadius:15 }}
                  />
                </TouchableOpacity>
              </View>
            ) : item.type === 'thread' ? (
              <TouchableOpacity  onPress={()=>{router.push(`/threads/${item.id}`)}} style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15, gap:15, minHeight:150}}>
                  <TouchableOpacity onPress={()=>{handleUserPress(item.user)}} className='flex-row gap-2   items-center justify-between'>
                    <View className='flex-row gap-2 justify-center items-center'>
                      <Image
                        source={{ uri : item.user.profilePic }}
                        contentFit='cover'
                        style={{ width:30, height:30, borderRadius:50 }}
                      />
                      <Text className='text-mainGrayDark '>@{item.user.username}</Text>
                    </View>
                  <Text className='  text-mainGrayDark'>{formatDate(item.createdAt)}</Text>
                  </TouchableOpacity>
                  <View className='flex-row gap-3 justify-start items-center  '>
                  <TouchableOpacity onPress={()=>handlePosterPress(item)} >
                    <Text className='text-white'>/{ toPascalCase( item?.movie?.title || item?.tv?.title || item?.castCrew?.name)}</Text>
                  </TouchableOpacity>
                  { item.tag && (
                  <Text className= ' font-pbold text-primary text-xs ' style={{ backgroundColor: item.tag.color , padding:5, borderRadius:10, alignSelf:'flex-start'}}>{item.tag.tagName}</Text>
                ) }

                  </View>
                  <Text className='text-white text-lg font-pbold leading-6'>{item.title}</Text>
                  <TouchableOpacity onPress={()=>handlePosterPress(item)}>
                    <Image
                      source ={{ uri : `${posterURL}${item?.movie?.backdropPath || item?.tv?.backdropPath}` }}
                      placeholder ={{ uri : `${posterURLlow}${item?.movie?.backdropPath || item?.tv?.backdropPath}` }}
                      placeholderContentFit='cover'
                      contentFit='cover'
                      style ={{ width:'100%', height:150, borderRadius:15 }}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
            ) : (
              <View >
                  <Text className='w-full flex-end'>{formatDate(item.createdAt)}</Text>
                  <Text className='text-mainGray  font-pregular' style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15, minHeight:100 }}>{item.description}</Text>
              </View>
            )}
            {/* <View className='border-t-[1px] border-primaryLight w-full'/> */}
            </> 
            // </View>
        )}}
      />

      </View>
      </View>
      </SafeAreaView>
  )
}

export default homeIndex

const styles = StyleSheet.create({})