import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
// import { threads } from '../lib/fakeData'
import { Colors } from '../constants/Colors'
import { ArrowUpIcon, MessageIcon } from '../assets/icons/icons'
import { ArrowDownIcon } from '../assets/icons/icons'
import { useRouter } from 'expo-router'
import { formatDate } from '../lib/formatDate'

const DiscussionThread = ({threadsPress, threads}) => {
  const router = useRouter();

  // const handlePress = (id) => {
  //   router.push(`/threads/${id}`)
  // }

  return (
    <FlatList
      scrollEnabled={false}
      data={threads}
      keyExtractor={(item)=>item.id}
      ListHeaderComponent={(
        <Text className='text-white font-pbold   text-center text-lg'>Threads</Text>
      )}
      renderItem={({item}) => {
        console.log('tiem from thread flatlist', item)
        
        return (
        <TouchableOpacity onPress={()=>threadsPress(item.id)} style={{gap:10, borderRadius:10, backgroundColor:Colors.mainGrayDark, marginVertical:10, paddingTop:15, paddingBottom:20, paddingHorizontal:20}}  >
          <View className='gap-3'>

          <View className='flex-row w-full justify-between items-center'>
                        <View className="flex-row items-center gap-2 ">
                            <Image
                                source={{ uri: item.user.profilePic }}
                                resizeMode='cover'
                                style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                            />
                            <Text className='text-mainGrayDark   ' >@{item.user.username}</Text>
                        </View>
                    <Text className='text-mainGrayDark '>{formatDate(item.createdAt)}</Text>
                    
                </View>

            <View className='flex-row gap-3' >
            { item.tag && (
                  <Text className= 'mt-3 font-pbold text-primary text-xs ' style={{ backgroundColor: item.tag.color , padding:5, borderRadius:10}}>{item.tag.tagName}</Text>
            ) }
            </View>

            <Text className="text-white  font-pbold text-xl leading-6  ">{item.title}</Text>
            { item.caption && (
              <View className='gap-3 my-5'>
                <Text className='text-secondary text-lg leading-5 font-pcourier uppercase text-center'>{item.user.firstName}</Text>
                <Text className="text-white  text-custom font-pcourier" numberOfLines={10} >{item.caption}</Text>
              </View>
            ) }
            <View className='flex-row gap-3'>
              <View  className='flex-row gap-1 ' style={{borderRadius:10, paddingHorizontal:10, paddingVertical:0, borderWidth:0, borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                <ArrowUpIcon size='18' color={Colors.mainGray}></ArrowUpIcon><Text className='text-mainGray'>{item.upVotes}</Text>
              </View>
              <View  className='flex-row gap-1' style={{borderRadius:10, paddingHorizontal:5, paddingVertical:0, borderWidth:0, borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                <ArrowDownIcon size='18' color={Colors.mainGray}></ArrowDownIcon><Text className='text-mainGray'>{item.downVotes}</Text>
              </View>
              <View  className='flex-row gap-1' style={{borderRadius:10, paddingHorizontal:5, paddingVertical:0, borderWidth:0, borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                <MessageIcon size='18' color={Colors.mainGray}></MessageIcon><Text className='text-mainGray'>{item.downVotes}</Text>
              </View>
            </View>
          </View>
          </TouchableOpacity>
      )}}
    >
    </FlatList>
  )
}

export default DiscussionThread

const styles = StyleSheet.create({})

