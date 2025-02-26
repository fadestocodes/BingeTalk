import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
// import { threads } from '../lib/fakeData'
import { Colors } from '../constants/Colors'
import { ArrowUpIcon, MessageIcon, RepostIcon,ThreeDotsIcon } from '../assets/icons/icons'
import { ArrowDownIcon } from '../assets/icons/icons'
import { useRouter } from 'expo-router'
import { formatDate } from '../lib/formatDate'
import { ThumbsDown, ThumbsUp } from 'lucide-react-native';


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
        console.log('tiem from item flatlist', item)
        
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
            
            <View className='flex-row  justify-between w-full my-3 items-center'>
                        <View className='flex-row gap-5 justify-center items-center'>
                            <TouchableOpacity  >
                                <View className='flex-row gap-2 justify-center items-center'>
                                    <ThumbsUp size={16} color={Colors.mainGray} ></ThumbsUp>
                                    <Text className='text-xs font-pbold text-mainGray'>{ item.upvotes }</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity  >
                            <View className='flex-row gap-2 justify-center items-center'>
                                <ThumbsDown size={18} color={Colors.mainGray} ></ThumbsDown>
                                <Text  className='text-xs font-pbold text-mainGray'>{ item.downvotes }</Text>
                            </View>
                            </TouchableOpacity>
                            <View className='flex-row  justify-center items-center   ' style={{height:32, borderColor:Colors.mainGray}}>
                                <MessageIcon   className='' size='18' color={Colors.mainGray} />
                                { item.downVotes && item.downVotes > 0 && (
                                <Text className='text-xs font-pbold text-gray-400  '> {item.downVotes}</Text>
                                )  }
                            </View>
                            <TouchableOpacity >
                            <View className='flex-row  justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                                <RepostIcon className='' size='14' color={Colors.mainGray} />
                                { item.credits && item.reposts > 0 && (
                                <Text className='text-xs font-pbold text-gray-400  '> {item.reposts}</Text>
                                )  }
                            </View>
                            </TouchableOpacity>
                        </View>
                        <View className='relative' >
                            <TouchableOpacity   >
                            <View className='flex-row  justify-center items-center  ' style={{height:32, borderColor:Colors.mainGray}}>
                                <ThreeDotsIcon className='' size='14' color={Colors.mainGray} />
                            </View>
                            </TouchableOpacity>
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

