import {  Text, View, ScrollView, RefreshControl, FlatList } from 'react-native'
import { Image } from 'expo-image'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'expo-router/build/hooks'
import { useLocalSearchParams } from 'expo-router/build/hooks'
import {GetMovieById} from '../../api/tmdb'
import {BackIcon, DownIcon} from '../../assets/icons/icons'
import { TouchableOpacity } from 'react-native'
import {Colors} from '../../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { ImageBackground } from 'react-native'
import YoutubePlayer from 'react-native-youtube-iframe';
import CastCrewHorizontal from '../CastCrewHorizontal'
import DiscussionThread from '../DiscussionThread'
import { capitalize } from '../../lib/capitalize'
import { getMovieMentions, useFetchMovieMentions, markMovieWatch, markMovieWatchlist } from '../../api/movie'
import DialogueCard from '../DialogueCard'
import { fetchMovieFromDB } from '../../api/movie'
import { useQueryClient } from '@tanstack/react-query';
import ThreadCard from '../ThreadCard'
import { useFetchOwnerUser } from '../../api/user'
import { useUser } from '@clerk/clerk-expo'
import { Eye, EyeOff, ListChecks, Handshake, Star, Ellipsis } from 'lucide-react-native'
import { newRecommendation } from '../../api/recommendation'
import ToastMessage from '../ui/ToastMessage'





