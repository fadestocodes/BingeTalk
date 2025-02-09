import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { threads } from '../lib/fakeData'
import { Colors } from '../constants/Colors'
import { ArrowUpIcon, MessageIcon } from '../assets/icons/icons'
import { ArrowDownIcon } from '../assets/icons/icons'
import { useRouter } from 'expo-router'

const DiscussionThread = ({handlePress}) => {
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
        <Text className='text-secondary font-pcourier uppercase underline text-center text-lg'>Threads</Text>
      )}
      renderItem={({item}) => (
        <TouchableOpacity onPress={()=>handlePress(item)} style={{gap:10, borderRadius:10, backgroundColor:Colors.mainGrayDark, marginVertical:10, paddingVertical:20, paddingHorizontal:20}}  >
          <View className='gap-6'>
            <Text className="text-white  font-pbold text-xl leading-6  ">{item.title}</Text>
            { item.caption && (
              <View className='gap-3'>
                <Text className='text-secondary text-lg leading-5 font-pcourier uppercase text-center'>{item.user}</Text>
                <Text className="text-white text-lg leading-5 font-pcourier">{item.caption}</Text>
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
      )}
    >
    </FlatList>
  )
}

export default DiscussionThread

const styles = StyleSheet.create({})

