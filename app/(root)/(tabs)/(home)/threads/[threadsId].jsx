import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../../../../constants/Colors'
import { useLocalSearchParams } from 'expo-router'
import { threads } from '../../../../../lib/fakeData'
import { ArrowDownIcon } from '../../../../../assets/icons/icons'
import { ArrowUpIcon } from '../../../../../assets/icons/icons'
import { MessageIcon } from '../../../../../assets/icons/icons'

const ThreadsIdPage = () => {

    const {threadsId} = useLocalSearchParams();
    // console.log('threads array', threads)
    const mainThread = threads.find( (item) => item.id === Number(threadsId) );
    const [replyTracker, setReplyTracker] = useState({});

    const loadMoreReplies = (commentId) => {
        setReplyTracker((prevData) => ({
            ...prevData,
            [commentId] : ( commentId || 2 ) + 5
        }));
    }


  return (
    <SafeAreaView className='h-full pb-32 ' style={{backgroundColor:Colors.primary}} >
        <ScrollView className='bg-primary pt-12 px-4'>
        <View style={{gap:10, borderRadius:10, borderWidth:2, borderColor:Colors.mainGray, marginVertical:10, paddingVertical:20, paddingHorizontal:20}}  >
          <View className='gap-3'>
            <Text className="text-mainGray  font-pbold text-2xl leading-6  ">{mainThread.title}</Text>
            { mainThread.caption && (
              <View className='gap-3'>
                <Text className='text-mainGray text-lg leading-5 font-pcourier uppercase text-center'>{mainThread.user}</Text>
                <Text className="text-mainGray text-lg leading-5 font-pcourier">{mainThread.caption}</Text>
              </View>
            ) }
            <View className='flex-row gap-3'>
              <TouchableOpacity className='flex-row gap-3 ' style={{borderRadius:10, paddingHorizontal:10, paddingVertical:5, borderWidth:1, borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                <ArrowUpIcon size='13' color={Colors.mainGray}></ArrowUpIcon><Text className='text-mainGray'>{mainThread.upVotes}</Text>
              </TouchableOpacity>
              <TouchableOpacity className='flex-row gap-3' style={{borderRadius:10, paddingHorizontal:5, paddingVertical:2, borderWidth:1, borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                <ArrowDownIcon size='13' color={Colors.mainGray}></ArrowDownIcon><Text className='text-mainGray'>{mainThread.downVotes}</Text>
              </TouchableOpacity>
              <TouchableOpacity className='flex-row gap-3' style={{borderRadius:10, paddingHorizontal:5, paddingVertical:2, borderWidth:1, borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                <MessageIcon size='13' color={Colors.mainGray}></MessageIcon><Text className='text-mainGray'>{mainThread.downVotes}</Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
        <FlatList
            scrollEnabled={false}
            data={mainThread.commentList}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => {
                 const tracker = replyTracker[item.id] || 2;
                 return (
                <View className={`pt-5 mt-5 mb-3  gap-3 px-3 }`} style={{borderTopWidth:.2, borderColor:Colors.mainGray}}>     

                    <View className="mb-0 gap-3">
                        <Text className='text-mainGray text-lg leading-5 font-pcourier uppercase text-center'>{item.user}</Text>
                        <Text className='text-mainGray text-lg leading-5 font-pcourier'>{item.comment}</Text>
                        <View className='flex-row gap-3 '>
                            <TouchableOpacity className='flex-row gap-3 ' style={{borderRadius:10, paddingHorizontal:10, paddingVertical:5, borderWidth:1, borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                                <ArrowUpIcon size='13' color={Colors.mainGray}></ArrowUpIcon><Text className='text-mainGray'>{item.upVotes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className='flex-row gap-3' style={{borderRadius:10, paddingHorizontal:5, paddingVertical:2, borderWidth:1, borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                                <ArrowDownIcon size='13' color={Colors.mainGray}></ArrowDownIcon><Text className='text-mainGray'>{item.downVotes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className='flex-row gap-3' style={{borderRadius:10, paddingHorizontal:5, paddingVertical:2, borderWidth:1, borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                                <MessageIcon size='13' color={Colors.mainGray}></MessageIcon><Text className='text-mainGray'>{item.replies.length}</Text>
                            </TouchableOpacity>
                        </View>
                        {/* { item.replies.length < 1 && (
                            <View className='border-t-[.3px] mt-7 h-1 border-mainGray'/>
                        ) } */}

                    </View>
                    { item.replies.length > 0 && (

                        <FlatList
                            scrollEnabled={false}
                            data={item.replies.slice(0,tracker)}
                            keyExtractor={(replyItem) => replyItem.id.toString()}
                            renderItem={({item : replyItem}) => (
                                <>
                                <View className='ml-4 pl-5 pt-4 pb-5 border-l-[.2px] border-secondary gap-3'>
                                    <Text className='text-mainGray text-lg leading-5 font-pcourier uppercase text-center'>{replyItem.user}</Text>
                                    <Text className='text-mainGray text-lg leading-5 font-pcourier'>{replyItem.comment}</Text>
                                    <View className='flex-row gap-3'>
                                        <TouchableOpacity className='flex-row gap-3 ' style={{borderRadius:10, paddingHorizontal:10, paddingVertical:5, borderWidth:1, borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                                            <ArrowUpIcon size='13' color={Colors.mainGray}></ArrowUpIcon><Text className='text-mainGray'>{replyItem.upVotes}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className='flex-row gap-3' style={{borderRadius:10, paddingHorizontal:5, paddingVertical:2, borderWidth:1, borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                                            <ArrowDownIcon size='13' color={Colors.mainGray}></ArrowDownIcon><Text className='text-mainGray'>{replyItem.downVotes}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className='flex-row gap-3' style={{borderRadius:10, paddingHorizontal:5, paddingVertical:2, borderWidth:1, borderColor:Colors.mainGray, justifyContent:'center', alignItems:'center'}}>
                                            <MessageIcon size='13' color={Colors.mainGray}></MessageIcon><Text className='text-mainGray'>{replyItem.replies.length}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </>
                            )}

                            ListFooterComponent={(
                                <View className='mt-3  px-0 '>
                                { tracker < item.replies.length && (
                                <TouchableOpacity className='rounded-md bg-mainGrayDark  py-1 w-full ' onPress={()=>loadMoreReplies(item.id)}>
                                    <Text className='text-primary font-psemibold text-sm px-10 text-center '>Load more dialogues...</Text>
                                </TouchableOpacity>
                                ) }
                                </View>

                            )}
                            >
                        </FlatList>
                        
                    ) }
                </View>
                 )
            }}
        >

        </FlatList>
        </ScrollView>
    </SafeAreaView>
  )
}

export default ThreadsIdPage

const styles = StyleSheet.create({})

ThreadsIdPage.options = {
    headerShown: false,  // Optional: Hide header if not needed
  };