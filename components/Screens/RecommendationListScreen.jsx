
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
import { FilmIcon, TVIcon , BackIcon, PlaylistAdd, PlaylistCheck} from '../../assets/icons/icons'
import { acceptRecommendation, deleteRecommendation, removeRecommendation, removeRecommendationFlag } from '../../api/recommendation'
import { avatarFallback } from '../../lib/fallbackImages';
import { avatarFallbackCustom } from '../../constants/Images';
import { markMovieWatchlist } from '../../api/movie';
import { markTVWatchlist } from '../../api/tv';
import { checkTastemakerBadge } from '../../api/badge';
import { useBadgeContext } from '../../lib/BadgeModalContext';
import { useGetUser } from '../../api/auth';

import { useNotificationCountContext } from '@/lib/NotificationCountContext';
import ToastMessage from '../ui/ToastMessage';
import { maybeAskForReview } from '../../lib/maybeAskForReview';


const RecommendationListScreen = ({undeterminedAndFlagged, handleYes}) => {
    const {userId} = useLocalSearchParams();
    const {user} = useGetUser()
    const { data : recommendationsSent, loading, refetch, hasMore:hasMoreSent, fetchMore, removeSentItems  } = useGetRecommendationsSent(user?.id)
    const { data : recommendationsReceived, loading:loadingReceived, refetchReceived, fetchMoreReceived, hasMore:hasMoreReceived,  removeReceivedItems} = useGetRecommendationsReceived(user?.id)
    const {data : acceptedRecommendations, refetchAccepted, fetchMoreAccepted,  removeAcceptedItem, hasMore: hasMoreAccepted} = useGetRecommendationsAccepted(user?.id)
    const {data : declinedRecommendations, refetchDeclined, fetchMoreDeclined,  removeDeclineItem, hasMore: hasMoreDeclined} = useGetRecommendationsDeclined(user?.id)
    const [ tab, setTab ] = useState('accepted')
    const { pendingRecsNotifCount, updatePendingRecsNotifCount } = useNotificationCountContext()
    const {showBadgeModal} = useBadgeContext()
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w342';

    const [ toastMessage, setToastMessage ] = useState(null)
    const [ toastIcon, setToastIcon ] = useState(null)

    const router = useRouter()

  



    
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
        let res
        if (type === 'sent'){

            // const data = {
            //     recipientId : item.recipientId,
            //     movieId : item?.movie?.id || null,
            //     tvId : item?.tv?.id || null
            // }
            // const deletedRec = await deleteRecommendation(data)
            const removeData = {
                recommendationId : item.id,
                removedBy : 'RECOMMENDER'
            }
            res = await removeRecommendationFlag(removeData)
            
            removeSentItems(item)
            
        } else if (type === 'pending'){
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
            res = await removeRecommendationFlag(removeData)
            removeReceivedItems(item)

        }  else if (type === 'accepted'){
            
            const removeData = {
                recommendationId : item.id,
                removedBy : 'RECIPIENT'
            }
            res = await removeRecommendationFlag(removeData)
            removeAcceptedItem(item)
        } else if (type === 'declined'){
            const removeData = {
                recommendationId : item.id,
                removedBy : 'RECIPIENT'
            }
            res = await removeRecommendationFlag(removeData)
            removeDeclineItem(item)
        }

        if (res?.success){
            setToastIcon(< Trash2 color={Colors.secondary} size={30} />)
            setToastMessage("Removed recommendation")
        }

        if (pendingRecsNotifCount && pendingRecsNotifCount > 0){
            updatePendingRecsNotifCount( pendingRecsNotifCount - 1 )
        }

        await maybeAskForReview()

        
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
        const res = await acceptRecommendation(data)
        if (res?.success){
            setToastIcon(< X color={Colors.secondary} size={30} />)
            setToastMessage("Declined recommendation")
        }

        removeReceivedItems(item)

        if (pendingRecsNotifCount && pendingRecsNotifCount > 0){
            updatePendingRecsNotifCount( pendingRecsNotifCount - 1 )
        }

        await maybeAskForReview()

       
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
        const res = await acceptRecommendation(data)
        removeReceivedItems(item)
        if (res?.success){
            setToastIcon(< PlaylistAdd color={Colors.secondary} size={30} />)
            setToastMessage("Accepted recommendation and added to your Watchlist")
        }
        

        
        if (pendingRecsNotifCount && pendingRecsNotifCount > 0){
            updatePendingRecsNotifCount( pendingRecsNotifCount - 1 )
        }
        

        await checkTastemakerBadge(item.recommenderId)
        await maybeAskForReview()
        

    }



    if (!user){
        return <ActivityIndicator />
    }



  return (
    <SafeAreaView className='flex-1 bg-primary justify-start items-center' style={{   paddingHorizontal:15 }}  edges={['top']}>
       <View className='flex-1' style={{ paddingTop:15, gap:10, paddingHorizontal:15,alignItems:'center', width:'100%' }}>
       <ToastMessage message={toastMessage} onComplete={()=>{setToastMessage(null); setToastIcon(null)}} icon={toastIcon}  />
        
            {/* <TouchableOpacity onPress={()=>router.back()} style={{justifyContent:'flex-start', alignSelf:'flex-start' }}>
                <BackIcon size={26} color={Colors.mainGray} />
            </TouchableOpacity> */}
            <View className="flex-row w-full justify-start items-center gap-2 py-1">
                <Handshake color='white'  />
                <Text className='text-white text-3xl  font-pbold'>Recommendations</Text>
            </View>
            <View className='flex-row gap-2 w-full justify-start items-center'>
                <TouchableOpacity onPress={()=>{setTab('accepted') }} style={{ borderRadius:15, backgroundColor:tab==='accepted' ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
                        <Text className=' font-pmedium' style={{ color : tab==='accepted' ? Colors.primary : 'white' }}>Accepted</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setTab('pending') }} style={{ borderRadius:15, backgroundColor:tab==='pending' ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
                        <Text className=' font-pmedium' style={{ color : tab==='pending' ? Colors.primary : 'white' }}>Pending{recommendationsReceived.length > 0 && ` (${pendingRecsNotifCount})`}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setTab('sent') }} style={{ borderRadius:15, backgroundColor:tab==='sent' ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
                        <Text className=' font-pmedium' style={{ color : tab==='sent' ? Colors.primary : 'white' }}>Sent</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setTab('declined') }} style={{ borderRadius:15, backgroundColor:tab==='declined' ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
                        <Text className=' font-pmedium' style={{ color : tab==='declined' ? Colors.primary : 'white' }}>Declined</Text>
                </TouchableOpacity>
            </View>

            { undeterminedAndFlagged && (
                <View className='w-full flex flex-row justify-center items-center gap-3 bg-primaryDark p-4 rounded-xl'>
                    <Text className='text-mainGray w-[70%]'>Turn on Notifications so you don't miss out when your friends send you recs!</Text>
                    <TouchableOpacity onPress={handleYes} className='bg-newDarkGray px-3 py-2 rounded-lg'>
                        <Text className='text-secondary font-bold '>Turn on</Text>
                    </TouchableOpacity>
                </View>
            ) }

            <View className='h-full w-full'>

            {  tab === 'pending' ? (
                < View className='w-full' >
               

                    <FlatList
                        refreshControl={<RefreshControl
                                onRefresh={  refetchReceived }
                                refreshing={ loadingReceived}
                                tintColor={Colors.secondary}
                            />
                        }
                        scrollEnabled={true}
                        ListHeaderComponent={ recommendationsReceived?.length < 1 && (
                            <Text className='text-mainGray text-center text-xl font-pmedium' >(No pending recommendations)</Text>
                        ) }
                        data={recommendationsReceived}
                        keyExtractor={(item,index) => `${item.id}-${index}`}
                        contentContainerStyle={{ width:'100%', gap:10, paddingBottom:100 }}
                        onEndReached={() => {
                        if ( hasMoreReceived  ){
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
                                            <View className='flex flex-col gap-3  justify-center items-center'>
                                                    <TouchableOpacity className='flex flex-row justify-start items-center gap-1 self-start' onPress={()=>handleAccept('ACCEPTED',item)} style={{ backgroundColor : Colors.darkGray, paddingHorizontal:12, paddingVertical:10, borderRadius:10 }}>
                                                        <PlaylistCheck size={18} color={'green'} strokeWidth={3} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity className='flex flex-row justify-start items-center gap-1 self-start' onPress={()=>handleDecline(item)} style={{ backgroundColor : Colors.darkGray, paddingHorizontal:12, paddingVertical:10, borderRadius:10 }}>
                                                        <X  size={18} color={'red'} strokeWidth={3} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity className='flex flex-row justify-start items-center gap-1 self-start' onPress={()=>handleRemove('pending',item)} style={{ backgroundColor : Colors.darkGray, paddingHorizontal:12, paddingVertical:10, borderRadius:10 }}>
                                                        <Trash2 color={Colors.mainGray} size={18} strokeWidth={3}/>
                                                    </TouchableOpacity>
                                            </View>
                                           
                                        </View>
                                    </View>
                                </TouchableOpacity>
                        )}}
                    />


                </View>

            ) : tab === 'sent' ? (
                <View className='w-full'>
                    

                    <FlatList
                    refreshControl={<RefreshControl
                        onRefresh={  refetch }
                        refreshing={loading}
                        tintColor={Colors.secondary}
                        />}
                        ListHeaderComponent={ recommendationsSent?.length < 1 && (
                            <Text className='text-mainGray text-center text-xl font-pmedium' >(No sent recommendations)</Text>
                        ) }
                        scrollEnabled={true}
                        data={recommendationsSent}
                        keyExtractor={(item,index) => `${item.id}-${index}`}
                        contentContainerStyle={{ width:'100%', gap:10, paddingBottom:100 }}
                        onEndReached={() => {
                        if ( hasMoreSent  ){
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
                                                    <TouchableOpacity className='flex flex-row justify-start items-center gap-1 self-start' onPress={()=>handleRemove('sent',item)} style={{ backgroundColor : Colors.darkGray, paddingHorizontal:12, paddingVertical:10, borderRadius:10 }}>
                                                        <Trash2 color={Colors.mainGray} size={18} strokeWidth={3}/>
                                                    </TouchableOpacity>
                                                   
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}}
                        />
                  

                </View>
            ) : tab === 'accepted' ? (
                    <FlatList
                    refreshControl={<RefreshControl
                        onRefresh={  refetchAccepted }
                        refreshing={loading}
                        tintColor={Colors.secondary}
                        />}
                        ListHeaderComponent={ acceptedRecommendations?.length < 1 && (
                            <Text className='text-mainGray text-center text-xl font-pmedium' >(No accepted recommendations)</Text>
                        ) }
                        scrollEnabled={true}
                        data={acceptedRecommendations}
                        keyExtractor={(item,index) => `${item.id}-${index}`}
                        contentContainerStyle={{ width:'100%', gap:10, paddingBottom:100 }}
                        onEndReached={() => {
                        if ( hasMoreAccepted  ){
                            fetchMoreAccepted()
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
                                                    <TouchableOpacity className='flex flex-row justify-start items-center gap-1 self-start' onPress={()=>handleRemove('accepted',item)} style={{ backgroundColor : Colors.darkGray, paddingHorizontal:12, paddingVertical:10, borderRadius:10 }}>
                                                        <Trash2 color={Colors.mainGray} size={18} strokeWidth={3}/>
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
                        ListHeaderComponent={ declinedRecommendations?.length < 1 && (
                            <Text className='text-mainGray text-center text-xl font-pmedium' >(No declined recommendations)</Text>
                        ) }
                        scrollEnabled={true}
                        data={declinedRecommendations}
                        keyExtractor={(item,index) => `${item.id}-${index}`}
                        contentContainerStyle={{ width:'100%', gap:10, paddingBottom:100 }}
                        onEndReached={() => {
                        if ( hasMoreDeclined  ){
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
                                                    <TouchableOpacity className='flex flex-row justify-start items-center gap-1 self-start' onPress={()=>handleRemove('declined',item)} style={{ backgroundColor : Colors.darkGray, paddingHorizontal:12, paddingVertical:10, borderRadius:10 }}>
                                                        <Trash2 color={Colors.mainGray} size={18} strokeWidth={3}/>
                                                    </TouchableOpacity>
                                                   
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}}
                        />
            )
        }
            </View>


            <View style={{ paddingTop:20 }}>
                </View>
        </View>
    </SafeAreaView>
  )
}

export default RecommendationListScreen

const styles = StyleSheet.create({})