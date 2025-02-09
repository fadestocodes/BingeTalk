import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, {useState, useRef} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../constants/Colors'
import DeckSwiper from './ui/SwipeCard/SwipeCard'
import { ArrowUpIcon, DownCircleIcon, UpCircleIcon } from '../assets/icons/icons'
import { useNavigation } from '@react-navigation/native'
import { useRouter } from 'expo-router'


const ExploreComponent = ({dataList}) => {

    const posterURL = 'https://image.tmdb.org/t/p/original';
    const SCREEN_WIDTH = Dimensions.get('window').width;
    const SCREEN_HEIGHT = Dimensions.get('window').height;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [ moreInfo, setMoreInfo ] = useState(false);
    const flatListRef = useRef(null);
    const router = useRouter();
    const navigation = useNavigation();


    const handleScrollEnd = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / SCREEN_WIDTH);
        setCurrentIndex(newIndex);
      };

    const handleGoBack = () => {
        navigation.goBack();
    }

    const handleDetails = (item) => {
        console.log('item type', item.media_type)
        console.log(item.id)
        if (item.media_type === 'movie') {
            router.push(`/movie/${item.id}`)
        }  
        if ( item.media_type === 'tv') {
            router.push(`/tv/${item.id}`)
        }
    }

    return (
    
    <View>

        <TouchableOpacity onPress={handleGoBack} className='explore-mode  absolute w-10 h-10 bg-white top-12 right-6 z-10' />
    
        <FlatList
            horizontal
            ref={flatListRef}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={SCREEN_WIDTH}
            decelerationRate="fast"
            pagingEnabled
            onMomentumScrollEnd={handleScrollEnd}
            initialNumToRender={5} // Render the first 5 items initially
            maxToRenderPerBatch={10} // Number of items to render at a time
            windowSize={5} // Limits how many items are rendered outside the viewport
            disableIntervalMomentum
            data={dataList}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
                <View className=' bg-primary relative' style={{height:SCREEN_HEIGHT, width:SCREEN_WIDTH}}>
                    <View className='absolute w-full'>
                        <Image
                            source={{uri:`${posterURL}${item.poster_path}`}}
                            resizeMode='cover'
                            style={{ width:'auto', height:SCREEN_HEIGHT-200, objectFit:'cover' }}
                        />
                        <LinearGradient
                            colors={[ 'transparent',Colors.primary]}
                            style={{height : moreInfo ? SCREEN_HEIGHT-300 : SCREEN_HEIGHT-800 , width : '100%', position:'absolute', bottom:0}}>
                        </LinearGradient>
                    </View>
                    <View className='px-6 gap-5 justify-center items-center w-full ' style={{marginTop:0, position: 'absolute', bottom:140}}>
                        
                        { !moreInfo ? (
                        <View className="justify-center items-center w-full">
                            <TouchableOpacity onPress={()=>setMoreInfo(true)}>
                                <UpCircleIcon size={25} color={Colors.mainGray} />
                            </TouchableOpacity>

                        </View>

                        ) : (
                        <View className='justify-center items-center gap-5' style={{marginBottom:10}}>
                            <TouchableOpacity onPress={()=>setMoreInfo(false)}>
                                <DownCircleIcon size={25} color={Colors.mainGray} />
                            </TouchableOpacity>
                            <Text className='text-mainGray font-pcourier '>{item.overview}</Text>
                            <TouchableOpacity onPress={()=>handleDetails(item)} className='border-[1px] border-mainGray px-2 py-1 rounded-lg'>
                                <Text className='text-mainGray text-sm'>Full details</Text>
                            </TouchableOpacity>
                        </View>
                        ) }
                            <View className='flex-row w-full items-center justify-center gap-5'>
                                <TouchableOpacity className='bg-mainGray rounded-full justify-center items-center px-2 h-14' style={{width:150, shadowRadius:2, shadowColor:'#595959', shadowOffset:{width:2, height:5}, shadowOpacity:.85,  }}>
                                    <Text className='text-primary font-pbold  '>Not interested</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className='bg-mainGray rounded-full justify-center items-center px-2 h-14   ' style={{width:150, shadowRadius:2, shadowColor:'#595959', shadowOffset:{width:2, height:5}, shadowOpacity:.85,  }}>
                                    <Text className='text-primary font-pbold  '>Add to Watchlist</Text>
                                </TouchableOpacity>
                            </View>
                    </View>
                </View>
            )}
            >
            </FlatList>
        </View>
        
  )
}

export default ExploreComponent

const styles = StyleSheet.create({})