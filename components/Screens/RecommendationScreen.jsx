import { ScrollView, StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Dimensions, TextInput} from 'react-native'
import { Image } from 'expo-image'
import React, {useEffect, useState, useRef} from 'react'
import { newRecommendation } from '../../api/recommendation'
import { Colors } from '../../constants/Colors'
import { useUser } from '@clerk/clerk-expo'
import { getAllMutuals, useFetchOwnerUser } from '../../api/user'
import { BackIcon } from '../../assets/icons/icons'
import { router, useLocalSearchParams } from 'expo-router'
import { Handshake } from 'lucide-react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, useAnimatedKeyboard } from 'react-native-reanimated';
import ToastMessage from '../ui/ToastMessage'

const RecommendationScreen = () => {

    const { user : clerkUser } = useUser()
    const { data : ownerUser, refetch } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })
    const [ mutuals, setMutuals ] = useState([])
    const [ loadingMutuals, setLoadingMutuals ] = useState(false)
    const [ message , setMessage ] = useState(null)
    const [ whichStep, setWhichStep ] = useState('step1')
    const [ input, setInput ] = useState('')
    const inputRef = useRef(null);  // Create a ref for the input
    const [ recipient, setRecipient ] = useState(null)

    const { DBmovieId, DBtvId, DBcastId } = useLocalSearchParams();
   
    const useGetAllMutuals = async () => {
        const mutuals = await getAllMutuals(ownerUser?.id);
        setMutuals(mutuals)
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


    const keyboard = useAnimatedKeyboard(); // Auto tracks keyboard height
    const translateY = useSharedValue(0); // Tracks modal position
    const atTop = useSharedValue(true); // Track if at top of FlatList
  
    // Move input with keyboard automatically
    const animatedStyle = useAnimatedStyle(() => ({
      bottom: withTiming(keyboard.height.value-20, { duration: 0 }),
    }));
   

    const handleRecommendation = async (params) => {

        console.log('hello')
        if (params.alreadySent && whichStep === 'step1' || whichStep === 'step2' ){
            let type
            if (DBmovieId){
                type = 'MOVIE'
            } else if (DBtvId){
                type = 'TV'
            } else if (DBcastId){
                type = 'CASTCREW'
            }
            
            const data = {
                recommenderId : ownerUser?.id,
                type,
                recipientId : whichStep === 'step1' ? params.item.followingId : recipient.followingId,
                movieId : Number(DBmovieId) || null,
                castId : Number(DBcastId) || null,
                tvId : Number(DBtvId) || null,
                message : input.trim() 

            }
            console.log('data', data)
            
            const newRec = await newRecommendation( data );
            console.log('newrec',newRec)
            if (newRec){

                if (params.alreadySent){
                    setMessage('Deleted previous recommendation')
                } else {
                    setMessage(newRec.message)
                }
            }
            refetch();
            setTimeout(()=>{
                router.back()
            },1000)

        } else if (whichStep === 'step1') {
            setRecipient(params.item)

            setWhichStep('step2')
        } 
    }

  

    if (loadingMutuals || !ownerUser){
        return <ActivityIndicator />
    }



  return (
    <>
            { whichStep === 'step1' ? (
                <ScrollView className='w-full h-full bg-primary' style={{borderRadius:30}}>
        <ToastMessage message={message} onComplete={() => setMessage('')} icon={ <Handshake  color={Colors.secondary} size={30} />} />

        <View className='h-full w-full justify-center items-center relative gap-5'  style={{paddingTop:60, paddingBottom:120, paddingHorizontal:30, width:'100%', justifyContent:'center', alignItems:'center'}} >
            <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20 }} />
                
                    <View className='gap-2' >
                        <Text className='text-secondary text-2xl font-pbold'>Select a user to send a recommendation to</Text>
                        <Text className='text-mainGray text-center'>(must be mutual followers)</Text>
                    </View>
        
                    <FlatList
                        scrollEnabled={false}
                        data ={ mutuals}
                        keyExtractor = { item => item.id }
                        contentContainerStyle={{ gap:20, paddingVertical:30 }}
                        renderItem = { ({item, index}) => {
                            const alreadySent = ownerUser.recommendationSender.some(element => {
                                if (element.recipientId !== item.following.id) return false;
                                if (element.type === 'MOVIE') return element.movieId === Number(DBmovieId);
                                if (element.type === 'TV') return element.tvId === Number(DBtvId);
                                if (element.type === 'CAST') return element.castId === Number(DBcastId)
                                return false;
                            });
                            return (
                                <View className='flex-row w-full justify-between items-center gap-3'>
                                    <View className='flex-row gap-3 justify-center items-center'>
                                        <Image
                                            source = {{ uri : item.following.profilePic }}
                                            contentFit='cover'
                                            transition={300}
                                            style = {{ width:45, height : 45, borderRadius:'50%' }}
                                        />
                                        <View className=''>
                                            <Text className='text-mainGray  font-pbold '>{item.following.firstName} {item.following.lastName}</Text>
                                            <Text className='text-mainGray text-sm'>@{item.following.username}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={()=>{ handleRecommendation({item, alreadySent })}}  style={{ opacity : alreadySent ? 0.5 : null, backgroundColor: alreadySent ? Colors.primary : Colors.secondary, borderWidth:2, borderColor:Colors.secondary , paddingHorizontal:20, paddingVertical:6, borderRadius:15, flexDirection:'row', gap:10, justifyContent:'center', alignItems:'center'}}>
                                        <Handshake color={ alreadySent ? Colors.secondary  : Colors.primary} size={22} />
                                        {/* <Text className='text-primary text-sm font-pbold'>send rec.</Text> */}
                                    </TouchableOpacity>
        
                                </View>
                            ) }}
                    />
                      </View>
                      </ScrollView>
            ) : whichStep === 'step2' && (
                <>

                    <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20 , alignSelf:'center'}} />
                    <TouchableOpacity onPress={()=>setWhichStep('step1')} style={{ position:'absolute', left:20, top : 50 }}>
                        <BackIcon size={22} color={Colors.mainGray} />
                    </TouchableOpacity>
                    <Text className='text-white font-pbold text-2xl self-center pt-14'>Send a message with your recommendation!</Text>
                    <Animated.View style={[styles.inputContainer, animatedStyle]}>
                    <ToastMessage message={message} onComplete={() => setMessage('')} icon={ <Handshake  color={Colors.secondary} size={30} />} />


              <View className="relative gap-3">
            

                <TextInput
                  multiline
                  ref={inputRef}
                  placeholder="Include a message (optional)"
                  placeholderTextColor="#888"
                  scrollEnabled={true}
                  value={input}
                  maxLength={200}
                  onChangeText={setInput}
                  style={styles.textInput}
                />
              
                  <TouchableOpacity
                    disabled={!input}
                    style={styles.sendButton}
                    onPress={handleRecommendation}
                  >
                    <Handshake  size={22} color={Colors.primary} />
                  </TouchableOpacity>
              </View>
            </Animated.View>
            </>
            )}
                                </>

      
  )
}

export default RecommendationScreen


const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: Colors.primary,
    },
    inputContainer: {
      width: '100%',
      paddingHorizontal: 15,
      backgroundColor: Colors.primary,
      position: 'absolute',
      bottom:100,
      height:150,
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
      paddingLeft: 20,
      paddingRight:80,
      minHeight: 40,
      maxHeight: 150,
      textAlignVertical: 'center',
    },
    sendButton: {
      position: 'absolute',
      bottom: 12,
      right: 10,
      backgroundColor: Colors.secondary,
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderRadius: 15,
    },
  });