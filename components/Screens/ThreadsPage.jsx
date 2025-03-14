import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform , ActivityIndicator} from 'react-native'
import { Image } from 'expo-image'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/Colors'
import { useLocalSearchParams } from 'expo-router'
import { ArrowDownIcon, UpIcon, DownIcon, ArrowUpIcon, MessageIcon, HeartIcon, CloseIcon, RepostIcon, ThreeDotsIcon } from '../../assets/icons/icons'
import { formatDate } from '../../lib/formatDate'
import { GestureDetector, Gesture} from 'react-native-gesture-handler';
import { createComment } from '../../api/comments'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../api/user'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { fetchSingleThread , threadInteraction, useFetchSingleThread} from '../../api/thread'
import { ThumbsDown, ThumbsUp } from 'lucide-react-native';
import ThreadCard from '../ThreadCard'




import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, useAnimatedKeyboard } from 'react-native-reanimated';


const ThreadsIdPage = () => {


    

   
    const [ input, setInput ] = useState('')
    const inputRef = useRef(null);  // Create a ref for the input
    const [ replyingTo, setReplyingTo ] = useState(null)
    const [ replying, setReplying ] = useState(false)
    const [ visibleReplies, setVisibleReplies  ] = useState({})
    const { user : clerkUser } = useUser();
    const { data: ownerUser } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })
    const userId = ownerUser.id
    const queryClient = useQueryClient();


    // console.log('threads array', threads)
    const [replyTracker, setReplyTracker] = useState({});


    const { threadsId, tvId, movieId, castId }= useLocalSearchParams();
    console.log(threadsId, tvId)
    // const queryClient = useQueryClient();

    // const [ thread, setThread ] = useState(null)

    const { data: thread , refetch, isFetching} = useFetchSingleThread(Number(threadsId))
    console.log('thread from hook', thread)


    
    const keyboard = useAnimatedKeyboard(); // Auto tracks keyboard height
    const translateY = useSharedValue(0); // Tracks modal position
    const atTop = useSharedValue(true); // Track if at top of FlatList
  
    // Move input with keyboard automatically
    const animatedStyle = useAnimatedStyle(() => ({
      bottom: withTiming(keyboard.height.value-20, { duration: 0 }),
    }));


    if (!thread){
        return <ActivityIndicator/>
    }
    

   



    const loadMoreReplies = (commentId) => {
        setReplyTracker((prevData) => ({
            ...prevData,
            [commentId] : ( commentId || 2 ) + 5
        }));
    }



    const handleReply= (item, parentId) => {
        inputRef.current?.focus();  // Focus the input
        setReplying(true);
        setInput(`@${item.user.username} `)
        
        const replyingToData = {
            user : item.user,
            threadId : Number(thread.id),
            content : item.content,
            parentId
        }
        setReplyingTo(replyingToData)
    }


    const handleReplyClose = () => {
        setReplying(false);
        setInput('');
        setReplyingTo(null)
    }

    const handleViewReplies = ( commentId, totalReplies ) => {
        setVisibleReplies( prev => ({
            ...prev,
            [commentId] : Math.min( ( prev[commentId] || 0 ) + 5 , totalReplies)
        }) )
    }



    const handlePostComment =  async ({ parentId = null }) => {
        console.log(input)

        console.log('will try to reate comment')
        const commentData = {
            userId : Number(userId),
            threadId : Number(thread.id),
            content : input,
            parentId : replyingTo ? replyingTo.parentId : null
        }
        console.log('commentData', commentData)
    
        const newComment = await createComment( commentData );
        console.log('newcomment', newComment);
        setInput('');
        setReplyingTo(null)
        setReplying(false)
        inputRef.current?.blur();
        console.log('calling refetch')
        // await refetch();
        // await getThread()
        refetch();
        console.log('after refetch')

    }   


    const handleInteraction =  async (type, thread) => {
        console.log('type', type)
        const data = {
            type,
            threadId : Number(threadsId),
            userId : ownerUser.id
        }
        const updatedDialogue = await threadInteraction(data)
        refetch();
    }





  return (
    <SafeAreaView className='h-full pb-32 relative' style={{backgroundColor:Colors.primary}} >
     
        <>
        <ScrollView className='bg-primary pt-12  relative ' >

        <View style={{gap:10, marginVertical:10, paddingTop:0, paddingHorizontal:20, paddingBottom:100}}  >
          <View className='gap-3'>

          <ThreadCard thread={thread} refetch={refetch} showThreadTopic={true} />
          <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>

                { thread.comments.length > 0 && (
                    <>
                    <FlatList
                    data={thread.comments}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    renderItem={({ item }) =>{
    
                        const shownReplies = visibleReplies[item.id] || 0;
                        console.log(item)
                        
                        return (
                        <View>
                         
    
                        { !item.parentId && (
    
                            <View className='w-full  justify-center items-center gap-3 my-3'>
                            <View className='flex-row w-full justify-between items-center'>
                                    <View className="flex-row items-center gap-2">
                                        <Image
                                            source={{ uri: item.user.profilePic }}
                                            contentFit='cover'
                                            style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                                        />
                                        <Text className='text-mainGrayDark' >@{item.user.username}</Text>
                                    </View>
                                    <Text className='text-mainGrayDark '>{formatDate(item.createdAt)}</Text>
                                </View>
                                <Text className='text-secondary text-lg uppercase font-pcourier'>{item.user.firstName}</Text>
                                <Text className='text-white text-custom font-pcourier'>{item.content}</Text>
    
                                <View className='flex-row gap-3 w-full justify-start items-center'>
    
                                    <TouchableOpacity onPress={()=>handleReply(item, item.id)}  style={{borderRadius:5, borderWidth:1, borderColor:Colors.mainGray, paddingVertical:3, paddingHorizontal:8}} >
                                        <Text className='text-mainGray text-sm'>Reply</Text>
                                    </TouchableOpacity>
    
                                    <TouchableOpacity >
                                    <View className='flex-row  justify-center items-center  py-1 px-2 ' style={{height:32, borderColor:Colors.mainGray}}>
                                        <HeartIcon  size='20' color={Colors.mainGray} />
                                        {item?.likes !== undefined && item?.likes > 0 ? 
                                        (
                                            <Text className='text-xs font-pbold text-gray-400'>{item.likes}</Text>
                                        ) : null}
                                    </View>
                                    </TouchableOpacity>
                                    
                                
                                
                                </View>
                            </View>
                        ) }
    
    
                        { item.replies.length > 0 && (
                            <>
                            { item.replies.slice(0, shownReplies).map((reply) => (
                               <View key={reply.id}  className=' ml-10 pr-5 justify-center items-center gap-3 my-3' style={{ borderLeftWidth:1, borderColor:Colors.secondary, borderBottomLeftRadius:10 }}>
                            <View className='flex-row w-full justify-between items-center'>
                                    <View className="flex-row items-center gap-2 pl-10">
                                        <Image
                                            source={{ uri: reply.user.profilePic }}
                                            contentFit='cover'
                                            style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                                        />
                                        <Text className='text-mainGrayDark   ' >@{reply.user.username}</Text>
                                    </View>
                                    <Text className='text-mainGrayDark '>{formatDate(reply.createdAt)}</Text>
                                </View>
                                <Text className='text-secondary text-lg uppercase font-pcourier'>{reply.user.firstName}</Text>
                                <Text className='text-white text-custom font-pcourier'>{reply.content}</Text>
    
                                <View className='flex-row gap-3 w-full justify-start items-center  pl-10'>
    
                                    <TouchableOpacity onPress={()=>handleReply(reply, item.id)}  style={{borderRadius:5, borderWidth:1, borderColor:Colors.mainGray, paddingVertical:3, paddingHorizontal:8}} >
                                        <Text className='text-mainGray text-sm'>Reply</Text>
                                    </TouchableOpacity>
    
                                    <TouchableOpacity >
                                    <View className='flex-row  justify-center items-center  py-1 px-2 ' style={{height:32, borderColor:Colors.mainGray}}>
                                        <HeartIcon className=' ' size='20' color={Colors.mainGray} />
                                        {item?.likes !== undefined && item?.likes > 0 ? 
                                        (
                                            <Text className='text-xs font-pbold text-gray-400'>{item.likes}</Text>
                                        ) : null}
                                    </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
    
                            )) }
    
                            { shownReplies < item.replies.length && (
                                <View className='px-10'>
                                    <TouchableOpacity onPress={()=> handleViewReplies(item.id, item.replies.length)} >
                                        <Text className='text-mainGray text-sm font-pbold'>View { item.replies.length - shownReplies } {item.replies.length === 1 ? 'reply' : item.replies.length - shownReplies ? 'reply' :  'replies'}</Text>
                                    </TouchableOpacity>
    
                                </View>
                            ) }
                            </>
                        
                        
                        ) }
                        </View>
    
                    )}}
                    
                    />
                    </>

                ) }





          </View>
          </View>

        </ScrollView>
       
            <Animated.View style={[styles.inputContainer, animatedStyle]}>
              <View className="relative gap-3">
              { replying && (
                <View className='px-5'style={{ borderRadius:15, paddingHorizontal:5, paddingVertical:10, backgroundColor:Colors.primary , position:'relative'}} >
                    <Text style={{paddingRight:20}} numberOfLines={2} className='text-mainGrayDark'>Replying to {replyingTo.user.firstName}: {replyingTo.content}</Text>
                    <TouchableOpacity onPress={handleReplyClose} style={{ position: 'absolute', right:15, top:8 }} >
                        <CloseIcon color={Colors.mainGray} size={20} ></CloseIcon>
                    </TouchableOpacity>
                </View>

                ) }
                <TextInput
                  multiline
                  ref={inputRef}
                  placeholder="Add a comment..."
                  placeholderTextColor="#888"
                  scrollEnabled={true}
                  value={input}
                  onChangeText={setInput}
                  style={styles.textInput}
                />
                {input && (
                  <TouchableOpacity
                    disabled={!input}
                    style={styles.sendButton}
                    onPress={()=>handlePostComment({parentId : null} )}
                  >
                    <Text style={{ color: Colors.primary }}>↑</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
            </>


    </SafeAreaView>
  )
}

export default ThreadsIdPage


ThreadsIdPage.options = {
    headerShown: false,  // Optional: Hide header if not needed
  }


  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: Colors.primary,
    },
    inputContainer: {
      width: '100%',
      paddingHorizontal: 15,
      backgroundColor: '#111',
      position: 'absolute',
      bottom:100,
      height:200,
      left: 0,
      right: 0,
      paddingBottom: 50,
      paddingTop: 10,
      borderTopWidth: 0,
      borderColor: '#333',
    },
    textInput: {
      backgroundColor: '#222',
      color: 'white',
      fontFamily: 'courier',
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 20,
      minHeight: 40,
      maxHeight: 150,
      textAlignVertical: 'center',
    },
    sendButton: {
      position: 'absolute',
      bottom: 12,
      right: 20,
      backgroundColor: Colors.secondary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 15,
    },
  });
  