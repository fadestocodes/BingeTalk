import {  Text, View, Image, ScrollView, RefreshControl, FlatList } from 'react-native'
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
import { getMovieMentions, useFetchMovieMentions, markMovieWatch } from '../../api/movie'
import DialogueCard from './DialoguePage'
import { fetchMovieFromDB } from '../../api/movie'
import { useQueryClient } from '@tanstack/react-query';
import ThreadCard from '../ThreadCard'
import { useFetchOwnerUser } from '../../api/user'
import { useUser } from '@clerk/clerk-expo'
import { Eye, EyeOff, ListChecks, Handshake, Star } from 'lucide-react-native'





const MoviePage = () => {
    const params = useLocalSearchParams();
    const movieId = params.movieId
    const posterURL = 'https://image.tmdb.org/t/p/original';
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

    const {user: clerkUser} = useUser();
    const { data:mentions, refetch:refetchMentinos, isFetching:isFetchingMentions } = useFetchMovieMentions( movieId );
    const { data : ownerUser, refetch : refetchOwnerUser } = useFetchOwnerUser({ email: clerkUser.emailAddresses[0].emailAddress })
    const alreadyWatched = ownerUser.userWatchedItems.some( item => item.movieId === Number(DBmovieId) )
    console.log('already watched?', alreadyWatched)

    const fetchData = async () => {
        setLoading(true);    
        try {
            const res = await GetMovieById(movieId);  // Pass movieId here
            setMovie(res);
            try {
                const trailer = res?.videos?.results.find(item => item.type === 'Trailer' && item.site === 'YouTube').key ;
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
            } else {
                const movieFromDB = await fetchMovieFromDB({movieData})
                queryClient.setQueryData(['movie', movieId]);
    
                console.log('tvfromdb', movieFromDB)
                setThreads( movieFromDB.threads );
                setDBmovieId( movieFromDB.id )
                queryClient.setQueryData(['threads', movieId], movieFromDB.threads);
            }

            // const fetchedMentions = await getMovieMentions(movieId);
            // setMentions(fetchedMentions);
          
        } catch (err) {
            console.log('Problem fetching data', err);
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
        console.log('id', id)
        router.push(`/threads/${id}?movieId=${movieId}`)
    }
    
    const castPress = (item) => {
        router.push(`/cast/${item.id}`)
    }

    const handleMentionPress = (item) => {
        console.log('trying to routerpush with these params', item.dialogueId)
        router.push(`/dialogue/${item.dialogueId}`)
    }


    const refetchMentionsThreads =  () => {
        queryClient.invalidateQueries(['mentions']);
        queryClient.invalidateQueries(['threads']);
        // fetchData()
    };


    const handleMarkWatched = async (  ) => {
        console.log('owneruserid', ownerUser.id)
        await markMovieWatch({ movieId : DBmovieId, userId : ownerUser.id })
        refetchOwnerUser();
    }



  return (
    <View className='bg-primary h-full flex  pt-0 gap-10 relative  ' style={{}}>
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
            <ImageBackground
                style={{width : '100%', height: 300, marginBottom:40, position:'absolute' }}
                source={{uri : `${posterURL}${movie?.backdrop_path}`}}
                resizeMethod='cover'
            
                >
                <LinearGradient
                    colors={[ 'transparent',Colors.primary]}
                    style={{height : '100%', width : '100%'}}>
                </LinearGradient>
                <TouchableOpacity className='border-white rounded-md w-16 flex items-center px-3 py-1 absolute top-20 left-4'   onPress={backPress}>
                        <BackIcon className='' color={Colors.third}  size='22'/>
                </TouchableOpacity>
            </ImageBackground>
        </View>
        <View className='beside-poster w-full  items-center flex-row justify-center gap-6 mb-8 ' style={{paddingTop:150}}>
            
            <Image 
                source={{uri : `${posterURL}${movie.poster_path}`}}
                style={{ width:100, height: 180, overflow:'hidden', borderRadius:10}}
                resizeMode='cover'
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
                        <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyWatched ? 'none' : Colors.secondary }} >
                                { alreadyWatched ? <EyeOff size={20}  color={Colors.secondary} /> : <Eye size={20} color={Colors.primary} /> }
                            <Text className='text-primary font-pbold text-sm' style={{ color : alreadyWatched ? Colors.secondary : Colors.primary }}>{ alreadyWatched ? 'Remove from watched' : 'Mark as watched' }</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View    className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center'>
                            <ListChecks color={Colors.primary} size={20} />
                            <Text className='text-primary font-pbold text-sm'>Add to Watchlist</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View    className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center'>
                            <Handshake color={Colors.primary} size={20} />
                            <Text className='text-primary font-pbold text-sm'>Recommend to friend</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View    className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center'>
                            <Star color={Colors.primary} size={20} />
                            <Text className='text-primary font-pbold text-sm'>Rate</Text>
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
                    <Text className='text-mainGray text-2xl font-pbold'>N/A</Text>
                </View>
                <View className='gap-0'>
                    <Text className='text-mainGray text-sm font-psemibold'>From your network</Text>
                    <View className='flex-row items-center gap-2 justify-center'>
                        <Text className='text-mainGray text-2xl font-pbold'>8.1</Text>
                        <Text className='text-mainGray text-xs font-pbold'>(avg)</Text>
                    </View>
                </View>
                <View className='gap-0'>
                    <Text className='text-mainGray text-sm font-psemibold'>From others</Text>
                    <View className='flex-row items-center gap-2 justify-center'>
                        <Text className='text-mainGray text-2xl font-pbold'>7.3</Text>
                        <Text className='text-mainGray text-xs font-pbold'>(avg)</Text>
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
                        <TouchableOpacity onPress={()=>handleMentionPress(item)} style={{ width:300 }}>
                            <DialogueCard dialogue={item.dialogue} refetch={refetchMentionsThreads} ></DialogueCard>
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
                            console.log('tiem from item flatlist', item)
                            
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