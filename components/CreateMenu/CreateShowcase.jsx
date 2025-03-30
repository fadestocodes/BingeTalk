import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ActivityIndicator, FlatList, Animated, Dimensions, ScrollView, PanResponder, KeyboardAvoidingView } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import { Colors } from '../../constants/Colors'
import { SlateIcon, PeopleIcon, ThreadsIcon, CloseIcon, MinusIcon, PlusIcon } from '../../assets/icons/icons'
import { pickMultipleImages } from '../../lib/pickImage'    
import { PanGestureHandler, State } from 'react-native-gesture-handler';



const CreateShowcase = ( {handleChange, content} ) => {
    const image = [ 'https://d1tt6az15s5jpp.cloudfront.net/1738886122081.jpg1738886121986', 'https://d1tt6az15s5jpp.cloudfront.net/1738886081202.jpg1738886081094' ]
    // const [ image, setImage] = useState([])
    const [ loadingImage, setLoadingImage] = useState(false)
    const flatListRef = useRef(null);
    // const currentIndex = useRef(0);
    const translateX = useRef(new Animated.Value(0)).current;
    const currentIndex = useRef(0);
    const [ credits, setCredits ] = useState([]);
    const [ creditLines, setCreditLines ] = useState([ { id: Date.now() } ])

    const [index, setIndex] = useState(0);
    const { width } = Dimensions.get('window');


    const addCreditLine = () => {
        setCreditLines( prev => [ ...prev, { id : Date.now() } ] )
    }

    const removeLine = ( id ) => {
        setCreditLines( prev => prev.filter( i => i.id !== id ) )
    }


    const posterURL = 'https://image.tmdb.org/t/p/original';
   
  
    // const onHandlerStateChange = ({ nativeEvent }) => {
    //     if (nativeEvent.state === State.END) {
    //       const swipeDistance = nativeEvent.translationX;
    //       const threshold = width * 0.2; // Minimum swipe distance to change image
    
    //       if (swipeDistance > threshold && currentIndex.current > 0) {
    //         // Swipe Right (Previous)
    //         currentIndex.current -= 1;
    //       } else if (swipeDistance < -threshold && currentIndex.current < image.length - 1) {
    //         // Swipe Left (Next)
    //         currentIndex.current += 1;
    //       }
    
    //       flatListRef.current?.scrollToIndex({ index: currentIndex.current, animated: true });
    
    //       // Reset translationX
    //       translateX.setValue(0);
    //     }
    //   };

  useEffect(() => {
    // Ensure FlatList starts at the correct position
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
  }, []);


    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
    
        onPanResponderMove: (evt, gestureState) => {
          translateX.setValue(-currentIndex.current * 300 + gestureState.dx);
        },
    
        onPanResponderRelease: (evt, { dx }) => {
          const threshold = 300 * 0.3; // Minimum swipe distance to switch images
          let nextIndex = currentIndex.current;
    
          if (dx > threshold && currentIndex.current > 0) {
            nextIndex -= 1;
          } else if (dx < -threshold && currentIndex.current < image.length - 1) {
            nextIndex += 1;
          }
    
          if (typeof nextIndex !== 'number' || nextIndex < 0 || nextIndex >= image.length) {
            return;
          }
    
          Animated.timing(translateX, {
            toValue: -nextIndex * 300,
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToOffset({
                offset: nextIndex * 300,
                animated: true,
              });
            }
            translateX.setValue(-nextIndex * 300);
          });
    
          currentIndex.current = nextIndex;
          setIndex(nextIndex);
        },
      });



  return (
    <View className='w-full px-6 relative items-center justify-center'>
        <View className="" style={{ position:'relative', bottom:0, alignItems:'center', justifyContent:'center', width:300, height:200 }}>
            { loadingImage ? (
                    <View className='bg-white justify-center items-center' style={{  }}>
                    <ActivityIndicator />
                </View>
            ) : image.length > 0 && (
            <View style={{ flex: 1, justifyContent:'center', alignItems:'center', width:'100%' }}>
                <View {...panResponder.panHandlers} style={{ overflow: 'hidden', width : '100%' }}>
                    <Animated.View style={{ flexDirection: 'row', width: 300 * image.length, transform: [{ translateX }] }}>     
                            <FlatList
                                ref={flatListRef}
                                data={image}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                pagingEnabled={false} // Manual swiping control
                                showsHorizontalScrollIndicator={false}
                                snapToAlignment="start"
                                snapToInterval={300}
                                decelerationRate="fast"
                                scrollEnabled={false} // We control scrolli
                                // contentContainerStyle={{ width: 300 * image.length }}
                                renderItem={({ item }) => (
                                <View style={{ width:300, height: 200, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={{ uri: item }} style={{ width: 300, height:200, borderRadius:10,  }} resizeMode="cover" />
                                </View>
                                )}
                            />
                    </Animated.View>
                </View>
            </View>
            )
            
             }
        </View>
        <View
            style={{paddingTop:20, paddingHorizontal:25, paddingBottom:100, maxHeight:300}}
            className='w-full relative min-h-50 bg-white rounded-3xl  items-start justify-start  gap-3'
            >
                
            <ScrollView>
           
                {  creditLines.map( credit => (
                    <View key={credit.id} className='add-new-line flex-row justify-start gap-3 items-center' style={{width:'100%'}}>
                        <TextInput placeholder='Role on set' style={{  borderWidth:1, borderRadius:5, borderColor:Colors.mainGray, width:'40%', padding:5 }} />
                        <TextInput placeholder='Name' style={{ borderWidth:1, borderRadius:5, borderColor:Colors.mainGray, width:'40%', padding:5 }} />
                        <TouchableOpacity onPress={()=>removeLine(credit.id)} style={{ borderWidth:1, padding:8, borderRadius:5, borderColor:Colors.mainGray }} >
                            <MinusIcon size={14} ></MinusIcon>
                        </TouchableOpacity>
                    </View>

                ) )}

            <TouchableOpacity onPress={addCreditLine}  style={{ borderWidth:1, borderColor:Colors.mainGray, paddingHorizontal:10, paddingVertical:5 , borderRadius:5, flexDirection:'row', gap:8, justifyContent:'center', alignItems:'center' }}>
                <PlusIcon size={14}></PlusIcon>
                <Text className='text-sm font-pbold '>Add new</Text>
            </TouchableOpacity>

        </ScrollView>
        </View>
        <View className='justify-center items-center absolute bottom-8 z-10 gap-3 w-full '  style={{ position:'absolute', bottom:25 }}>
            <View className='border-t-[1.5px] border-slate-200 w-full'/>
            <View className='flex-row justify-between w-full px-6'>
                <View className='flex-row  justify-center gap-3 items-center '>
                    
                    <TouchableOpacity onPress={() => pickMultipleImages( setImage, setLoadingImage )} >
                        <PeopleIcon color={Colors.mainGray} size={20} className='z-10'></PeopleIcon>
                    </TouchableOpacity>
                    
                </View>
                <TouchableOpacity onPress={()=>{console.log(content)}}>
                    <Text className='font-pbold bg-secondary rounded-xl ' style={{paddingVertical:8, paddingHorizontal:20}} >Post</Text>
                </TouchableOpacity>

            </View>
        </View>
    </View>
  )
}

export default CreateShowcase

const styles = StyleSheet.create({})