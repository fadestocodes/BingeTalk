import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity,FlatList,Image, ActivityIndicator } from 'react-native';
import React, { useState , useRef} from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, useAnimatedKeyboard } from 'react-native-reanimated';
import { GestureDetector, Gesture} from 'react-native-gesture-handler';
import { Colors } from '../../constants/Colors';
import { createComment } from '../../api/comments';
import { useFetchDialogues } from '../../api/dialogue';
import { formatDate } from '../../lib/formatDate';
import { HeartIcon, CloseIcon } from '../../assets/icons/icons';
import { ThumbsDown, ThumbsUp } from 'lucide-react-native';

const CommentsModalPage = () => {

    const router = useRouter();
    const {userId, dialogueId} = useLocalSearchParams();
    console.log('params', userId, dialogueId)
    // const dialogueId = id;
    // const { userDB, updateUserDB } = useUserDB()

    const {data: dialogues, isFetching, refetch} = useFetchDialogues( Number(userId) );
    // console.log('dialogues here ', dialogues)
    const selectedDialogue = dialogues?.find( item => item.id === Number(dialogueId) )
    console.log(selectedDialogue)
    const [ replyingTo, setReplyingTo ] = useState(null)
    const inputRef = useRef(null);  // Create a ref for the input
    const [ replying, setReplying ] = useState(false)
    const [ visibleReplies, setVisibleReplies  ] = useState({})

  
    const [input, setInput] = useState('');
    const keyboard = useAnimatedKeyboard(); // Auto tracks keyboard height
    const translateY = useSharedValue(0); // Tracks modal position
    const atTop = useSharedValue(true); // Track if at top of FlatList
  
    // Move input with keyboard automatically
    const animatedStyle = useAnimatedStyle(() => ({
      bottom: withTiming(keyboard.height.value, { duration: 0 }),
    }));
  
    // Detect if FlatList is at the top
    const handleScroll = (event) => {
      const scrollOffset = event.nativeEvent.contentOffset.y;
      atTop.value = scrollOffset <= 0;
    };
  
    // Gesture for swipe-to-close (only when at top)
    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        if (atTop.value && event.translationY > 0) {
          translateY.value = event.translationY;
        }
      })
      .onEnd((event) => {
        if (event.translationY > 100) {
          translateY.value = withSpring(500, { damping: 10 }); // Close modal
        } else {
          translateY.value = withSpring(0); // Snap back
        }
      });

    const handlePostComment =  async ({ parentId = null }) => {
        console.log(input)

        console.log('will try to reate comment')
        const commentData = {
            userId : Number(userId),
            dialogueId : Number(dialogueId),
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
        refetch();

    }

    const handleReply= (item, parentId) => {
        inputRef.current?.focus();  // Focus the input
        setReplying(true);
        setInput(`@${item.user.username} `)
        
        const replyingToData = {
            user : item.user,
            dialogueId : Number(dialogueId),
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

    if (!selectedDialogue){
        return <ActivityIndicator></ActivityIndicator>
    }


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>

        <View style={{paddingBottom:100, paddingTop:30}}>
            <FlatList
            data={selectedDialogue.comments}
            keyExtractor={(item, index) => index.toString()}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item }) =>{

                const shownReplies = visibleReplies[item.id] || 0;
                
                return (
                <View>
                    { isFetching && (
                        <ActivityIndicator></ActivityIndicator>
                    ) }

                { !item.parentId && (

                    <View className='w-full px-5 justify-center items-center gap-3 my-3'>
                    <View className='flex-row w-full justify-between items-center'>
                            <View className="flex-row items-center gap-2">
                                <Image
                                    source={{ uri: item.user.profilePic }}
                                    resizeMode='cover'
                                    style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                                />
                                <Text className='text-mainGrayDark' >@{item.user.username}</Text>
                            </View>
                            <Text className='text-mainGrayDark '>{formatDate(item.createdAt)}</Text>
                        </View>
                        <Text className='text-secondary uppercase font-pcourier'>{item.user.firstName}</Text>
                        <Text className='text-white font-pcourier'>{item.content}</Text>

                        <View className='flex-row gap-3 w-full justify-start items-center'>

                            <TouchableOpacity onPress={()=>handleReply(item, item.id)}  style={{borderRadius:10, borderWidth:1, borderColor:Colors.mainGray, paddingVertical:5, paddingHorizontal:8}} >
                                <Text className='text-mainGray text-sm'>Reply</Text>
                            </TouchableOpacity>

                            <View className='flex-row  justify-center items-center gap-3  ' style={{height:32, borderColor:Colors.mainGray}}>
                                {/* <HeartIcon  size='20' color={Colors.mainGray} />
                                {item?.likes !== undefined && item?.likes > 0 ? 
                                (
                                    <Text className='text-xs font-pbold text-gray-400'>{item.likes}</Text>
                                ) : null} */}
                                <TouchableOpacity style={{ borderWidth:1, borderRadius:10, borderColor:Colors.mainGray, padding:5 }} >
                                    <View className='flex-row gap-2 justify-center items-center'>
                                        <ThumbsUp size={16} color={Colors.mainGray} ></ThumbsUp>
                                        <Text className='text-xs font-pbold text-mainGray'>{ item.upvotes }</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ borderWidth:1, borderRadius:10, borderColor:Colors.mainGray, padding:5 }} >

                                <View className='flex-row gap-2 justify-center items-center'>
                                    <ThumbsDown size={18} color={Colors.mainGray} ></ThumbsDown>
                                    <Text  className='text-xs font-pbold text-mainGray'>{ item.downvotes }</Text>
                                </View>
                                </TouchableOpacity>
                            </View>
                            
                        
                        
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
                                    resizeMode='cover'
                                    style={{ borderRadius:'50%', overflow:'hidden', width:25, height:25 }}
                                />
                                <Text className='text-mainGrayDark   ' >@{reply.user.username}</Text>
                            </View>
                            <Text className='text-mainGrayDark '>{formatDate(reply.createdAt)}</Text>
                        </View>
                        <Text className='text-secondary uppercase font-pcourier'>{reply.user.firstName}</Text>
                        <Text className='text-white font-pcourier'>{reply.content}</Text>

                        <View className='flex-row gap-3 w-full justify-start items-center  pl-10'>

                            

                            <TouchableOpacity onPress={()=>handleReply(item, item.id)}  style={{borderRadius:10, borderWidth:1, borderColor:Colors.mainGray, paddingVertical:5, paddingHorizontal:8}} >
                                <Text className='text-mainGray text-sm'>Reply</Text>
                            </TouchableOpacity>

                            <View className='flex-row  justify-center items-center gap-3  ' style={{height:32, borderColor:Colors.mainGray}}>
                                {/* <HeartIcon  size='20' color={Colors.mainGray} />
                                {item?.likes !== undefined && item?.likes > 0 ? 
                                (
                                    <Text className='text-xs font-pbold text-gray-400'>{item.likes}</Text>
                                ) : null} */}
                                <TouchableOpacity style={{ borderWidth:1, borderRadius:10, borderColor:Colors.mainGray, padding:5 }} >
                                    <View className='flex-row gap-2 justify-center items-center'>
                                        <ThumbsUp size={16} color={Colors.mainGray} ></ThumbsUp>
                                        <Text className='text-xs font-pbold text-mainGray'>{ item.upvotes }</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ borderWidth:1, borderRadius:10, borderColor:Colors.mainGray, padding:5 }} >

                                <View className='flex-row gap-2 justify-center items-center'>
                                    <ThumbsDown size={18} color={Colors.mainGray} ></ThumbsDown>
                                    <Text  className='text-xs font-pbold text-mainGray'>{ item.downvotes }</Text>
                                </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    )) }

                    { shownReplies < item.replies.length && (
                        <View className='px-5 mb-3'>
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


        </View>
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

      </Animated.View>
    </GestureDetector>
  </TouchableWithoutFeedback>
  )
}

export default CommentsModalPage


const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: Colors.primary,
      borderRadius: 30,
    },
    inputContainer: {
      width: '100%',
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: '#111',
      position: 'absolute',
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
  