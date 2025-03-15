import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import React, {useState, useEffect} from 'react'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../../../api/user'
import { useGetAllNotifs, markNotifRead } from '../../../../api/notification'
import { Colors } from '../../../../constants/Colors'
import { formatDate } from '../../../../lib/formatDate'
import { Star, ListChecks, MessagesSquare, MessageSquare } from 'lucide-react-native'
import { ProgressCheckIcon } from '../../../../assets/icons/icons'


const Notification = () => {
  const { user : clerkUser } = useUser();
  const { data : ownerUser } = useFetchOwnerUser({email : clerkUser.emailAddresses[0].emailAddress})
  const { data : notifications, loading , hasMore, refetch} = useGetAllNotifs(ownerUser.id, 10);
  console.log('notfications', notifications)
  
  
  
  useEffect(  () => {
    const useMarkRead = async () => {
      console.log('trying to mark')
      const notifData = notifications.map( item => item.id )
      const marked = await markNotifRead( notifData )
      console.log('marked', marked)
    }
    useMarkRead();
  }, [])

  // if (loading){
  //   return <ActivityIndicator />
  // }


  return (
    <SafeAreaView className='w-full h-full bg-primary' style={{}}>
     
    <View className='w-full  pt-3 px-6 gap-5' style={{paddingBottom:200}}>
      <View className="gap-3">
          <View className='flex-row gap-2 justify-start items-center'>

            {/* <TVIcon size={30} color='white' /> */}
            <Text className='text-white font-pbold text-3xl'>Notifications</Text>
          </View>
          <Text className='text-mainGray font-pmedium'>Check out the most bingeable shows right now.</Text>
      </View>
      {/* <TouchableOpacity  style={{ position:'absolute', top:0, right:30 }}>
        <Image
          source={{ uri: ownerUser.profilePic }}
          contentFit='cover'
          style={{ width:30, height:30, borderRadius:50 }}
        />
      </TouchableOpacity> */}

      <View className='w-full my-2 gap-3' style={{paddingBottom:30}}>
        <FlatList
          data={notifications }
          keyExtractor={(item, index) => index}
          onEndReached={()=>{
            if (hasMore){
              refetch()
            }
          }}
          onEndReachedThreshold={0}
          contentContainerStyle={{width:'100%',  gap:15}}
          renderItem={({item}) => {
            console.log('flatlist item', item)
            
            return (
            <TouchableOpacity className='w-full' style={{ backgroundColor:Colors.mainGrayDark, padding:15, borderRadius:15, minHeight:110, gap:15, opacity: item.isRead ? 0.5 : 1  }}>
              <View className='flex-row gap-2 justify-between items-center'>
                <View className='flex-row gap-2 justify-center items-center'>
                  <Image 
                    source={{ uri : item.user.profilePic }}
                    style={{ width:30, height:30, borderRadius:50 }}
                    contentFit='cover'
                  />
                  <Text className='text-mainGrayDark'>@{item.user.username}</Text>
                </View>
                <Text className='text-mainGrayDark'>{ formatDate(item.createdAt)}</Text>
              </View>
              <View className='flex-row gap-2 justify-center items-center'>
              { item.rating ? <Star size={18} color={Colors.secondary} /> : item.dialogueId ? <MessageSquare size={18} color={Colors.secondary} /> :
                  item.activityType === 'CURRENTLY_WATCHING' ? <ProgressCheckIcon size={18} color={Colors.secondary} /> : item.activityType==='WATCHLIST' && <ListChecks size={18} color={Colors.secondary} />  }
                <Text className='text-mainGray'>{item.user.firstName} {item.description}</Text>
              </View>
            </TouchableOpacity>
          )}}
        
        />
      
      </View>
    </View>
  </SafeAreaView>
  )
}

export default Notification

const styles = StyleSheet.create({})