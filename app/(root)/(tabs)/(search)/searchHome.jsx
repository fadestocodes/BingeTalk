import { StyleSheet, Text, View, ScrollView, FlatList,TextInput, TouchableOpacity, Keyboard, RefreshControl, Touchable, Animated, Dimensions , useWindowDimensions} from 'react-native'
import { Image } from 'expo-image'
import React, {useEffect, useState, useRef} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { feed } from '../../../../lib/fakeData'
import { RepostIcon, UpIcon, DownIcon, PersonIcon, FilmIcon, TVIcon, ArrowLeftIcon, CloseIcon, BackIcon, LayersIcon } from '../../../../assets/icons/icons'
import { Colors } from '../../../../constants/Colors'
import { searchAll, getTrending, getUpcoming, getTrendingPeople, getDiscoverTV, getTrendingTV, getTrendingMovie } from '../../../../api/tmdb'
import debounce from 'lodash.debounce';
import { useRouter } from 'expo-router'
import { getYear } from '../../../../lib/formatDate'
import DiscoverHorizontal from '../../../../components/DiscoverHorizontal'
import { findUniqueRotations, searchUsers } from '../../../../api/user'
import { useQueryClient } from '@tanstack/react-query';
import { ChevronRight, MessagesSquare, MessageSquare, Popcorn, Dna, Utensils, Fingerprint } from 'lucide-react-native'
import { getRecentDialogues, getTrendingDialogues, useGetRecentDialoguesInfinite } from '../../../../api/dialogue'
import DialogueCard from '../../../../components/DialogueCard'
import { useFetchTrailers } from '../../../../api/trailer'
import YoutubeCard from '../../../../components/YoutubeCard'
import {  IOScrollView, IOScrollViewController,InView, } from 'react-native-intersection-observer';
import { avatarFallback } from '../../../../lib/fallbackImages'
import ProfileCard from '../../../../components/ProfileCard'
import { avatarFallbackCustom } from '../../../../constants/Images'
import { fetchTrendingReviews } from '../../../../api/review'
import ReviewCard from '../../../../components/Screens/ReviewCard'
import { NotebookPen } from 'lucide-react-native'




