// import {  Text, View, Image, ScrollView, Dimensions } from 'react-native'
// import React, { useEffect, useState, useRef } from 'react'
// import { useRouter, useSearchParams } from 'expo-router/build/hooks'
// import { useLocalSearchParams } from 'expo-router/build/hooks'
// import {useTMDB} from '@/lib/useTMDB'
// import {GetMovieById} from '@/lib/TMDB'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import {BackIcon, DownIcon} from '../../../../../assets/icons/icons'
// import { TouchableOpacity } from 'react-native'
// import {Colors} from '../../../../../constants/Colors'
// import { LinearGradient } from 'expo-linear-gradient'
// import { ImageBackground } from 'react-native'
// import { getTrailer } from '../../../../../lib/TMDB'
// import { useVideoPlayer, VideoView, useEvent } from 'expo-video';
// import YoutubePlayer from 'react-native-youtube-iframe';
// import { WebView } from 'react-native-webview';
// import { getCredits } from '../../../../../lib/TMDB';
// import CastCrewHorizontal from '../../../../../components/CastCrewHorizontal'
// import DiscussionThread from '../../../../../components/DiscussionThread'
// import { capitalize } from '../../../../../lib/capitalize'
// import { useRoute } from '@react-navigation/native'




// const MoviePage = () => {
//     const params = useLocalSearchParams();
//     const movieId = params.movieId
//     const posterURL = 'https://image.tmdb.org/t/p/original';
//     const router = useRouter();


//     // const { data: movie, refetch } = useTMDB(()=>GetMovieById(movieId));
//     const [movie, setMovie] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const youtubeURL = 'https://www.youtube.com/watch?v='
//     const [videoId, setVideoId] = useState(null)
//     const [isPlayerReady, setIsPlayerReady] = useState(false);
//     const [isVisible, setIsVisible] = useState(false);
//     const playerRef = useRef(null);
//     const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&mute=1&showinfo=0&rel=0&controls=1&loop=1`;
//     const [creditsList, setCreditsList] = useState({});
//     const [ fullCredits, setFullCredits ] = useState({
//         castList : [],
//         crewList : [],
//     })
//     const [whichCredits, setWhichCredits] = useState('Cast');
//     const [dropdownMenu, setDropdownMenu] = useState(false);

