import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator,  } from 'react-native'
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


const homeIndex = () => {
    const [selected, setSelected] = useState('All');
    const { user: clerkUser } = useUser();
    const { data: ownerUser, isLoading: isLoadingOwnerUser } = useFetchOwnerUser({
      email: clerkUser.emailAddresses[0].emailAddress,
    });
    const router = useRouter()
    const [ data, setData ] = useState([]);
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const [ loading, setLoading ] = useState(false);
    const [ hasMore, setHasMore ] = useState(true);
    const [ cursor, setCursor ] = useState(null);

    const getFeed = async () => {
        if (!hasMore ) return
        try {
            setLoading(true);
            console.log('fetching feed')
            const request = await fetch (`${nodeServer.currentIP}/feed?userId=${ownerUser.id}&limit=5&cursor=${cursor}`);
            const response = await request.json();
            console.log('Feed response', response);
            setData( prev => [ ...prev, ...response.items ] );
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)

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
      if (item.movie){
        router.push(`/(home)/movie/${item.movie.tmdbId}`)
      } else if (item.tv){
        router.push(`/(home)/tv/${item.tv.tmdbId}`)
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
        keyExtractor={(item) => item.id}
        contentContainerStyle={{gap:15}}
        onEndReached={()=>{
            getFeed()
        }}
        onEndReachedThreshold={0}
        renderItem={({item}) => {
          console.log('flatlist item', item)
        
          
          return (
          // <View style={{ height:'auto', width:'100%', borderRadius:15, padding:10, gap:0 }} > 
          <>
            { item.dialogue ? (
              <View style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15, gap:15 }}>
              {/* <Text className='text-mainGray text font-pregular text-center ' >{item.description}</Text> */}
              <DialogueCard dialogue ={item.dialogue} isBackground={false} />
              </View>
            ) : item.activityType === 'WATCHED' || item.activityType === 'CURRENTLY_WATCHING' || item.activityType === 'WATCHLIST' ? (
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
                <Text className='text-mainGray font-pregular text-left w-full ' >{`${item.user.firstName} ${item.description}`}</Text>
                <TouchableOpacity onPress={()=>handlePosterPress(item)} style={{width:'100%'}} >
                  <Image
                    contentFit='cover'
                    source={{ uri: `${posterURL}${item?.movie?.backdropPath || item?.tv?.backdropPath}` }}
                    style ={{ width:'100%', height:150, borderRadius:15 }}
                  />
                </TouchableOpacity>
              </View>
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