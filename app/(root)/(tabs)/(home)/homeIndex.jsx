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


const homeIndex = () => {
    const [selected, setSelected] = useState('All');
    const { user: clerkUser } = useUser();
    const { data: ownerUser, isLoading: isLoadingOwnerUser } = useFetchOwnerUser({
      email: clerkUser.emailAddresses[0].emailAddress,
    });
    const router = useRouter()
    const [ data, setData ] = useState([]);
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

  
    if (isLoadingOwnerUser  || !ownerUser) {
      return <ActivityIndicator />;
    }

  return (
    <SafeAreaView className='w-full h-full bg-primary'>
     
    <View className='w-full  pt-3 px-6 gap-5' style={{paddingBottom:200}}>
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
          <View style={{ height:250, width:'100%', borderRadius:15, backgroundColor:Colors.mainGrayDark, padding:10 }} >  
            <Text className='text-white text-lg font-pbold'>{item.description}</Text>
          </View>
        )}}
      />

      </View>
      </View>
      </SafeAreaView>
  )
}

export default homeIndex

const styles = StyleSheet.create({})