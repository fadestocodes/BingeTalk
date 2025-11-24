import {  Text, View, ScrollView, Dimensions, RefreshControl, FlatList, ActivityIndicator, LoadingComponent} from 'react-native'
import { Image } from 'expo-image'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'expo-router/build/hooks'
import { useLocalSearchParams } from 'expo-router/build/hooks'
import {GetTVById} from '../../api/tmdb'
import {BackIcon, DownIcon, ProgressCheckIcon} from '../../assets/icons/icons'
import { TouchableOpacity } from 'react-native'
import {Colors} from '../../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { ImageBackground } from 'react-native'
import YoutubePlayer from 'react-native-youtube-iframe';
import CastCrewHorizontal from '../CastCrewHorizontal'
import { capitalize } from '../../lib/capitalize'
import DiscoverHorizontal from '../DiscoverHorizontal'
import { markTVWatchlist, useFetchTVMentions } from '../../api/tv'
import DialogueCard from '../DialogueCard'
import { useFetchTVThreads } from '../../api/tv'
import { fetchTVFromDB } from '../../api/tv'
// import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useGetTVById } from '../../api/tmdb'
import { fetchTVThreads, useGetTVThreads } from '../../api/tv'
import { Eye, EyeOff, ListChecks, Handshake, Star, Ellipsis } from 'lucide-react-native'

import { useFetchOwnerUser } from '../../api/user'
import { markTVWatch } from '../../api/tv'
import ToastMessage from '../ui/ToastMessage'
import { moviePosterFallback } from '../../constants/Images'
import { useBadgeContext } from '../../lib/BadgeModalContext'
import { checkHistorianBadgeProgress } from '../../api/badge'
import { useGetUser, useGetUserFull } from '../../api/auth'