//     const fetchData = async () => {
//         setLoading(true);  
//         try {
//             const res = await GetMovieById(movieId);  // Pass movieId here
//             setMovie(res);
//         } catch (err) {
//             console.log('Problem fetching data', err);
//             Alert.alert("Error", err.message);
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     const fetchVideos = async () => {
//         setLoading(true);
//         try {
//             const res = await getTrailer({movieId});  
//             // console.log('response getting trailer', res);
//             const trailer = res?.results.find(item => item.type === 'Trailer' && item.site === 'YouTube').key ;
//             if (trailer) {
//                 setVideoId(trailer)
//             }

//         } catch (err) {
//             console.log('Problem fetching data', err);
//             Alert.alert("Error", err.message);
//         } finally {
//             setLoading(false);
//         }
//     }

//     const fetchCredits = async () => {
//         setLoading(true);
//         try {
//             const credits = await getCredits({movieId});  
            
//             if (credits) {
//                 // console.log('found a trailer', credits)
//                 setCreditsList(credits);
//                 const castCredits = credits.cast;
//                 const crewCredits = credits.crew;
//                 setFullCredits(prevData => ({
//                     ...prevData,
//                     castList : castCredits,
//                     crewList : crewCredits,
//                 }))
//             }

//         } catch (err) {
//             console.log('Problem fetching data', err);
//             Alert.alert("Error", err.message);
//         } finally {
//             setLoading(false);
//         }
//     }
    
//     useEffect(() => {
//         if (movieId) {  // Only fetch if movieId is available
//             fetchData();
//             fetchVideos();
//             fetchCredits();
//         }
//     }, [movieId]); 

//     const handlePlayerReady = () => {
//         setIsPlayerReady(true);
//       };
    
//     const handleVisibilityChange = (isVisible) => {
//     setIsVisible(isVisible);
//     };
    
//     const handleLayout = (e) => {
//         const { height } = e.nativeEvent.layout;
//         setIsVisible(height > 220);  // Assume visible if height is greater than 0
//     };

//     // useEffect(() => {
//     // if (isVisible && isPlayerReady) {
//     //     playerRef.current.playVideo();
//     // }
//     // }, [isVisible, isPlayerReady]);


//     const backPress = () => {
//       router.back();
//     }

//     const creditOptions = [
//         'Cast',
//         'Crew',
//     ]

//     const handleDropdownPress = (item) => {
//         setWhichCredits(item);
//         setDropdownMenu(false);
//     }

//     const castPress = (item) => {
//         if (item.poster_path){  
//             router.push(`/movie/${item.id}`)
//         } else {
//             router.push(`/cast/${item.id}`)
//         }
//     }

//     const threadsPress = (item) => {
//         router.push(`/threads/${item.id}`)
//     }

    





//   return (
//     <ScrollView className='bg-primary h-full flex  pt-0 gap-10 relative ' style={{}}>
//         <View className="flex ">
//             <ImageBackground
//                 style={{width : '100%', height: 300, marginBottom:40, position:'absolute' }}
//                 source={{uri : `${posterURL}${movie?.backdrop_path}`}}
//                 resizeMethod='cover'
            
//                 >
//                 <LinearGradient
//                     colors={[ 'transparent',Colors.primary]}
//                     style={{height : '100%', width : '100%'}}>
//                 </LinearGradient>
//                 <TouchableOpacity className='border-white rounded-md w-16 flex items-center px-3 py-1 absolute top-20 left-4'   onPress={backPress}>
//                         <BackIcon className='' color={Colors.third}  size='22'/>
//                 </TouchableOpacity>
//             </ImageBackground>
//         </View>
//         <View className='beside-poster w-full  items-center flex-row justify-center gap-6 mb-8 ' style={{paddingTop:150}}>
//             <Image 
//                 source={{uri : `${posterURL}${movie.poster_path}`}}
//                 style={{ width:100, height: 180, overflow:'hidden', borderRadius:10}}
//                 resizeMode='cover'
//             />
//             <View className='  flex items-start w-52 gap-3' style={{marginBottom:0}}>
//                 <View className=' flex gap-2'>
                    
//                     <Text className='text-third text-2xl font-pbold'>{movie.title}</Text>
//                     <Text className='text-mainGray text-sm font-pmedium'>Released {movie.release_date}</Text>
//                 </View>
                
                
//             </View>
            
//         </View>
//         <View className="buttons flex gap-4 w-full items-center mb-6">
//                     <TouchableOpacity>
//                         <View className='border-2 rounded-xl border-secondary bg-secondary p-2 w-96 items-center'>
//                             <Text className='text-primary font-pbold text-sm'>Mark as Watched</Text>
//                         </View>
//                     </TouchableOpacity>
//                     <TouchableOpacity>
//                         <View className='border-2 rounded-xl border-secondary bg-secondary p-2 w-96 items-center'>
//                             <Text className='text-primary font-pbold text-sm'>Add to Watchlist</Text>
//                         </View>
//                     </TouchableOpacity>
//                     <TouchableOpacity>
//                         <View className='border-2 rounded-xl border-secondary bg-secondary p-2 w-96 items-center'>
//                             <Text className='text-primary font-pbold text-sm'>Recommend to friend</Text>
//                         </View>
//                     </TouchableOpacity>
//                     <TouchableOpacity>
//                         <View className='border-2 rounded-xl border-secondary bg-secondary p-2 w-96 items-center'>
//                             <Text className='text-primary font-pbold text-sm'>Rate</Text>
//                         </View>
//                     </TouchableOpacity>
//         </View>
//         <View className='genre-badges flex-row gap-3 flex-wrap px-6 w-full items-center justify-center ' >
//                         <TouchableOpacity>
//                             <Text className='text-mainGray text-xs border-[1px] rounded-md p-1' style={{borderColor:Colors.mainGray}}>Film</Text>
                          
//                         </TouchableOpacity>
//                             { movie.genres &&  movie.genres.map((genre, index) => (

//                                 <View key={index} className='flex-row'>
//                                     <TouchableOpacity>
//                                         <Text className='text-mainGray text-xs border-[1px] rounded-md p-1' style={{borderColor:Colors.mainGray}}>
//                                             { genre.name }
//                                         </Text>
//                                     </TouchableOpacity>
//                                 </View>    
//                             )) }
//         </View>
//         <View className='main-wrapper px-6 flex pt-220 gap-6 ' style={{marginTop:20, marginBottom:200}}>
//             <View className='ratings flex-row justify-center items-center flex-wrap gap-8'>
//                 <View className='gap-0 items-center'>
//                     <Text className='text-mainGray text-sm font-psemibold'>Your rating</Text>
//                     <Text className='text-mainGray text-2xl font-pbold'>N/A</Text>
//                 </View>
//                 <View className='gap-0'>
//                     <Text className='text-mainGray text-sm font-psemibold'>From your network</Text>
//                     <View className='flex-row items-center gap-2 justify-center'>
//                         <Text className='text-mainGray text-2xl font-pbold'>8.1</Text>
//                         <Text className='text-mainGray text-xs font-pbold'>(avg)</Text>
//                     </View>
//                 </View>
//                 <View className='gap-0'>
//                     <Text className='text-mainGray text-sm font-psemibold'>From others</Text>
//                     <View className='flex-row items-center gap-2 justify-center'>
//                         <Text className='text-mainGray text-2xl font-pbold'>7.3</Text>
//                         <Text className='text-mainGray text-xs font-pbold'>(avg)</Text>
//                     </View>
//                 </View>
                
//             </View>
//             <View className=' gap-5'>
//                 <Text className='text-mainGray font-pcourier text-lg uppercase  text-center underline '>Logline</Text>
//                 <Text className='text-mainGray font-pcourier  '>{movie.overview}</Text>
//                 {videoId && (
//                     <YoutubePlayer
//                     style={{}}
//                     height={200}
//                     play={true}
//                     videoId={videoId}
//                     initialPlayerParams={{controls:0}}
//                     mute={true}
//                     viewContainerStyle={{borderRadius:25, overflow:'hidden'}}
//                     webViewProps={{borderRadius:25, overflow:'hidden'}}
//                     />
//                 )}
//             </View>
//             <View className='dropdown-menu relative flex gap-5 w-auto'>
//             <View className='flex-row gap-2 justify-start items-center'>

//                 <Text className='text-mainGray font-psemibold '>Credits:  </Text>
//                 <TouchableOpacity onPress={()=>setDropdownMenu(prevData => !prevData)} className='justify-start items-center' style={{borderRadius:10, borderWidth:2, backgroundColor:Colors.mainGray, borderColor:Colors.mainGray, paddingHorizontal:5, paddingVertical:2, flexDirection:'row', gap:5, alignSelf:'flex-start'}}>
//                 <Text className='text-primary font-psemibold '>{capitalize(whichCredits)}</Text>
//                 <DownIcon color={Colors.primary} size={15}></DownIcon>
//                 </TouchableOpacity>
//                 </View>

//                 { dropdownMenu && (
//                     <>
//                     <View style={{marginBottom:30, borderWidth:2, borderColor:Colors.mainGray, paddingHorizontal:10, paddingVertical:20, justifyContent:'center', alignItems:'', gap:10, borderRadius:10}}>
//                     {creditOptions.map((item,index) => (
//                         <View key={index} style={{ display:'flex', justifyContent:'center',  marginTop:0, marginBottom:0}}>
//                             <TouchableOpacity style={{ width:'auto' }} onPress={()=>handleDropdownPress(item)}>
//                                 <Text className='text-mainGray items-center justify-center' style={{width:300}}>
//                                     {item}
//                                 </Text>
//                             </TouchableOpacity>
//                                 <View style={{ borderTopWidth:1, marginTop:10, borderColor:Colors.mainGray, width:'320',  }}/>
//                         </View>

//                     )) }
//                     </View>
//                     </>
//                 )  }
//                 { whichCredits === 'Cast' && (
//                     <CastCrewHorizontal  param={ fullCredits.castList} handlePress={castPress}/>
//                 ) }
//                 { whichCredits === 'Crew' && (
//                     <CastCrewHorizontal  param={ fullCredits.crewList } handlePress={castPress} />
//                 ) }
//             </View>
//             <View className='w-full border-t-[.5px] border-mainGray items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGray}}/>
//             <DiscussionThread handlePress={threadsPress}></DiscussionThread>
//             <View>
     
//     </View>
//         </View>
//     </ScrollView>
//   )
// }

//     MoviePage.options = {
//         tabBarStyle: { display: 'flex' }, // Makes the tab bar visible
//         headerShown: false,  // Optional: Hide header if not needed
//     }

// export default MoviePage

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MoviePage from '../../../../../components/Screens/MoviePage'

const movieId = () => {
  return (
  <MoviePage></MoviePage>
  )
}

export default movieId

const styles = StyleSheet.create({})