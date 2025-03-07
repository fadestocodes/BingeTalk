
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground } from 'react-native'
import React, {useRef, useState} from 'react'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useFetchrecommendations, userecommendations, useGetRecommendationsSent, useGetRecommendationsReceived } from '../../../../../../api/user'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors } from '../../../../../../constants/Colors'
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake , Ellipsis, EllipsisVertical} from 'lucide-react-native';
import { formatDate, getYear } from '../../../../../../lib/formatDate'
import { FilmIcon, TVIcon } from '../../../../../../assets/icons/icons'
// import InfiniteScroll from '../../../components/InfiniteScroll'


const RecommendedFromProfile = () => {
    const {userId} = useLocalSearchParams();
    // const { data:recommendationsSent, refetch, isFetching  } = useFetchrecommendations(userId);
    // const {
    //     data,
    //     fetchNextPage,
    //     hasNextPage,
    //     isFetching,
    //     isFetchingNextPage,
    //     isLoading,
    //     refetch
    // } = useFetchrecommendations(userId);
    // console.log('DATAAA', data)

    // const recommendationsSent = data?.pages.flatMap(page => page.items) || [];
    const { data : recommendationsSent, loading, refetch, hasMore,  } = useGetRecommendationsSent(userId)
    const { data : recommendationsReceived, loading:loadingReceived, refetch:refetchReceived, hasMore:hasMoreReceived,  } = useGetRecommendationsReceived(userId)

    const [ tab, setTab ] = useState('received')

    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w342';


  console.log('data', recommendationsSent)
  // const flattenData = data?.pages.flatMap((page) => page.items) || [];
  // console.log(flattenData)




    // console.log('recently watched ARRAY', recommendationsSent)
    const router = useRouter()


    
    const handlePress = (item) => {
        console.log('tmbdbId', item.tmdbId)
        if (item.movie){
          router.push(`/movie/${item.movie.tmdbId}`)
        }
        if (item.tv){
          router.push(`/tv/${item.tv.tmdbId}`)
        }
    }
    

        // const reachedEnd = () => {
        //     if ( hasMore  && !loading  ) {
        //         refetch();
        //     }
        // }
        const ITEM_HEIGHT = 50

        const handleOptions = () => {
            
        }


  // if (loading  ){
  //   return(
  //       <View style={{ backgroundColor:Colors.primary, width:'100%', height:'100%' }}>   
  //    <RefreshControl tintColor={Colors.secondary}   />
  //    </View>
  //   )
  // }

  return (
    <SafeAreaView className='w-full h-full bg-primary justify-start items-center' style={{  paddingTop:100, paddingHorizontal:15 }}>
       <View 
            refreshControl={
                <RefreshControl
                    tintColor={Colors.secondary}
                    refreshing={loading}
                    onRefresh={refetch}
                />
            }
            style={{ paddingTop:30, gap:10, paddingHorizontal:15, paddingBottom:200,alignItems:'center', width:'100%' }}>
            <View className="flex-row justify-center items-center gap-2">
                <Handshake color='white'  />
                <Text className='text-white text-2xl font-pbold'>Recommendations</Text>
            </View>
            <View className='flex-row gap-3 justify-center items-center mb-3' style={{ borderRadius:10, paddingHorizontal:5, paddingVertical:8, backgroundColor:Colors.mainGrayDark, width:150 }}>
                <TouchableOpacity onPress={()=>setTab('received')}  style={{ padding:5, borderRadius:5, backgroundColor: tab === 'received' ? 'white' : null }} >
                  <Text className=' font-pbold text-sm' style={{ color : tab === 'received' ? Colors.primary : Colors.mainGray }}>Received</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setTab('sent')} style={{ padding:5, borderRadius:5, backgroundColor: tab === 'sent' ? 'white' : null }} >
                <Text className='font-pbold text-sm' style={{ color : tab === 'sent' ? Colors.primary : Colors.mainGray }} >Sent</Text>
                </TouchableOpacity>
            </View>


            {  tab === 'received' ? (
                < View className='w-full' >
                { recommendationsReceived.length < 1 ? (
                    <View>
                        <Text className='text-mainGray text-center text-xl font-pmedium' >(List is empty)</Text>
                    </View>
                ) : (

                    <FlatList
                        scrollEnabled={true}
                        data={recommendationsReceived}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ width:'100%', gap:10, paddingBottom:100 }}
                        onEndReached={() => {
                        if ( hasMore  ){
                            refetch()
                        }
                    }}
                        
                        onEndReachedThreshold={0.1}
                        // ListFooterComponent={ loading ? <ActivityIndicator /> : <></>}
                        renderItem={({item})=>{
                            console.log('RECOMMENDED ITEM',item)
                            return (
                                <TouchableOpacity onPress={()=>handlePress(item)} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:150 ,overflow:'hidden'}}>
                                    <Image
                                    style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    }}
                                    source={{ uri: `${posterURL}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }` }}
                                    placeholder={{ uri: `${posterURLlow}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }`  }}
                                    placeholderContentFit="cover"
                                    contentFit="cover" // Same as resizeMode='cover'
                                    transition={300} // Optional: Adds a fade-in effect
                                />
                                <LinearGradient
                                    colors={['transparent', 'black']}
                                    style={{
                                    height: '100%',
                                    width: '100%',
                                    position: 'absolute',
                                    }}
                                />
                                    <View className='flex-row justify-center item-end w-full h-full' style={{paddingHorizontal:30, paddingVertical:15}}>

                                    <View  className='justify-end items-start w-full h-full' > 
                                        <TouchableOpacity onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                                        
                                            <View className='flex-row gap-1 justify-center items-center'>
                                                { item.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                                                <Text className='text-white text font-pbold'>{ item.movieId ? `${item.movie.title} (${getYear(item.movie.releaseDate)})` : `${item.tv.title} (${getYear(item.tv.releaseDate)})` }</Text>
                                            </View>
                                        </TouchableOpacity>
                                                    <View className="">
                                                        <Text className='text-mainGray font-pregular text-sm '>Recommended by</Text>
                                                        <View className='flex-row justify-center items-center gap-2'>
                                                        <Image
                                                            source={{ uri: item.recommender.profilePic }}
                                                            resizeMethod = 'cover'
                                                            style={{ width:25, height : 25, borderRadius : '50%' }}
                                                        />
                                                        <Text className='text-mainGray font-pbold text-sm'>@{item.recommender.username}</Text>
                                                        <Text className='text-mainGray text-sm '>-  {formatDate(item.createdAt)}</Text>
                                                                                                    </View>
                                                    </View>
                                    </View>
                                                <TouchableOpacity onPress={handleOptions} style={{justifyContent:'flex-end', alignItems:'flex-end'}}>
                                                    <EllipsisVertical size={20} color={Colors.mainGray} />
                                                </TouchableOpacity>
                                    </View>
                                {/* <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/> */}
                                </TouchableOpacity>
                        )}}
                    />
                )  }


                </View>

            ) : tab === 'sent' && (
                <View className='w-full'>
                                    { recommendationsSent.length < 1 ? (
                    <View>
                        <Text className='text-mainGray text-center text-xl font-pmedium' >(List is empty)</Text>
                    </View>
                ) : (

                    <FlatList
                        scrollEnabled={true}
                        data={recommendationsSent}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ width:'100%', gap:10, paddingBottom:100 }}
                        onEndReached={() => {
                        if ( hasMoreReceived  ){
                            refetchReceived()
                        }
                    }}
                        
                        onEndReachedThreshold={0.1}
                        // ListFooterComponent={ loading ? <ActivityIndicator /> : <></>}
                        renderItem={({item})=>{
                            console.log('RECOMMENDED ITEM',item)
                            return (
                                <TouchableOpacity onPress={()=>handlePress(item)} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:150 }}>
                                    <Image
                                    style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    }}
                                    source={{ uri: `${posterURL}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }` }}
                                    placeholder={{ uri: `${posterURLlow}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }`  }}
                                    placeholderContentFit="cover"
                                    contentFit="cover" // Same as resizeMode='cover'
                                    transition={300} // Optional: Adds a fade-in effect
                                />
                                <LinearGradient
                                    colors={['transparent', 'black']}
                                    style={{
                                    height: '100%',
                                    width: '100%',
                                    position: 'absolute',
                                    }}
                                />
                                    <View className='flex-row justify-center item-end w-full h-full' style={{paddingHorizontal:30, paddingVertical:15}}>

                                    <View  className='justify-end items-start w-full h-full' > 
                                        <TouchableOpacity onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                                        
                                            <View className='flex-row gap-1 justify-center items-center'>
                                                { item.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                                                <Text className='text-white text font-pbold'>{ item.movieId ? `${item.movie.title} (${getYear(item.movie.releaseDate)})` : `${item.tv.title} (${getYear(item.tv.releaseDate)})` }</Text>
                                            </View>
                                        </TouchableOpacity>
                                                    <View className="">
                                                        <Text className='text-mainGray font-pregular text-sm '>Recommended to</Text>
                                                        <View className='flex-row justify-center items-center gap-2'>
                                                        <Image
                                                            source={{ uri: item.recommender.profilePic }}
                                                            resizeMethod = 'cover'
                                                            style={{ width:25, height : 25, borderRadius : '50%' }}
                                                        />
                                                        <Text className='text-mainGray font-pbold text-sm'>@{item.recommender.username}</Text>
                                                        <Text className='text-mainGray text-sm '>-  {formatDate(item.createdAt)}</Text>
                                                                                                    </View>
                                                    </View>
                                    </View>
                                                <TouchableOpacity onPress={handleOptions} style={{justifyContent:'flex-end', alignItems:'flex-end'}}>
                                                    <EllipsisVertical size={20} color={Colors.mainGray} />
                                                </TouchableOpacity>
                                    </View>
                                {/* <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/> */}
                                </TouchableOpacity>
                        )}}
                    />
                )  }

                </View>
            ) }


            <View style={{ paddingTop:20 }}>
                </View>
        </View>
    </SafeAreaView>
  )
}

export default RecommendedFromProfile

const styles = StyleSheet.create({})