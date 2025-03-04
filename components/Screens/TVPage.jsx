import {  Text, View, Image, ScrollView, Dimensions, RefreshControl, FlatList, ActivityIndicator, LoadingComponent} from 'react-native'
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
import DiscussionThread from '../DiscussionThread'
import { capitalize } from '../../lib/capitalize'
import DiscoverHorizontal from '../DiscoverHorizontal'
import { markTVWatchlist, useFetchTVMentions } from '../../api/tv'
import DialogueCard from './DialoguePage'
import { useFetchTVThreads } from '../../api/tv'
import { fetchTVFromDB } from '../../api/tv'
import { useQueryClient, useQuery } from '@tanstack/react-query';
import ThreadCard from '../ThreadCard'
import { useGetTVById } from '../../api/tmdb'
import { fetchTVThreads, useGetTVThreads } from '../../api/tv'
import { Eye, EyeOff, ListChecks, Handshake, Star, Ellipsis } from 'lucide-react-native'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../api/user'
import { markTVWatch } from '../../api/tv'






const TVPage = () => {
    const params = useLocalSearchParams();
    const tvId = params.tvId
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const router = useRouter();
    const queryClient = useQueryClient();


    // const { data: movie, refetch } = useTMDB(()=>GetMovieById(tvId));
    const [movie, setMovie] = useState('');
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

    console.log('MOVIE',movie)
    const { user:clerkUser } = useUser();
    const { data : ownerUser, refetch : refetchOwnerUser } = useFetchOwnerUser({ email: clerkUser.emailAddresses[0].emailAddress })
    const { data:mentions, refetch:refetchMentions, isFetching:isFetchingMentions } = useFetchTVMentions( tvId );

    const alreadyWatched = ownerUser.userWatchedItems.some( item => item.tvId === Number(DBtvId) )
    const alreadyInWatchlist = ownerUser.watchlistItems.some( item => item.tvId === Number(DBtvId) )
    
    const threadData = {
        tvObj:movie
    }
    // const { data : threads, refetch : refetchThreads, isFetching:isFetchingThreads } = useGetTVThreads( tvId )
    console.log('THREADSSSS', threads)

    // const [ threads, setThreads ] = useState([])

    

   

    // const { data : threads, refetch: refetchThreads, isFetching:isFetchingThreads } = useFetchTVThreads( {tvId:tvId, tvObj} );

    const fetchData = async () => {
        setLoading(true);  
        try {
            const res = await GetTVById(tvId);  // Pass movieId here
            setMovie(res);
            if (res.videos.results.length){
                const trailer = res.videos.results.find(item => item.type === 'Trailer' && item.site === 'YouTube').key ;
                setVideoId(trailer)
            }
            console.log('tv id ', tvId)
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
            setThreads(tvFromDB.threads)
            setDBtvId(tvFromDB.id)

            // const cachedTVShowFromDB = queryClient.getQueryData(['tv', tvId]);
            // if (cachedTVShowFromDB){
            //     setThreads(cachedTVShowFromDB.threads)
            // } else {
            //     const tvFromDB = await fetchTVFromDB({tvData})
            //     queryClient.setQueryData(['tv', tvId], tvFromDB);
    
            //     console.log('tvfromdb', tvFromDB)
            //     setThreads( tvFromDB.threads );
            //     queryClient.setQueryData(['threads', tvId], tvFromDB.threads);
            // }


          
        } catch (err) {
            console.log('Problem fetching data', err);
            Alert.alert("Error", err.message);
        } finally {
            setLoading(false);
        }
    };

    const refetchMentionsThreads =  () => {
        queryClient.invalidateQueries(['mentions']);
        queryClient.invalidateQueries(['threads']);
        // fetchData()
    };
    
    // const fetchThreads = async () => {
    //     const data = {
    //         tvId,
    //         tvObj : movie
    //     }
    //     const fetchedThreads = await fetchTVThreads(data)
    //     console.log('FETCHEDTHREADS', fetchedThreads)
    //     setThreads(fetchTVThreads)
    // }

    const refreshData = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    }
    
    useEffect(() => {
            fetchData();
    }, []); 

    // const refetchThreads = async () => {
    //     const tvData = {
    //         tmdbId : res.id,
    //         title : res.name,
    //         releaseDate : res.first_air_date,
    //         posterPath  : res.poster_path,
    //         backdropPath : res.backdrop_path
    //     }
    //     const tvFromDB = await fetchTVFromDB({tvData})
    //     setThreads(tvFromDB.threads)
    // }

    
    


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
        console.log('id', id)
        router.push(`/threads/${id}?tvId=${tvId}`)
    }

    const handlePress = (item) => {
          router.push(`/tv/${item.id}`)
      }

    const handleMentionPress = (item) => {
        router.push(`/dialogue/${item.dialogueId}`)
    }

    // if (isFetchingMentions ){
    //     return <ActivityIndicator/>
    // }


    const handleMarkWatched = async (  ) => {
        console.log('owneruserid', ownerUser.id)
        await markTVWatch({ tvId : DBtvId, userId : ownerUser.id })
        refetchOwnerUser();
    }

    const handleMore = () => {
        router.push({
            pathname: "/moreInteractions",
            params: { DBtvId: String(DBtvId), tmdbId : tvId }, // Convert to string
        });
    }

    const handleWatchlist = async (  ) => {
        console.log('owneruserid', ownerUser.id)
        await markTVWatchlist({ tvId : DBtvId, userId : ownerUser.id })
        refetchOwnerUser();
    }



  return (
    <View className='bg-primary h-full flex  pt-0 gap-10 relative ' style={{}}>
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
                        <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyWatched ? 'none' : Colors.secondary }} >
                                { alreadyWatched ? <EyeOff size={20}  color={Colors.secondary} /> : <Eye size={20} color={Colors.primary} /> }
                            <Text className='text-primary font-pbold text-sm' style={{ color : alreadyWatched ? Colors.secondary : Colors.primary }}>{ alreadyWatched ? 'Remove from watched' : 'Mark as watched' }</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={handleWatchlist}>
                        <View    className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyInWatchlist ? 'none' : Colors.secondary }}>
                        { alreadyInWatchlist ? <ListChecks color={Colors.secondary} size={20} /> : <ListChecks color={Colors.primary} size={20} /> }
                            <Text className='text-primary font-pbold text-sm' style={{ color : alreadyInWatchlist ? Colors.secondary : Colors.primary }}>{ alreadyInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist' }</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity  >
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
                    <TouchableOpacity onPress={handleMore} >
                        <View    className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center'>
                            <Ellipsis  color={Colors.primary} size={20} />
                            {/* <Text className='text-primary font-pbold text-sm'>...</Text> */}
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
                <Text className='text-mainGray font-pcourier text-custom  '>{movie.overview}</Text>
                {videoId && (
                    <YoutubePlayer
                    style={{}}
                    height={200}
                    play={true}
                    videoId={videoId}
                    initialPlayerParams={{controls:0}}
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
                                <DialogueCard dialogue={item.dialogue}  refetch={refetchMentionsThreads} ></DialogueCard>
                            </TouchableOpacity>
                        )}
                        />
                  
            </View>



            <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200 ' style={{borderColor:Colors.mainGrayDark}}/>
              
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
                                <ThreadCard thread={item} refetch={ fetchData} ></ThreadCard>
                            </TouchableOpacity>
                        )}}
                    />
                    <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>
                    
            {/* <DiscussionThread threadsPress={threadsPress} threads={threads} refetch={refetchMentionsThreads}></DiscussionThread> */}
            {/* <Text className='text-mainGray font-pbold text-lg'>Similar Shows</Text>
            <View className="mb-10 h-96">
                <DiscoverHorizontal data={similarTitles} handlePress={handlePress}/>
            </View> */}

     
        </View>
    </ScrollView>
    </View>
  )
}

    TVPage.options = {
        tabBarStyle: { display: 'flex' }, // Makes the tab bar visible
        headerShown: false,  // Optional: Hide header if not needed
    }

export default TVPage