const MoviePage = () => {
    const params = useLocalSearchParams();
    const movieId = params.movieId
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const router = useRouter();
    const queryClient = useQueryClient();


    const [movie, setMovie] = useState([]);
    const [ DBmovieId, setDBmovieId ] = useState(null)
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false)
    const youtubeURL = 'https://www.youtube.com/watch?v='
    const [videoId, setVideoId] = useState(null)
    const playerRef = useRef(null);
    const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&mute=1&showinfo=0&rel=0&controls=1&loop=1`;
    const [creditsList, setCreditsList] = useState({});
    const [ fullCredits, setFullCredits ] = useState({
        castList : [],
        crewList : [],
    })
    const [whichCredits, setWhichCredits] = useState('Cast');
    const [dropdownMenu, setDropdownMenu] = useState(false);
    // const [ mentions, setMentions ] = useState([])
    const [ threads, setThreads ] = useState([])
    const [ buttonPressed , setButtonPressed ] = useState('')
    const [ message ,setMessage ] = useState(null)

    const {user: clerkUser} = useUser();
    const { data:mentions, refetch:refetchMentinos, isFetching:isFetchingMentions } = useFetchMovieMentions( movieId );
    const { data : ownerUser, refetch : refetchOwnerUser } = useFetchOwnerUser({ email: clerkUser.emailAddresses[0].emailAddress })
    const alreadyWatched = ownerUser?.userWatchedItems.some( item => item.movieId === Number(DBmovieId) )
    const alreadyInWatchlist = ownerUser?.watchlistItems.some( item => item.movieId === Number(DBmovieId) )
    const [ movieRatings, setMovieRatings ] = useState([])
    
    const alreadyRated = movieRatings?.some( item => item.movieId === Number(DBmovieId) && item.userId === ownerUser?.id )
    const ownerRating = movieRatings?.find( item => item.userId === ownerUser?.id && item.movieId === Number(DBmovieId) ) || 'N/A'
    const followersAndFollowingIds = ownerUser?.followers.map(item => item.followerId ).concat(ownerUser?.followers.map(f => f.followingId))
    const friendsRatingList = movieRatings?.filter( item => followersAndFollowingIds.includes(item.userId) && item.userId !== ownerUser?.id )
    const totalFriendsRatings = friendsRatingList.reduce((sum, rating) => sum + rating.rating, 0);
    const averageFriendsRating = friendsRatingList.length > 0 ? (totalFriendsRatings / friendsRatingList.length ).toFixed(1): 'N/A';
    const totalOverallRatings = movieRatings?.reduce((sum,rating) => sum + rating.rating, 0)
    const overallRatings = movieRatings.length > 0 ? (totalOverallRatings / movieRatings.length).toFixed(1) : 'N/A'





    const fetchData = async () => {
        setLoading(true);    
        try {
            const res = await GetMovieById(movieId);  // Pass movieId here
            setMovie(res);
            try {
                const trailer = res?.videos?.results.find(item => (item.type === 'Trailer' || item.type === 'Teaser') && item.site === 'YouTube').key ;
                if (trailer) {
                    setVideoId(trailer)
                }
            } catch (err) {
                console.log("Couldn't find youtube trailer", err)
            }
            const credits = res.credits;
            if (credits) {
                // console.log('found a trailer', credits)
                setCreditsList(credits);
                const castCredits = credits.cast;
                const crewCredits = credits.crew;
                setFullCredits(prevData => ({
                    ...prevData,
                    castList : castCredits,
                    crewList : crewCredits,
                }))
            }

            const movieData = {
                tmdbId : res.id,
                title : res.title,
                releaseDate : res.release_date,
                posterPath  : res.poster_path,
                backdropPath : res.backdrop_path
            }

            const cachedMovieFromDB = queryClient.getQueryData(['movie', movieId]);
            if (cachedMovieFromDB){
                setThreads(cachedMovieFromDB.threads)
                setDBmovieId(cachedMovieFromDB.id)
                setMovieRatings(cachedMovieFromDB.ratings)
            } else {
                const movieFromDB = await fetchMovieFromDB({movieData})
                queryClient.setQueryData(['movie', movieId]);
    
                // console.log('tvfromdb', movieFromDB)
                setMovieRatings(movieFromDB.ratings)
                setThreads( movieFromDB.threads );
                setDBmovieId( movieFromDB.id )
                queryClient.setQueryData(['threads', movieId], movieFromDB.threads);
            }

            // const fetchedMentions = await getMovieMentions(movieId);
            // setMentions(fetchedMentions);
          
        } catch (err) {
            Alert.alert("Error", err.message);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setRefreshing(true);
        try {
            fetchData();
        } catch (err) {
            console.log(err);
        } finally {
            setRefreshing(false)
        }
    }
    
   
    
    useEffect(() => {
        if (movieId) {  // Only fetch if movieId is available
            fetchData();
        }
    }, [movieId]); 


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

    const handlePress = (item) => {
        if (item.media_type === 'movie'  ){
          router.push(`/movie/${item.id}`)
        } else if (item.media_type === 'person') {
          router.push(`/cast/${item.id}`)
        } else if (item.media_type === 'tv') {
          router.push(`/tv/${item.id}`)
        }
      }

      const threadsPress = (id) => {
        router.push(`/threads/${id}?movieId=${movieId}`)
    }
    
    const castPress = (item) => {
        router.push(`/cast/${item.id}`)
    }

    const handleMentionPress = (item) => {
        router.push(`/dialogue/${item.dialogueId}`)
    }


    const refetchMentionsThreads =  () => {
        queryClient.invalidateQueries(['mentions']);
        queryClient.invalidateQueries(['threads']);
        // fetchData()
    };


    const handleMarkWatched = async (  ) => {
        if ( alreadyWatched ){

            setButtonPressed('unwatched')
        } else {
            setButtonPressed('watched')
        }
        const marked = await markMovieWatch({ movieId : DBmovieId, userId : ownerUser?.id })
        if(marked){
            if ( alreadyWatched ){
                setMessage('Removed from Watched')
            } else {
                setMessage('Marked as Watched')
            }
        }
        refetchOwnerUser();
        setButtonPressed('')
    }



    const handleMore = () => {
        router.push({
            pathname: "/moreInteractions",
            params: { DBMovieId: String(DBmovieId), tmdbId : movieId }, // Convert to string
        });
    }

    const handleWatchlist = async (  ) => {
        if (alreadyInWatchlist){
            setButtonPressed('removeFromWatchlist')
        } else {
            setButtonPressed('addToWatchlist')
        }
        const addedToWatchlist = await markMovieWatchlist({ movieId : DBmovieId, userId : ownerUser?.id })
        if (addedToWatchlist){
            if (alreadyInWatchlist){
                setMessage('Removed from Watchlist')
            } else {
                setMessage('Added to Watchlist')
            }
        }
        refetchOwnerUser();
        setButtonPressed('')
    }


    const handleRecommendation = () => {
        router.push({
            pathname : '/recommendationModal',
            params: { DBmovieId }
        })
    }

    const handleRate = () => {
        router.push({
            pathname : '/ratingModal',
            params: { DBmovieId : DBmovieId, prevRating : ownerRating?.rating }
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


    if ( !ownerUser){
        return (
            <View className='h-full justify-center items-center bg-primary'>
                <ActivityIndicator/>
            </View>
        )
    }

  return (
    <View className='bg-primary h-full flex  pt-0 gap-10 relative  ' style={{}}>
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
                placeholder={{uri : `${posterURLlow}${movie.poster_path}`}}
                placeholderContentFit='cover'
                transition={300}
                style={{ width:100, height: 180, overflow:'hidden', borderRadius:10}}
                contentFit='cover'
            />
            <View className='  flex items-start w-52 gap-3' style={{marginBottom:0}}>
                <View className=' flex gap-2'>
                    
                    <Text className='text-third text-2xl font-pbold'>{movie.title}</Text>
                    <Text className='text-mainGray text-sm font-pmedium'>Released {movie.release_date}</Text>
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
                            <Text className='text-mainGray text-xs border-[1px] rounded-md p-1' style={{borderColor:Colors.mainGray}}>Film</Text>
                          
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
                <View className='gap-0 items-center'>
                    <Text className='text-mainGray text-sm font-psemibold'>Your rating</Text>
                    <Text className='text-mainGray text-3xl font-pbold'>{ownerRating?.rating?.toFixed(1) || 'N/A'}</Text>
                </View>
                <View className='gap-0'>
                    <Text className='text-mainGray text-sm font-psemibold'>Your friends</Text>
                    <View className='flex-row items-center gap-2 justify-center'>
                        <Text className='text-mainGray text-3xl font-pbold'>{averageFriendsRating}</Text>
                    </View>
                </View>
                <View className='gap-0'>
                    <Text className='text-mainGray text-sm font-psemibold'>Overall rating</Text>
                    <View className='flex-row items-center gap-2 justify-center'>
                        <Text className='text-mainGray text-3xl font-pbold'>{overallRatings}</Text>
                    </View>
                </View>
                
            </View>
            <View className=' gap-5'>
                <Text className='text-mainGray font-pcourier text-lg uppercase  text-center underline '>Logline</Text>
                <Text className='text-mainGray font-pcourier  '>{movie.overview}</Text>
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
            <View className='w-full justify-center items-center gap-3'>
                <Text className='text-white font-pbold text-lg'>Mentions</Text>
                <FlatList
                    horizontal
                    data={mentions}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ gap:15 }}
                    renderItem = {({item}) => (
                        <TouchableOpacity onPress={()=>handleMentionPress(item)}  style={{ width:300 }}>
                            <DialogueCard dialogue={item.dialogue} refetch={refetchMentionsThreads} isBackground={true} ></DialogueCard>
                        </TouchableOpacity>
                    )}
                />
            </View>


            <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>
            {/* <DiscussionThread threadsPress={threadsPress} threads={threads} ></DiscussionThread> */}
            <FlatList
                        scrollEnabled={false}
                        data={threads}
                        keyExtractor={(item)=>item.id}
                        contentContainerStyle={{ }} 
                        ListHeaderComponent={(
                            <Text className='text-white font-pbold   text-center text-lg mb-3'>Threads</Text>
                        )}
                        renderItem={({item}) => {
                            
                            return (
                            <TouchableOpacity onPress={()=>threadsPress(item.id)} style={{gap:10, borderRadius:10, backgroundColor:Colors.mainGrayDark, paddingTop:15, marginBottom:15 ,paddingBottom:20, paddingHorizontal:20}}  >
                                <ThreadCard thread={item} refetch={ refreshData} ></ThreadCard>
                            </TouchableOpacity>
                        )}}
                    />
            <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>

            <View>
     
    </View>
        </View>
    </ScrollView>
    </View>
  )
}

    MoviePage.options = {
        tabBarStyle: { display: 'flex' }, // Makes the tab bar visible
        headerShown: false,  // Optional: Hide header if not needed
    }

export default MoviePage