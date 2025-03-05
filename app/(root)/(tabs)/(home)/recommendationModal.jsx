import { ScrollView, StyleSheet, Text, View, Image, FlatList, ActivityIndicator, TouchableOpacity, Dimensions} from 'react-native'
import React, {useEffect, useState} from 'react'
import { newRecommendation } from '../../../../api/recommendation'
import { Colors } from '../../../../constants/Colors'
import { useUser } from '@clerk/clerk-expo'
import { getAllMutuals, useFetchOwnerUser } from '../../../../api/user'
import { useLocalSearchParams } from 'expo-router'
import { Handshake } from 'lucide-react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, withSpring } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const FadeOutMessage = ({ message, onComplete }) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(50); // Start below the screen (off-screen)

  
    useEffect(() => {
      if (message) {
        // Fade in + spring animation
        opacity.value = withTiming(1, { duration: 500 }); // Fade in
        translateY.value = withSpring(0, { damping: 6, stiffness: 100 }); // Spring into view
  
        // After a delay, fade out the message
        setTimeout(() => {
          opacity.value = withTiming(0, { duration: 500 });
          translateY.value = withSpring(50, { damping: 6, stiffness: 100 }); // Move offscreen
        }, 3000); // Wait for 2 seconds before fading out
  
        // Call the onComplete callback when the animation finishes
        setTimeout(() => {
          onComplete(); // Clear message
        }, 3500);
      }
    }, [message]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }],
        };
      });
      if (!message) return null;

      return (
        <Animated.View
          style={[
            animatedStyle,
            {
              position: 'absolute',
              top: '50%',
              left: width/2 - 100, // Center horizontally
              alignItems: 'center',
              backgroundColor: 'black',
              padding: 15,
              borderRadius: 15,
              justifyContent:'center',
              alignItems:'center',
              height:100,
              width:200,
            },
          ]}
        >
          <Text className='font-psemibold' style={{ color: 'white' }}>{message}</Text>
        </Animated.View>
      );
};

const recommendationModal = () => {

    const { user : clerkUser } = useUser()
    const { data : ownerUser } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })
    const [ mutuals, setMutuals ] = useState([])
    const [ loadingMutuals, setLoadingMutuals ] = useState(false)
    const [ message , setMessage ] = useState(null)



    const { DBmovieId, DBtvId, DBcastId } = useLocalSearchParams();
    console.log('params', DBmovieId, DBtvId, DBcastId)
   
    const useGetAllMutuals = async () => {
        const mutuals = await getAllMutuals(ownerUser.id);
        setMutuals(mutuals)
        console.log('mutuals', mutuals)
    }

    useEffect(()=>{
        setLoadingMutuals(true)
        try {
            useGetAllMutuals();
        } catch (err){
            console.log(err)    
        } finally{
            setLoadingMutuals(false)
        }
    },[])

   

    const handleRecommendation = async (item) => {
        let type
        if (DBmovieId){
            type = 'MOVIE'
        } else if (DBtvId){
            type = 'TV'
        } else if (DBcastId){
            type = 'CASTCREW'
        }
        
        const data = {
            recommenderId : ownerUser.id,
            type,
            recipientId : item.followingId,
            movieId : Number(DBmovieId) || null,
            castId : Number(DBcastId) || null,
            tvId : Number(DBtvId) || null
        }
        console.log('DATA', data)
        
        const newRec = await newRecommendation( data );
        if (newRec.message){
            setMessage(newRec.message)
        }
    }

    if (loadingMutuals){
        return <ActivityIndicator />
    }



  return (
    <ScrollView className='w-full h-full bg-primary' style={{borderRadius:30}}>
        <View className='h-full w-full justify-center items-center relative gap-5'  style={{paddingTop:60, paddingBottom:120, paddingHorizontal:30, width:'100%', justifyContent:'center', alignItems:'center'}} >
        <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20 }} />
            <View className='gap-2' >
                <Text className='text-secondary text-2xl font-pbold'>Select a user to send a recommendation to</Text>
                <Text className='text-mainGray text-center'>(must be mutual followers)</Text>
            </View>
            <FadeOutMessage message={message} onComplete={() => setMessage('')} />

            <FlatList
                scrollEnabled={false}
                data ={ mutuals}
                keyExtractor = { item => item.id }
                contentContainerStyle={{ gap:20, paddingVertical:30 }}
                renderItem = { ({item, index}) => {
                    console.log('item and index',item, index)
                    return (
                        <View className='flex-row w-full justify-between items-center gap-3'>
                            <View className='flex-row gap-3'>
                                <Image
                                    source = {{ uri : item.following.profilePic }}
                                    resizeMode='cover'
                                    style = {{ width:30, height : 30, borderRadius:'50%' }}
                                />
                                <View className=''>
                                    <Text className='text-mainGray  font-pbold '>{item.following.firstName} {item.following.lastName}</Text>
                                    <Text className='text-mainGray text-sm'>@{item.following.username}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={()=>handleRecommendation(item)}  style={{ backgroundColor:Colors.secondary , paddingHorizontal:20, paddingVertical:6, borderRadius:15, flexDirection:'row', gap:10, justifyContent:'center', alignItems:'center'}}>
                                <Handshake color={Colors.primary} size={22} />
                                {/* <Text className='text-primary text-sm font-pbold'>send rec.</Text> */}
                            </TouchableOpacity>

                        </View>
                    ) }}
            />
        </View>
    </ScrollView>
  )
}

export default recommendationModal

const styles = StyleSheet.create({})