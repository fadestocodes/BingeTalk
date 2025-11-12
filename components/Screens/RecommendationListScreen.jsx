
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground } from 'react-native'
import React, {useRef, useState, useCallback} from 'react'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect } from '@react-navigation/native';

import { useFetchrecommendations, userecommendations, useGetRecommendationsSent, useGetRecommendationsReceived, useGetRecommendationsAccepted, useGetRecommendationsDeclined } from '../../api/user'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake , Ellipsis, EllipsisVertical, Check, X, Minus, Trash2} from 'lucide-react-native';
import { formatDate, getYear } from '../../lib/formatDate'
import { FilmIcon, TVIcon , BackIcon, PlaylistAdd} from '../../assets/icons/icons'
import { acceptRecommendation, deleteRecommendation, removeRecommendation, removeRecommendationFlag } from '../../api/recommendation'
import { avatarFallback } from '../../lib/fallbackImages';
import { avatarFallbackCustom } from '../../constants/Images';
import { markMovieWatchlist } from '../../api/movie';
import { markTVWatchlist } from '../../api/tv';
import { checkTastemakerBadge } from '../../api/badge';
import { useBadgeContext } from '../../lib/BadgeModalContext';
import { useGetUser } from '../../api/auth';


const RecommendationListScreen = () => {
    const {userId} = useLocalSearchParams();
    const {user} = useGetUser()
    const { data : recommendationsSent, loading, refetch, hasMore, fetchMore, removeSentItems  } = useGetRecommendationsSent(user?.id)
    const { data : recommendationsReceived, loading:loadingReceived, refetchReceived, fetchMoreReceived, hasMore:hasMoreReceived,  removeReceivedItems} = useGetRecommendationsReceived(user?.id)
    const {data : acceptedRecommendations, refetchAccepted, fetchMoreAccepted,  removeAcceptedItem} = useGetRecommendationsAccepted(user?.id)
    const {data : declinedRecommendations, refetchDeclined, fetchMoreDeclined,  removeDeclineItem} = useGetRecommendationsDeclined(user?.id)
    const [ tab, setTab ] = useState('received')
    const {showBadgeModal} = useBadgeContext()
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w342';


    const router = useRouter()

    useFocusEffect(
        useCallback(() => {
          refetch() // refetch from server
          refetchReceived()
        }, [])
      )


    
    const handlePress = (item) => {
        if (item.movie){
        //   router.push(`/movie/${item.movie.tmdbId}`)
        router.push({
            pathname: `/user/recommendations/${item.id}`,
            params:{ type : 'MOVIE', userId }
        })
        }
        if (item.tv){
        //   router.push(`/tv/${item.tv.tmdbId}`)
        router.push({
            pathname: `/user/recommendations/${item.id}`,
            params:{ type : 'TV', userId }
        })
        }
    }
    
        const ITEM_HEIGHT = 50

        const handleOptions = () => {
            
        }

    const handleRemove = async  (type, item) => {
        if (type === 'sent'){

            console.log('trying to delte sent recommednation')
            const data = {
                recipientId : item.recipientId,
                movieId : item?.movie?.id || null,
                tvId : item?.tv?.id || null
            }
            // const deletedRec = await deleteRecommendation(data)
            const removeData = {
                recommendationId : item.id,
                removedBy : 'RECOMMENDER'
            }
            await removeRecommendationFlag(removeData)
            await removeRecommendation()
            removeSentItems(item)
            console.log('deleted rec', deletedRec)
            
        } else if (type === 'received'){
            // const data = {
                //     recipientId : item.recipientId,
                //     recommenderId : item.recommenderId,
                //     movieId : item?.movie?.id || null,
                //     tvId : item?.tv?.id || null
                // }
            
            const removeData = {
                recommendationId : item.id,
                removedBy : 'RECIPIENT'
            }
            await removeRecommendationFlag(removeData)


            // const deletedRec = await deleteRecommendation(data)

         
    
            // await checkTastemakerBadge(item.recommenderId)

        }
        
    }

    const handleDecline = async (item) => {
        const data = {
            userId: item.recipientId,
            recommenderId : item.recommenderId,
            recommendationId : item.id,
            type:'DECLINED',
            movieId : item?.movie ? item.movie.id : null,
            tvId : item?.tv ? item.tv.id : null
        }
        await acceptRecommendation(data)
        console.log(item)
        const watchlistData = {
            userId : item.recipientId,
            movieId : item?.movie ? item.movie.id : undefined,
            tvId : item?.tv ? item.tv.id : undefined
        }
    
        removeReceivedItems(item)
    }

    const handleAccept = async (type, item) => {
        const data = {
            userId: item.recipientId,
            recommenderId : item.recommenderId,
            recommendationId : item.id,
            type,
            movieId : item?.movie ? item.movie.id : null,
            tvId : item?.tv ? item.tv.id : null
        }
        await acceptRecommendation(data)
        console.log(item)
        const watchlistData = {
            userId : item.recipientId,
            movieId : item?.movie ? item.movie.id : undefined,
            tvId : item?.tv ? item.tv.id : undefined
        }
       
        removeReceivedItems(item)

        await checkTastemakerBadge(item.recommenderId)
        

    }



    if (!user){
        return <ActivityIndicator />
    }



  return (
    <SafeAreaView className='w-full h-full bg-primary justify-start items-center' style={{   paddingHorizontal:15 }}>
       <View className='flex-1' style={{ paddingTop:15, gap:10, paddingHorizontal:15,alignItems:'center', width:'100%' }}>
        
            {/* <TouchableOpacity onPress={()=>router.back()} style={{justifyContent:'flex-start', alignSelf:'flex-start' }}>
                <BackIcon size={26} color={Colors.mainGray} />
            </TouchableOpacity> */}
            <View className="flex-row w-full justify-start items-center gap-2 py-1">
                <Handshake color='white'  />
                <Text className='text-white text-3xl  font-pbold'>Recommendations</Text>
            </View>
            <View className='flex-row gap-2 w-full justify-start items-center'>
                <TouchableOpacity onPress={()=>{setTab('received') }} style={{ borderRadius:15, backgroundColor:tab==='received' ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
                        <Text className=' font-pmedium' style={{ color : tab==='received' ? Colors.primary : 'white' }}>Received</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setTab('sent') }} style={{ borderRadius:15, backgroundColor:tab==='sent' ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
                        <Text className=' font-pmedium' style={{ color : tab==='sent' ? Colors.primary : 'white' }}>Sent</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setTab('accepted') }} style={{ borderRadius:15, backgroundColor:tab==='accepted' ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
                        <Text className=' font-pmedium' style={{ color : tab==='accepted' ? Colors.primary : 'white' }}>Accepted</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setTab('declined') }} style={{ borderRadius:15, backgroundColor:tab==='declined' ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
                        <Text className=' font-pmedium' style={{ color : tab==='declined' ? Colors.primary : 'white' }}>Declined</Text>
                </TouchableOpacity>
            </View>


            {  tab === 'received' ? (
                < View className='w-full' >
                { recommendationsReceived.length < 1 ? (
                    <View>
                        <Text className='text-mainGray text-center text-xl font-pmedium' >(No received recommendations)</Text>
                    </View>
                ) : (

                    <FlatList
                        refreshControl={<RefreshControl
                                onRefresh={  refetchReceived }
                                refreshing={ loadingReceived}
                                tintColor={Colors.secondary}
                            />
                        }
                        scrollEnabled={true}
                        data={recommendationsReceived}
                        keyExtractor={(item,index) => `${item.id}-${index}`}
                        contentContainerStyle={{ width:'100%', gap:10, paddingBottom:100 }}
                        onEndReached={() => {
                        if ( hasMore  ){
                            fetchMoreReceived()
                        }
                    }}
                        
                        onEndReachedThreshold={0.1}
                        renderItem={({item})=>{
                            return (
                                <TouchableOpacity onPress={()=>handlePress(item)} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:180 ,overflow:'hidden'}}>
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
                                    <View className='flex-row justify-between items-end w-full h-full ' style={{paddingHorizontal:15, paddingVertical:15}}>

                                        <View  className='justify-end items-start' style={{maxWidth:220}} > 
                                            <TouchableOpacity onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                                            
                                                <View className='flex-row gap-1 justify-center items-center'>
                                                    { item.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                                                    <Text className='text-white text font-pbold'>{ item?.movieId ? `${item.movie.title} (${getYear(item.movie.releaseDate)})` : `${item.tv.title} (${getYear(item.tv.releaseDate)})` }</Text>
                                                </View>
                                            </TouchableOpacity>
                                                        <TouchableOpacity onPress={()=>router.push(`user/${item.recommender.id}`)} className="">
                                                            <Text className='text-mainGray font-pregular text-sm '>Recommended by</Text>
                                                            <View className='flex-row justify-start items-center gap-2'>
                                                            <Image
                                                                source={{ uri: item.recommender.profilePic || avatarFallbackCustom }}
                                                                resizeMethod = 'cover'
                                                                style={{ width:25, height : 25, borderRadius : '50%' }}
                                                            />
                                                            <Text className='text-mainGray font-pbold text-sm'>@{item.recommender.username}</Text>
                                                            <Text className='text-mainGray text-sm '>-  {formatDate(item.createdAt)}</Text>
                                                            </View>
                                                            { item.message && (
                                                                <Text className='text-mainGray font-pregular text-sm' style={{width:250}}>"{item.message}"</Text>
                                                            ) }
                                                        </TouchableOpacity>
                                        </View>
                                        <View className='flex-row gap-3 items-center justify-center ' >
                                            <View className='flex flex-row gap-3  justify-center items-center'>
                                            { item.status !== 'ACCEPTED' && (
                                                    <TouchableOpacity className='flex flex-row justify-start items-center gap-1 self-start' onPress={()=>handleAccept('ACCEPTED',item)} style={{ backgroundColor : Colors.darkGray, paddingHorizontal:8, paddingVertical:5, borderRadius:10 }}>
                                                        <PlaylistAdd size={18} color={'green'} strokeWidth={3} />
                                                    </TouchableOpacity>
                                            ) }
                                                    <TouchableOpacity className='flex flex-row justify-start items-center gap-1 self-start' onPress={()=>handleRemove('received',item)} style={{ backgroundColor : Colors.darkGray, paddingHorizontal:8, paddingVertical:5, borderRadius:10 }}>
                                                        <Trash2 color={'red'} size={18} strokeWidth={3}/>
                                                    </TouchableOpacity>
                                            </View>
                                           
                                        </View>
                                    </View>
                                </TouchableOpacity>
                        )}}
                    />
                )  }


                </View>

            ) : tab === 'sent' ? (
                <View className='w-full'>
                                    { recommendationsSent.length < 1 ? (
                    <View>
                        <Text className='text-mainGray text-center text-xl font-pmedium' >(No sent recommendations)</Text>
                    </View>
                ) : (

                    <FlatList
                    refreshControl={<RefreshControl
                        onRefresh={  refetch }
                        refreshing={loading}
                        tintColor={Colors.secondary}
                        />}

                        scrollEnabled={true}
                        data={recommendationsSent}
                        keyExtractor={(item,index) => `${item.id}-${index}`}
                        contentContainerStyle={{ width:'100%', gap:10, paddingBottom:100 }}
                        onEndReached={() => {
                        if ( hasMore  ){
                            fetchMore()
                        }
                        }}
                        
                        onEndReachedThreshold={0.1}
                        renderItem={({item})=>{
                            return (
                                <TouchableOpacity onPress={()=>handlePress(item)} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:180, overflow:'hidden', width:'100%' }}>
                                    <Image
                                    style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    }}
                                    source={{ uri: `${posterURL}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }` }}
                                    placeholder={{ uri: `${posterURLlow}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }`  }}
                                    placeholderContentFit="cover"
                                    contentFit="cover" 
                                    transition={300} 
                                />
                                <LinearGradient
                                    colors={['transparent', 'black']}
                                    style={{
                                    height: '100%',
                                    width: '100%',
                                    position: 'absolute',
                                    }}
                                />
                                    <View className='flex-row justify-between items-end w-full h-full ' style={{paddingHorizontal:15, paddingVertical:15, width:'100%'}}>

                                        <View  className='justify-end items-start  ' > 
                                            <View onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                                            
                                                <View className='flex-row gap-1 justify-center items-center' style={{maxWidth:220}}>
                                                    { item.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                                                    <Text className='text-white text font-pbold' style={{maxWidth:220}} >{ item.movieId ? `${item.movie.title} (${getYear(item.movie.releaseDate)})` : `${item.tv.title} (${getYear(item.tv.releaseDate)})` }</Text>
                                                </View>
                                            </View>
                                                        <TouchableOpacity onPress={()=>router.push(`user/${item.recipient.id}`)} className="">
                                                            <Text className='text-mainGray font-pregular text-sm '>Recommended to</Text>
                                                            <View className='flex-row justify-start items-center gap-2'>
                                                            <Image
                                                                source={{ uri: item.recipient.profilePic || avatarFallbackCustom }}
                                                                resizeMethod = 'cover'
                                                                style={{ width:25, height : 25, borderRadius : '50%' }}
                                                            />
                                                            <Text className='text-mainGray font-pbold text-sm'>@{item.recipient.username}</Text>
                                                            <Text className='text-mainGray text-sm '>-  {formatDate(item.createdAt)}</Text>
                                                            </View>
                                                            { item.message && (
                                                                <Text className='text-mainGray font-pregular text-sm' style={{width:250}}>"{item.message}"</Text>
                                                            ) }
                                                        </TouchableOpacity>
                                        </View>
                                        <View className='flex-row gap-3 items-center justify-center ' >
                                                    <TouchableOpacity className='flex flex-row justify-start items-center gap-1 self-start' onPress={()=>handleRemove('sent',item)} style={{ backgroundColor : Colors.darkGray, paddingHorizontal:8, paddingVertical:5, borderRadius:10 }}>
                                                        <Trash2 color={'red'} size={18} strokeWidth={3}/>
                                                    </TouchableOpacity>
                                                   
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}}
                        />
                    )  }

                </View>
            ) : tab === 'accepted' ? (
                    <FlatList
                    refreshControl={<RefreshControl
                        onRefresh={  refetchAccepted }
                        refreshing={loading}
                        tintColor={Colors.secondary}
                        />}
    
                        scrollEnabled={true}
                        data={acceptedRecommendations}
                        keyExtractor={(item,index) => `${item.id}-${index}`}
                        contentContainerStyle={{ width:'100%', gap:10, paddingBottom:100 }}
                        onEndReached={() => {
                        if ( hasMore  ){
                            fetchMoreAccepted()
                        }
                        }}
                        
                        onEndReachedThreshold={0.1}
                        renderItem={({item})=>{
                            console.log('item...',item)
                            return (
                                <TouchableOpacity onPress={()=>handlePress(item)} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:180, overflow:'hidden', width:'100%' }}>
                                    <Image
                                    style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    }}
                                    source={{ uri: `${posterURL}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }` }}
                                    placeholder={{ uri: `${posterURLlow}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }`  }}
                                    placeholderContentFit="cover"
                                    contentFit="cover" 
                                    transition={300} 
                                />
                                <LinearGradient
                                    colors={['transparent', 'black']}
                                    style={{
                                    height: '100%',
                                    width: '100%',
                                    position: 'absolute',
                                    }}
                                />
                                    <View className='flex-row justify-between items-end w-full h-full ' style={{paddingHorizontal:15, paddingVertical:15, width:'100%'}}>
    
                                        <View  className='justify-end items-start  ' > 
                                            <View onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                                            
                                                <View className='flex-row gap-1 justify-center items-center' style={{maxWidth:220}}>
                                                    { item.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                                                    <Text className='text-white text font-pbold' style={{maxWidth:220}} >{ item.movieId ? `${item.movie.title} (${getYear(item.movie.releaseDate)})` : `${item.tv.title} (${getYear(item.tv.releaseDate)})` }</Text>
                                                </View>
                                            </View>
                                                        <TouchableOpacity onPress={()=>router.push(`user/${item.recommender.id}`)} className="">
                                                            <Text className='text-mainGray font-pregular text-sm '>Recommended by</Text>
                                                            <View className='flex-row justify-start items-center gap-2'>
                                                            <Image
                                                                source={{ uri: item.recommender.profilePic || avatarFallbackCustom }}
                                                                resizeMethod = 'cover'
                                                                style={{ width:25, height : 25, borderRadius : '50%' }}
                                                            />
                                                            <Text className='text-mainGray font-pbold text-sm'>@{item.recommender.username}</Text>
                                                            <Text className='text-mainGray text-sm '>-  {formatDate(item.createdAt)}</Text>
                                                            </View>
                                                            { item.message && (
                                                                <Text className='text-mainGray font-pregular text-sm' style={{width:250}}>"{item.message}"</Text>
                                                            ) }
                                                        </TouchableOpacity>
                                        </View>
                                        <View className='flex-row gap-3 items-center justify-center ' >
                                                    <TouchableOpacity className='flex flex-row justify-start items-center gap-1 self-start' onPress={()=>handleRemove('sent',item)} style={{ backgroundColor : Colors.darkGray, paddingHorizontal:8, paddingVertical:5, borderRadius:10 }}>
                                                        <Trash2 color={'red'} size={18} strokeWidth={3}/>
                                                    </TouchableOpacity>
                                                   
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}}
                        />
            ) : 
            tab === 'declined' && (
                    <FlatList
                    refreshControl={<RefreshControl
                        onRefresh={  refetchDeclined }
                        refreshing={loading}
                        tintColor={Colors.secondary}
                        />}
        
                        scrollEnabled={true}
                        data={declinedRecommendations}
                        keyExtractor={(item,index) => `${item.id}-${index}`}
                        contentContainerStyle={{ width:'100%', gap:10, paddingBottom:100 }}
                        onEndReached={() => {
                        if ( hasMore  ){
                            fetchMoreDeclined()
                        }
                        }}
                        
                        onEndReachedThreshold={0.1}
                        renderItem={({item})=>{
                            return (
                                <TouchableOpacity onPress={()=>handlePress(item)} className='gap-10 relative' style={{ backgroundColor:Colors.mainGrayDark, borderRadius:15, height:180, overflow:'hidden', width:'100%' }}>
                                    <Image
                                    style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    }}
                                    source={{ uri: `${posterURL}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }` }}
                                    placeholder={{ uri: `${posterURLlow}${item.movie ? item.movie.backdropPath : item.tv && item.tv.backdropPath }`  }}
                                    placeholderContentFit="cover"
                                    contentFit="cover" 
                                    transition={300} 
                                />
                                <LinearGradient
                                    colors={['transparent', 'black']}
                                    style={{
                                    height: '100%',
                                    width: '100%',
                                    position: 'absolute',
                                    }}
                                />
                                    <View className='flex-row justify-between items-end w-full h-full ' style={{paddingHorizontal:15, paddingVertical:15, width:'100%'}}>
        
                                        <View  className='justify-end items-start  ' > 
                                            <View onPress={()=>handlePress(item)  } className = 'flex-row gap-5 justify-start items-center w-full' >
                                            
                                                <View className='flex-row gap-1 justify-center items-center' style={{maxWidth:220}}>
                                                    { item.movieId ? <FilmIcon color={Colors.secondary}/> : <TVIcon color={Colors.secondary} /> }
                                                    <Text className='text-white text font-pbold' style={{maxWidth:220}} >{ item.movieId ? `${item.movie.title} (${getYear(item.movie.releaseDate)})` : `${item.tv.title} (${getYear(item.tv.releaseDate)})` }</Text>
                                                </View>
                                            </View>
                                                        <TouchableOpacity onPress={()=>router.push(`user/${item.recommender.id}`)} className="">
                                                            <Text className='text-mainGray font-pregular text-sm '>Recommended by</Text>
                                                            <View className='flex-row justify-start items-center gap-2'>
                                                            <Image
                                                                source={{ uri: item.recommender.profilePic || avatarFallbackCustom }}
                                                                resizeMethod = 'cover'
                                                                style={{ width:25, height : 25, borderRadius : '50%' }}
                                                            />
                                                            <Text className='text-mainGray font-pbold text-sm'>@{item.recommender.username}</Text>
                                                            <Text className='text-mainGray text-sm '>-  {formatDate(item.createdAt)}</Text>
                                                            </View>
                                                            { item.message && (
                                                                <Text className='text-mainGray font-pregular text-sm' style={{width:250}}>"{item.message}"</Text>
                                                            ) }
                                                        </TouchableOpacity>
                                        </View>
                                        <View className='flex-row gap-3 items-center justify-center ' >
                                                    <TouchableOpacity className='flex flex-row justify-start items-center gap-1 self-start' onPress={()=>handleRemove('sent',item)} style={{ backgroundColor : Colors.darkGray, paddingHorizontal:8, paddingVertical:5, borderRadius:10 }}>
                                                        <Trash2 color={'red'} size={18} strokeWidth={3}/>
                                                    </TouchableOpacity>
                                                   
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}}
                        />
            )
        }


            <View style={{ paddingTop:20 }}>
                </View>
        </View>
    </SafeAreaView>
  )
}

export default RecommendationListScreen

const styles = StyleSheet.create({})