const TVPage = () => {
    const params = useLocalSearchParams();
    const tvId = params.tvId
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const router = useRouter();
    // const queryClient = useQueryClient();
    const {showBadgeModal} = useBadgeContext()


    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [videoId, setVideoId] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const [ fullCredits, setFullCredits ] = useState({
        castList : [],
        crewList : [],
    })
    const [whichCredits, setWhichCredits] = useState('Cast');
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const [threads, setThreads] = useState(null)
    const [ DBtvId, setDBtvId ] = useState(null)
    const [ buttonPressed , setButtonPressed ] = useState('')
    const [ message ,setMessage ] = useState(null)
    const [ tvRatings, setTVRatings ] = useState([])
   


    const {user} = useGetUser()
    const {userFull:ownerUser, refetch:refetchOwner}= useGetUserFull(user?.id)

    const { data:mentions, refetch:refetchMentions, isFetching:isFetchingMentions } = useFetchTVMentions( tvId );

    const alreadyWatched = ownerUser?.userWatchedItems.some( item => item.tvId === Number(DBtvId) )

    const alreadyInWatchlist = ownerUser?.watchlistItems.some( item => item.tvId === Number(DBtvId) )

    const alreadyRated = tvRatings?.some( item => item.tvId === Number(DBtvId) && item.userId === ownerUser?.id )
    const ownerRating = tvRatings?.find( item => item.userId === ownerUser?.id && item.tvId === Number(DBtvId) ) || 'N/A'
    const followersAndFollowingIds = ownerUser?.followers.map(item => item.followerId ).concat(ownerUser?.followers.map(f => f.followingId))
    const friendsRatingList = tvRatings?.filter( item => followersAndFollowingIds?.includes(item.userId) && item.userId !== ownerUser?.id )
    const totalFriendsRatings = friendsRatingList.reduce((sum, rating) => sum + rating.rating, 0);
    const averageFriendsRating = friendsRatingList.length > 0 ? (totalFriendsRatings / friendsRatingList.length ).toFixed(1): 'N/A';
    const totalOverallRatings = tvRatings?.reduce((sum,rating) => sum + rating.rating, 0)
    const overallRatings = tvRatings.length > 0 ? (totalOverallRatings / tvRatings.length).toFixed(1) : 'N/A'



    const threadData = {
        tvObj:movie
    }

    const fetchData = async () => {
        setLoading(true);  
        try {
            const res = await GetTVById(tvId);  
            setMovie(res);
            if (res?.videos?.results){
                try {
                    const trailer = res.videos.results.find(item => (item.type === 'Trailer' || item.type === 'Teaser') && item.site === 'YouTube')?.key || null;
                    setVideoId(trailer)
                } catch (err){
                    console.log(err)
                }
            }
            const credits = res.credits;
            if (credits) {
                const castCredits = credits.cast;
                const crewCredits = credits.crew;
                setFullCredits(prevData => ({
                    ...prevData,
                    castList : castCredits,
                    crewList : crewCredits,
                }))
            }

          

            const tvData = {
                tmdbId : res.id,
                title : res.name,
                releaseDate : res.first_air_date,
                posterPath  : res.poster_path,
                backdropPath : res.backdrop_path
            }
            
            const tvFromDB = await fetchTVFromDB({tvData})
            setDBtvId(tvFromDB.id)
            setTVRatings(tvFromDB.ratings)

            


          
        } catch (err) {
            console.log('Problem fetching data', err);
            // Alert.alert("Error", err.message);
        } finally {
            setLoading(false);
        }
    };


    
   

    const refreshData = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    }
    
    useEffect(() => {
            fetchData();
    }, [tvId]); 



    const backPress = () => {
      router.back();
    }

    const creditOptions = [     
        'Cast',
        'Crew',
    ]

    const handleDropdownPress = (item) => {
        setWhichCredits(item);
        setDropdownMenu(false);
    }

    const castPress = (item) => {
        if (item.poster_path){  
            router.push(`/movie/${item.id}`)
        } else {
            router.push(`/cast/${item.id}`)
        }
    }

    const threadsPress = (id) => {
        router.push(`/threads/${id}?tvId=${tvId}`)
    }

    const handlePress = (item) => {
          router.push(`/tv/${item.id}`)
      }

    const handleMentionPress = (item) => {
        router.push(`/dialogue/${item.dialogueId}`)
    }

  

    const handleMarkWatched = async (  ) => {
        if ( alreadyWatched ){
            setButtonPressed('unwatched')
        } else {
            setButtonPressed('watched')
        }
        const marked = await markTVWatch({ tvId : DBtvId, userId : ownerUser?.id })
        if (marked){
            if ( alreadyWatched ){
                setMessage('Removed from Watched')
            } else {
                setMessage('Marked as Watched')
            }
        }
        await refetchOwner();

        const checkHistorian = await checkHistorianBadgeProgress(movie,'TV', ownerUser?.id)
        let levelUpData = null
        if (checkHistorian?.hasLeveledUp){
            levelUpData = {
                badgeType: 'HISTORIAN',
                level: `${checkHistorian.newLevel}`
            };
        }
        if (levelUpData) {
            showBadgeModal(levelUpData.badgeType, levelUpData.level);
        }
        setButtonPressed('')
    }

    const handleMore = () => {
        router.push({
            pathname: "/moreInteractions",
            params: { DBtvId: String(DBtvId), tmdbId : tvId }, 
        });
    }

    const handleWatchlist = async (  ) => {
        if (alreadyInWatchlist){
            setButtonPressed('removeFromWatchlist')
        } else {
            setButtonPressed('addToWatchlist')
        }
        const addedToWatchlist = await markTVWatchlist({ tvId : DBtvId, userId : ownerUser?.id })
        if (addedToWatchlist){
            if (alreadyInWatchlist){
                setMessage('Removed from Watchlist')
            } else {
                setMessage('Added to Watchlist')
            }
        }
        await refetchOwner();
        setButtonPressed('')

    }


    const handleRecommendation = () => {
        router.push({
            pathname : '/recommendationModal',
            params: { DBtvId }
        })
    }


    const handleRate = () => {
        router.push({
            pathname : '/ratingModal',
            params: { DBtvId : DBtvId, prevRating : ownerRating.rating }
        })
    }


    const DynamicIcon = () => {
        if (buttonPressed === 'unwatched'){
            return(
            <EyeOff size={30} color={Colors.secondary}/> )
        } else if ( buttonPressed === 'watched'){
            return (
            <Eye size={30} color={Colors.secondary}/> )
        } else {
            return (
            <ListChecks size={30} color={Colors.secondary} />)
        }
    }


    const handleRatingsPage = (tab) => {
        router.push({
            pathname : `/tv/ratings/${DBtvId}`,
            params : { type : 'tv', tab , title : movie.name, release : movie.first_air_date}
        })
    }


    if ( !ownerUser || !movie || !DBtvId){
        return (
            <View className='h-full justify-center items-center bg-primary'>
                <ActivityIndicator/>
            </View>
        )
    }





  return (
    <View className='bg-primary h-full flex  pt-0 gap-10 relative ' style={{}}>
                <ToastMessage message={message} onComplete={() => setMessage('')} icon={<DynamicIcon/>}  />

    <ScrollView 
    refreshControl={
        <RefreshControl
          tintColor={Colors.secondary}
          refreshing={refreshing}
          onRefresh={refreshData}
        />
         }
    >
         <TouchableOpacity onPress={()=>router.back()} style={{position:"absolute", top:50, zIndex:20, left:30}}>
              <BackIcon size={26} color={Colors.mainGray}/>
            </TouchableOpacity>

        <View className="flex ">
        <Image
            style={{
            width: '100%',
            top:0,
            height: 300,
            position: 'absolute',
            borderRadius:30,
            }}
            source={{uri : `${posterURL}${movie?.backdrop_path}`}}
            placeholder={{uri : `${posterURLlow}${movie?.backdrop_path}`}}
            placeholderContentFit='cover'
            contentFit="cover" 
            transition={300} 
        />
        <LinearGradient
            colors={['transparent', Colors.primary]}
            style={{
            height: 300,
            width: '100%',
            position: 'absolute',
            top:0,
            }}
        />
        </View>
        <View className='beside-poster w-full  items-center flex-row justify-center gap-6 mb-8 ' style={{paddingTop:150}}>
            <Image 
                source={{uri : `${posterURL}${movie.poster_path}`}}
                placeholder={moviePosterFallback}

                placeholderContentFit='cover'
                style={{ width:100, height: 180, overflow:'hidden', borderRadius:10}}
                contentFit='cover'
                transition={300}
            />
            <View className='  flex items-start w-52 gap-3' style={{marginBottom:0}}>
                <View className=' flex gap-2'>
                    
                    <Text className='text-third text-2xl font-pbold'>{movie.name}</Text>
                    <View className='gap-0'>
                        <Text className='text-mainGray text-sm font-pmedium'>First aired: {movie.first_air_date}</Text>
                        <Text className='text-mainGray text-sm font-pmedium'>Last aired: {movie.last_air_date}</Text>
                        <Text className='text-mainGray text-sm font-pmedium'>Number of seasons: {movie.number_of_seasons}</Text>
                        { movie.original_language && (
                        <View className='flex gap-2 justify-center items-start '>
                            <Text className='text-mainGray text-sm '>Original language:</Text>
                            <TouchableOpacity>
                                <Text className='text-mainGray text-xs border-[1px] rounded-md p-1' style={{borderColor:Colors.mainGray}}>{movie.original_language.toLocaleUpperCase()}</Text>
                            </TouchableOpacity>
                        </View>
                        ) }
                    </View>
                </View>
                
                
            </View>
            
        </View>
        <View className="buttons flex gap-4 w-full items-center mb-6">
                    <TouchableOpacity onPress={handleMarkWatched} >
                        <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyWatched ? 'transparent' : Colors.secondary }} >
                                { alreadyWatched ? <EyeOff size={20}  color={Colors.secondary} /> : <Eye size={20} color={Colors.primary} /> }
                            <Text className='text-primary font-pbold text-sm' style={{ color : alreadyWatched ? Colors.secondary : Colors.primary }}>{ alreadyWatched ? 'Remove from watched' : 'Mark as watched' }</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={handleWatchlist}>
                        <View    className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyInWatchlist ? 'transparent' : Colors.secondary }}>
                        { alreadyInWatchlist ? <ListChecks color={Colors.secondary} size={20} /> : <ListChecks color={Colors.primary} size={20} /> }
                            <Text className='text-primary font-pbold text-sm' style={{ color : alreadyInWatchlist ? Colors.secondary : Colors.primary }}>{ alreadyInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist' }</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRecommendation} >
                        <View    className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center'>
                            <Handshake color={Colors.primary} size={20} />
                            <Text className='text-primary font-pbold text-sm'>Recommend to friend</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRate}>
                        <View    className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyRated ? 'transparent' : Colors.secondary }}>
                        { alreadyRated ? <Star color={Colors.secondary} size={20} /> : <Star color={Colors.primary} size={20} /> }
                            <Text className='text-primary font-pbold text-sm' style={{ color : alreadyRated ? Colors.secondary : Colors.primary }}>{ alreadyRated ? 'Update Rating' : 'Rate' }</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleMore} >
                        <View    className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center'>
                            <Ellipsis  color={Colors.primary} size={20} />
                        </View>
                    </TouchableOpacity>
        </View>
        <View className='genre-badges flex-row gap-3 flex-wrap px-6 w-full items-center justify-center ' >
                        <TouchableOpacity>
                            <Text className='text-mainGray text-xs border-[1px] rounded-md p-1' style={{borderColor:Colors.mainGray}}>TV</Text>
                        </TouchableOpacity>
                            { movie.genres &&  movie.genres.map((genre, index) => (

                                <View key={index} className='flex-row'>
                                    <TouchableOpacity>
                                        <Text className='text-mainGray text-xs border-[1px] rounded-md p-1' style={{borderColor:Colors.mainGray}}>
                                            { genre.name }
                                        </Text>
                                    </TouchableOpacity>
                                </View>    
                            )) }
                      
        </View>
        <View className='main-wrapper px-6 flex pt-220 gap-6 ' style={{marginTop:20, marginBottom:200}}>
        <View className='ratings flex-row justify-center items-center flex-wrap gap-8'>
        <TouchableOpacity onPress={()=> handleRatingsPage('All')}  className='gap-0 items-center'>
                    <Text className='text-mainGray text-sm font-psemibold'>Your rating</Text>
                    <Text className='text-mainGray text-3xl font-pbold'>{ownerRating?.rating?.toFixed(1) || 'N/A'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> handleRatingsPage('Your friends')}  className='gap-0'>
                    <Text className='text-mainGray text-sm font-psemibold'>Your friends</Text>
                    <View className='flex-row items-center gap-2 justify-center'>
                        <Text className='text-mainGray text-3xl font-pbold'>{averageFriendsRating}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> handleRatingsPage('All')} className='gap-0'>
                    <Text className='text-mainGray text-sm font-psemibold'>Overall rating</Text>
                    <View className='flex-row items-center gap-2 justify-center'>
                        <Text className='text-mainGray text-3xl font-pbold'>{overallRatings}</Text>
                    </View>
                </TouchableOpacity>
                
            </View>
            <View className=' gap-5'>
                <Text className='text-mainGray font-pcourier text-lg uppercase  text-center underline '>Logline</Text>
                <Text className='text-mainGray font-pcourier   '>{movie.overview}</Text>
                {videoId && (
                    <YoutubePlayer
                    style={{}}
                    height={200}
                    play={true}
                    videoId={videoId}
                    initialPlayerParams={{controls:1}}
                    mute={true}
                    viewContainerStyle={{borderRadius:25, overflow:'hidden'}}
                    webViewProps={{borderRadius:25, overflow:'hidden'}}
                    />
                )}
            </View>
            <View className='dropdown-menu relative flex gap-5 w-auto'>
            <View className='flex-row gap-2 justify-start items-center'>

                <Text className='text-mainGray font-psemibold '>Credits:  </Text>
                <TouchableOpacity onPress={()=>setDropdownMenu(prevData => !prevData)} className='justify-start items-center' style={{borderRadius:10, borderWidth:2, backgroundColor:Colors.mainGray, borderColor:Colors.mainGray, paddingHorizontal:5, paddingVertical:2, flexDirection:'row', gap:5, alignSelf:'flex-start'}}>
                <Text className='text-primary font-psemibold '>{capitalize(whichCredits)}</Text>
                <DownIcon color={Colors.primary} size={15}></DownIcon>
                </TouchableOpacity>
                </View>

                { dropdownMenu && (
                    <>
                    <View style={{marginBottom:30, borderWidth:2, borderColor:Colors.mainGray, paddingHorizontal:10, paddingVertical:20, justifyContent:'center', alignItems:'', gap:10, borderRadius:10}}>
                    {creditOptions.map((item,index) => (
                        <View key={index} style={{ display:'flex', justifyContent:'center',  marginTop:0, marginBottom:0}}>
                            <TouchableOpacity style={{ width:'auto' }} onPress={()=>handleDropdownPress(item)}>
                                <Text className='text-mainGray items-center justify-center' style={{width:300}}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                                <View style={{ borderTopWidth:1, marginTop:10, borderColor:Colors.mainGray, width:'320',  }}/>
                        </View>

                    )) }
                    </View>
                    </>
                )  }
                { whichCredits === 'Cast' && (
                    <CastCrewHorizontal  param={ fullCredits.castList} handlePress={castPress}/>
                ) }
                { whichCredits === 'Crew' && (
                    <CastCrewHorizontal  param={ fullCredits.crewList } handlePress={castPress} />
                ) }
            </View>

            <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>
            <View className='w-full justify-center items-center '>
              
                    <Text className='text-white font-pbold text-lg '>Mentions</Text>
                    <FlatList
                        horizontal
                        data={mentions}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ gap:15, marginTop:10 }}
                        renderItem = {({item}) => (
                            <TouchableOpacity onPress={()=>handleMentionPress(item)} style={{ width:300 }}>
                                <DialogueCard dialogue={item.dialogue}  refetch={refetchMentionsThreads} isBackground={true} ></DialogueCard>
                            </TouchableOpacity>
                        )}
                        />
                  
            </View>



            
           

     
        </View>
    </ScrollView>
    </View>
  )
}

    TVPage.options = {
        tabBarStyle: { display: 'flex' }, 
        headerShown: false,  
    }

export default TVPage