const SearchPage = () => {

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([])
  const [ inFocus, setInFocus ] = useState(false);
  const [ discoverPage , setDiscoverPage ] = useState(true);
  const [refreshing, setRefreshing] = useState(false)
  const [explore, setExplore] = useState(false);
  const posterURL = 'https://image.tmdb.org/t/p/original';
  const posterURLlow = 'https://image.tmdb.org/t/p/w500';
  const router = useRouter();
  const [ flatListCategories, setFlatListCategories ] = useState({
    trending : [],
    airingToday : [],
    upcomingMovies : [],
    trendingPeople : [],
    nowPlaying : [],
    trendingTV :[],
    trendingMovie : [],
    trendingReviews : []
  })
  const [ searchingFor, setSearchingFor ] = useState('users')
  const [ trendingDialogues, setTrendingDialogues ] = useState(null)

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const [ videosInView, setVideosInView ] = useState(false)

  const { trailers, isLoading: isLoadingTrailers} = useFetchTrailers()

  const scrollX = useRef(new Animated.Value(0)).current;


  const { width } = Dimensions.get("window");
  const ITEM_WIDTH = width * 0.9; // 90% width for card
  const SPACING = 15; // Gap between cards
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / (ITEM_WIDTH + SPACING));
        console.log('INDEXRIGHTNOW', index)
        setCurrentIndex(index);
      },
    }
  );


  const handleChange = (text) => {
    setQuery(text)
    handleSearch(text);
  }

  const handleSearch = debounce( async (text) => {
    if (text.length > 1) {
      try {
        if ( searchingFor === 'users' ) {
          const response = await searchUsers(text);
          setResults(response.users);
        } else if (searchingFor==='titles') {
          const response = await searchAll(text);
          // console.log('response is ', response)
  
          setResults(response.results);
        }
        // console.log(results)
      } catch (err) {
        console.log(err)
      }
    }
  }, 300)

  const handleTabChange = async (type) => {
    setResults([])
    setSearchingFor(type)
    try {
      if ( type === 'users' ) {
        const response = await searchUsers(query);
        setResults(response.users);
      } else if (type==='titles') {
        const response = await searchAll(query);
        setResults(response.results);
      }
    } catch (err) {
      console.log(err)
    }
  }

  // useEffect(()=>{
  //   if (query){
  //     setDiscoverPage(false)
  //   } else {
  //     setDiscoverPage(true)
  //   }
  // },[query])

  const refreshData = async () => {
    setRefreshing(true)
    try {
      const [trendingData, upcomingData, trendingTVData, trendingMovieData] = await Promise.all([
        getTrending(),
        getUpcoming(),
        getTrendingTV(),
        getTrendingMovie()
      ]);
      setFlatListCategories({
        trending : trendingData.results,
        upcomingMovies : upcomingData.results,
        trendingTV : trendingTVData.results,
        trendingMovie : trendingMovieData.results

      }) 
      const trendingDialoguesResponse = await getRecentDialogues(5);
      setTrendingDialogues(trendingDialoguesResponse);
    } catch (err) {
      console.log('Error fetching all categories',err)
    } finally{
      setRefreshing(false)
    }
  }

  useEffect(()=>{
    const fetchCategories = async () => {
      try {
        const [trendingTVData, trendingMovieData, trendingReviewData] = await Promise.all([
        
          getTrendingTV(),
          getTrendingMovie(),
          fetchTrendingReviews()
        ]);
        setFlatListCategories({
         
          trendingTV: trendingTVData.results,
          trendingMovie : trendingMovieData.results,
          trendingReviews : trendingReviewData

        }) 
        const trendingDialoguesResponse = await getRecentDialogues(5);
        setTrendingDialogues(trendingDialoguesResponse);

        

      } catch (err) {
        console.log('Error fetching all categories',err)
      }
    }
    fetchCategories();
  }, [])


  const handlePress = (item) => {
    if (item.media_type === 'movie'  ){
      router.push(`/movie/${item.id}`)
    } else if (item.media_type === 'person') {
      router.push(`/cast/${item.id}`)
    } else if (item.media_type === 'tv') {
      router.push(`/tv/${item.id}`)
    } else if ( item.firstName ){
      router.push(`(search)/user/${item.id}`)
    }
  }


  const handlePressMovie = (item) => {
      router.push(`/movie/${item.id}`)
  }
  const handlePressTV = (item) => {
      router.push(`/tv/${item.id}`)
  }

  const handlePressCast = (item) => {
    router.push(`/cast/${item.id}`)
  }


  const handleDialoguePress = (item) => {
    router.push(`/dialogue/${item.id}`)
  }

  const handleThreadPress = (item) => {
    router.push(`/threads/${item.id}`)
  }

  const handleProfileCard = (item) => {
    router.push(`/user/${item.id}`)
  }


  return (

    <SafeAreaView className='flex justify-start items-center w-full h-full bg-primary  pt-3 px-5 relative' >
      
      <View className='justify-center items-center'>
      <View className=' flex-row gap-4  w-full px-8 justify-center items-center relative'>
        { inFocus && ( 
          <>
           
            <TouchableOpacity className='items-center justify-center' onPress={()=> {setInFocus(false); Keyboard.dismiss(); setDiscoverPage(true)}}>
              <BackIcon size={22} color={Colors.mainGray} className='justify-center items-center pb-8 '/>
            </TouchableOpacity>
            
          </>
        ) }
        <View className='relative justify-center w-full items-center'>
          <TextInput onChangeText={handleChange} onFocus={()=>{setInFocus(true); setDiscoverPage(false)}}
            placeholder='Search...' placeholderTextColor={Colors.mainGray} value={query} autoCorrect={false}
            className=' w-full rounded-full h-14 pl-8 pr-14 mb-8 '
            style={{ backgroundColor:Colors.mainGrayDark, color:'white' }}
          
          >
          </TextInput>
          <TouchableOpacity onPress={()=>setQuery('')} className='absolute right-4 top-4'>
            <CloseIcon size={24} color={Colors.mainGrayLight}></CloseIcon>
          </TouchableOpacity>

        </View>
      </View>
      { inFocus && (
              <View className='flex-row gap-3 justify-center items-center mb-3' style={{ borderRadius:10, paddingHorizontal:15, paddingVertical:10, backgroundColor:Colors.mainGrayDark, width:'auto' }}>
                <TouchableOpacity onPress={()=>handleTabChange('users')}  style={{ padding:5, borderRadius:5, backgroundColor: searchingFor === 'users' ? 'white' : null }} >
                  <Text className=' font-pbold' style={{ color : searchingFor === 'users' ? Colors.primary : Colors.mainGray }}>Users</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={()=>handleTabChange('titles')} style={{ padding:5, borderRadius:5, backgroundColor: searchingFor === 'titles' ? 'white' : null }} >
                <Text className='font-pbold' style={{ color : searchingFor === 'titles' ? Colors.primary : Colors.mainGray }} >Title/Cast/Crew</Text>
                </TouchableOpacity>
              </View>

      ) }
      </View>
        { !discoverPage ? (
          
      <FlatList
        data = {results}
        scrollEnabled={ !discoverPage ? true : false }
        style ={{ width:'100%'}}
        contentContainerStyle={{paddingBottom:0}}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          return (
          <>
          <View className=' w-full   '>
            <TouchableOpacity onPress={()=>handlePress(item)} className='w-full gap-5 flex-row my-3 justify-start items-center'>
              <Image 
                source={  searchingFor === 'users' ? { uri:item.profilePic || avatarFallbackCustom} : item.media_type === 'person' ? {uri:`${posterURL}${item.profile_path}`}  : {uri:`${posterURL}${item.poster_path}`}}
                placeholder={  searchingFor === 'users' ? { uri:item.profilePic || avatarFallbackCustom} : item.media_type === 'person' ? {uri:`${posterURLlow}${item.profile_path}`}  : {uri:`${posterURLlow}${item.poster_path}`}}
                placeholderContentFit='cover'
                contentFit='cover'
                style={{ width:50, height: searchingFor === 'users' ? 50 : 75, borderRadius: searchingFor === 'users' ? 50 : 10, overflow:'hidden' }}
              />
              <View className='flex flex-1 w-full justify-center pr-0'>
                <View className='flex-row gap-2 flex-1 justify-center items-center'>
                  { searchingFor === 'users' ?  null :  item.media_type === 'person' ? <PersonIcon size={18} color={Colors.secondary} /> : item.media_type === 'movie' ? <FilmIcon size={18} color={Colors.secondary}/> : <TVIcon size={18} color={Colors.secondary}/>}
                  <Text   style={{ flex: 1, flexWrap: 'wrap' }} className='text-mainGray   pr-3 font-pbold'>{ searchingFor === 'users' ? `${item.firstName} ${item.lastName}`  :  item.media_type === 'movie' ? item.title : item.name }</Text>

                </View>
                <Text   style={{ flex: 1, flexWrap: 'wrap' }} className='text-mainGray text-sm  pr-3 font-pmedium'>{ searchingFor === 'users' ? `@${item.username}` : item.media_type === 'person' 
                ? `Known for ${item.known_for_department}` : item.media_type === 'movie' ? `Released ${getYear(item.release_date)}` 
                : `First aired ${getYear(item.first_air_date)}` }</Text>
              </View>
            </TouchableOpacity>
          </View>
            </>
        )}}
      >

      </FlatList>
        ) : (
          
          <IOScrollView
          refreshControl={
            <RefreshControl
              tintColor={Colors.secondary}
              refreshing={refreshing}
              onRefresh={refreshData}
            />
          }
          showsVerticalScrollIndicator={false}
          scrollEnabled={ !discoverPage ? false : true }
          style={{ height:'100%'}}

         
          scrollEventThrottle={16}

        >
          <View className='flex gap-6 w-full h-full'>
            
            <View className='gap-3 flex items-start w-full' style={{height:200}} >
              <TouchableOpacity onPress={()=> { router.push('/movie/discover') }} style={{ flexDirection:'row' , gap:5, justifyContent:'center', alignItems:'center'}}>
                <FilmIcon  size={20} color={Colors.mainGray}/>
                <Text className='text-mainGray font-pbold text-xl '>Trending Movies</Text>
                <ChevronRight strokeWidth={3} size={20} color={Colors.mainGray} />
              </TouchableOpacity>
                <DiscoverHorizontal data={flatListCategories.trendingMovie} handlePress={handlePressMovie} />
            </View>
            <View className='gap-3 flex items-start w-full' style={{height:200}} >
              <TouchableOpacity onPress={()=>{router.push('/tv/discover')}} style={{ flexDirection:'row' , gap:5, justifyContent:'center', alignItems:'center'}}>
                  <TVIcon   size={20} color={Colors.mainGray}/>
                  <Text className='text-mainGray font-pbold text-xl '>Trending TV</Text>
                  <ChevronRight strokeWidth={3} size={20} color={Colors.mainGray} />
              </TouchableOpacity>
                <DiscoverHorizontal data={flatListCategories.trendingTV} handlePress={handlePressTV} />
            </View>
            <View className='gap-3 flex items-start w-full'  >
              <TouchableOpacity  onPress={()=>{router.push('/dialogue/discover')}}  style={{ flexDirection:'row' , gap:5, justifyContent:'center', alignItems:'center'}}>
                  <MessageSquare   size={20} color={Colors.mainGray}/>
                  <Text className='text-mainGray font-pbold text-xl '>Recent Dialogues</Text>
                  <ChevronRight strokeWidth={3} size={20} color={Colors.mainGray} />
              </TouchableOpacity>
                <FlatList
                  data={trendingDialogues}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item.id}
                  contentContainerStyle={{gap:15}}
                  renderItem={({item}) => {
                      // console.log('trending dialogue', item)
                    return (
                      <TouchableOpacity onPress={()=>handleDialoguePress(item)} style={{width:300}}>
                        <DialogueCard  dialogue={item} isBackground={true} fromSearchHome={true} />
                      </TouchableOpacity>
                  )}}
                
                />
            </View>
            <InView className='gap-3 flex items-start w-full h-[260px] overflow-hidden'  
              style={{ height: 260, overflow: "hidden" }}
              onChange={(inView) => {console.log('Inview:', inView); setVideosInView(inView)}}
            >
              <TouchableOpacity disabled style={{ flexDirection:'row' , gap:5, justifyContent:'center', alignItems:'center'}}>
                  <Popcorn   size={20} color={Colors.mainGray}/>
                  <Text className='text-mainGray font-pbold text-xl '>Recent Trailers</Text>
                  {/* <ChevronRight strokeWidth={3} size={20} color={Colors.mainGray} /> */}
              </TouchableOpacity>
                <FlatList
                  data={trailers}
                  horizontal
                  // pagingEnabled
                  onScrollBeginDrag={() => setIsScrolling(true)}
                  onScrollEndDrag={() => setIsScrolling(false)}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id.videoId}
                  nestedScrollEnabled={false}  // Optional: prevent nested scrolls
                  style={{height:400}}
                  contentContainerStyle={{gap:15, overflow:"hidden", height:220}}
                  renderItem={({item, index}) => {
                      // console.log('trending thread', item)
                    return (
                        <YoutubeCard item={item} index={index} currentIndex={currentIndex} isScrolling={isScrolling} videosInView={videosInView} />
                  )}}

                  onScroll={onScroll}
                  scrollEventThrottle={16}
                />
            </InView>

            <View className='gap-3'>
              <TouchableOpacity className='gap-2 items-center justify-start flex flex-row'>
                  <NotebookPen size={20} color={Colors.mainGray}/>
                  <Text className='text-mainGray font-pbold text-xl'>Recent Reviews</Text>
              </TouchableOpacity>
              <FlatList
                data={flatListCategories.trendingReviews}
                horizontal
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap:15}}

                renderItem={({item}) => (
                  <View className='w-[300px] '>
                  <TouchableOpacity style-={{}}className='w-full' >
                    <ReviewCard review={item}   isBackground={true} cardStyle={true}/>
                  </TouchableOpacity>
                  
                  </View>
                )}
              />
            </View>
          </View>
        </IOScrollView>
        ) }
    </SafeAreaView>
  )
}

export default SearchPage
