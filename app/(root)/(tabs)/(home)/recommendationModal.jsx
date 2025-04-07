// import { ScrollView, StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Dimensions} from 'react-native'
// import { Image } from 'expo-image'
// import React, {useEffect, useState} from 'react'
// import { newRecommendation } from '../../../../api/recommendation'
// import { Colors } from '../../../../constants/Colors'
// import { useUser } from '@clerk/clerk-expo'
// import { getAllMutuals, useFetchOwnerUser } from '../../../../api/user'
// import { useLocalSearchParams } from 'expo-router'
// import { Handshake } from 'lucide-react-native'
// import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
// import ToastMessage from '../../../../components/ui/ToastMessage'

// const recommendationModal = () => {

//     const { user : clerkUser } = useUser()
//     const { data : ownerUser, refetch } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })
//     const [ mutuals, setMutuals ] = useState([])
//     const [ loadingMutuals, setLoadingMutuals ] = useState(false)
//     const [ message , setMessage ] = useState(null)

//     const { DBmovieId, DBtvId, DBcastId } = useLocalSearchParams();
   
//     const useGetAllMutuals = async () => {
//         const mutuals = await getAllMutuals(ownerUser.id);
//         setMutuals(mutuals)
//     }

//     useEffect(()=>{
//         setLoadingMutuals(true)
//         try {
//             useGetAllMutuals();
//         } catch (err){
//             console.log(err)    
//         } finally{
//             setLoadingMutuals(false)
//         }
//     },[])

   

//     const handleRecommendation = async (params) => {
//         let type
//         if (DBmovieId){
//             type = 'MOVIE'
//         } else if (DBtvId){
//             type = 'TV'
//         } else if (DBcastId){
//             type = 'CASTCREW'
//         }
        
//         const data = {
//             recommenderId : ownerUser.id,
//             type,
//             recipientId : params.item.followingId,
//             movieId : Number(DBmovieId) || null,
//             castId : Number(DBcastId) || null,
//             tvId : Number(DBtvId) || null
//         }
        
//         const newRec = await newRecommendation( data );
//         if (newRec){
//             if (params.alreadySent){
//                 setMessage('Deleted previous recommendation')
//             } else {
//                 setMessage(newRec.message)
//             }
//         }
//         refetch();
//     }

//     if (loadingMutuals){
//         return <ActivityIndicator />
//     }



//   return (
//     <ScrollView className='w-full h-full bg-primary' style={{borderRadius:30}}>
//         <View className='h-full w-full justify-center items-center relative gap-5'  style={{paddingTop:60, paddingBottom:120, paddingHorizontal:30, width:'100%', justifyContent:'center', alignItems:'center'}} >
//         <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20 }} />
//             <View className='gap-2' >
//                 <Text className='text-secondary text-2xl font-pbold'>Select a user to send a recommendation to</Text>
//                 <Text className='text-mainGray text-center'>(must be mutual followers)</Text>
//             </View>
//             <ToastMessage message={message} onComplete={() => setMessage('')} icon={ <Handshake  color={Colors.secondary} size={30} />} />

//             <FlatList
//                 scrollEnabled={false}
//                 data ={ mutuals}
//                 keyExtractor = { item => item.id }
//                 contentContainerStyle={{ gap:20, paddingVertical:30 }}
//                 renderItem = { ({item, index}) => {
//                     const alreadySent = ownerUser.recommendationSender.some(element => {
//                         if (element.recipientId !== item.following.id) return false;
//                         if (element.type === 'MOVIE') return element.movieId === Number(DBmovieId);
//                         if (element.type === 'TV') return element.tvId === Number(DBtvId);
//                         if (element.type === 'CAST') return element.castId === Number(DBcastId)
//                         return false;
//                     });
                    
//                     return (
//                         <View className='flex-row w-full justify-between items-center gap-3'>
//                             <View className='flex-row gap-3 justify-center items-center'>
//                                 <Image
//                                     source = {{ uri : item.following.profilePic }}
//                                     contentFit='cover'
//                                     transition={300}
//                                     style = {{ width:45, height : 45, borderRadius:'50%' }}
//                                 />
//                                 <View className=''>
//                                     <Text className='text-mainGray  font-pbold '>{item.following.firstName} {item.following.lastName}</Text>
//                                     <Text className='text-mainGray text-sm'>@{item.following.username}</Text>
//                                 </View>
//                             </View>
//                             <TouchableOpacity onPress={()=>handleRecommendation({item, alreadySent })}  style={{ opacity : alreadySent ? 0.5 : null, backgroundColor: alreadySent ? Colors.primary : Colors.secondary, borderWidth:2, borderColor:Colors.secondary , paddingHorizontal:20, paddingVertical:6, borderRadius:15, flexDirection:'row', gap:10, justifyContent:'center', alignItems:'center'}}>
//                                 <Handshake color={ alreadySent ? Colors.secondary  : Colors.primary} size={22} />
//                                 {/* <Text className='text-primary text-sm font-pbold'>send rec.</Text> */}
//                             </TouchableOpacity>

//                         </View>
//                     ) }}
//             />
//         </View>
//     </ScrollView>
//   )
// }

// export default recommendationModal

// const styles = StyleSheet.create({})



import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RecommendationScreen from '../../../../components/Screens/RecommendationScreen'

const recommendationModal = () => {
  return (
    <RecommendationScreen />
  )
}

export default recommendationModal

const styles = StyleSheet.create({})