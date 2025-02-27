import { StyleSheet, Text, View, Image, ScrollView, FlatList,TextInput, TouchableOpacity, Keyboard, RefreshControl } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { feed } from '../../../../lib/fakeData'
import { RepostIcon, UpIcon, DownIcon, PersonIcon, FilmIcon, TVIcon, ArrowLeftIcon, CloseIcon, BackIcon, LayersIcon } from '../../../../assets/icons/icons'
import { Colors } from '../../../../constants/Colors'
import { searchAll, getTrending, getUpcoming, getTrendingPeople, getDiscoverTV } from '../../../../api/tmdb'
import debounce from 'lodash.debounce';
import { useRouter } from 'expo-router'
import { getYear } from '../../../../lib/formatDate'
import DiscoverHorizontal from '../../../../components/DiscoverHorizontal'
import { searchUsers } from '../../../../api/user'
import { useQueryClient } from '@tanstack/react-query';



const SearchPage = () => {

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([])
  const [ inFocus, setInFocus ] = useState(false);
  const [ discoverPage , setDiscoverPage ] = useState(true);
  const [refreshing, setRefreshing] = useState(false)
  const [explore, setExplore] = useState(false);
  const posterURL = 'https://image.tmdb.org/t/p/original';
  const router = useRouter();
  const [ flatListCategories, setFlatListCategories ] = useState({
    trending : [],
    airingToday : [],
    upcomingMovies : [],
    trendingPeople : [],
    nowPlaying : [],
    discoverTV : []
  })
  const [ searchingFor, setSearchingFor ] = useState('users')

  // const queryClient = useQueryClient();
  // useEffect(()=>{
  //   queryClient.invalidateQueries(['user'])
  //   const cachedUsers = queryClient.getQueryData(['user']);
  //   console.log('Cached users data:', cachedUsers);
  // },[query])

  const handleChange = (text) => {
    setQuery(text)
    handleSearch(text);
  }

  const handleSearch = debounce( async (text) => {
    if (text.length > 2) {
      try {
        if ( searchingFor === 'users' ) {
          const response = await searchUsers(text);
          console.log('response', response)
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

  // useEffect(()=>{
  //   if (query){
  //     setDiscoverPage(false)
  //   } else {
  //     setDiscoverPage(true)
  //   }
  // },[query])

  refreshData = async () => {
    setRefreshing(true)
    try {
      const [trendingData, upcomingData, trendingPeopleData, discoverTVData] = await Promise.all([
        getTrending(),
        getUpcoming(),
        getTrendingPeople(),
        getDiscoverTV()
      ]);
      setFlatListCategories({
        trending : trendingData.results,
        upcomingMovies : upcomingData.results,
        trendingPeople : trendingPeopleData.results,
        discoverTV : discoverTVData.results
      }) 
    } catch (err) {
      console.log('Error fetching all categories',err)
    } finally{
      setRefreshing(false)
    }
  }

  useEffect(()=>{
    const fetchCategories = async () => {
      try {
        const [trendingData, upcomingData, trendingPeopleData, discoverTVData] = await Promise.all([
          getTrending(),
          getUpcoming(),
          getTrendingPeople(),
          getDiscoverTV()
        ]);
        setFlatListCategories({
          trending : trendingData.results,
          upcomingMovies : upcomingData.results,
          trendingPeople : trendingPeopleData.results,
          discoverTV : discoverTVData.results
        }) 
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

  const exploreRoute = () => {
    router.push(`/explore/explorePage`)
  }



  return (
    <SafeAreaView className='flex flex-1 justify-start items-center w-full h-full bg-primary pb-24 pt-10 px-5' >
      <TouchableOpacity onPress={exploreRoute} className='explore-mode  absolute w-10 h-10  top-16 right-2'><LayersIcon  color={Colors.mainGray} size={24}/></TouchableOpacity> 
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
                <TouchableOpacity onPress={()=>{setSearchingFor('users'); setResults([]); setQuery('')}}  style={{ padding:5, borderRadius:5, backgroundColor: searchingFor === 'users' ? 'white' : null }} >
                  <Text className=' font-pbold' style={{ color : searchingFor === 'users' ? Colors.primary : Colors.mainGray }}>Users</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={()=>{setSearchingFor('titles'); setResults([]); setQuery('')}} style={{ padding:5, borderRadius:5, backgroundColor: searchingFor === 'titles' ? 'white' : null }} >
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
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
          return (
          <>
          <View className=' w-full   '>
            <TouchableOpacity onPress={()=>handlePress(item)} className='w-full gap-5 flex-row my-3 justify-start items-center'>
              <Image 
                source={  searchingFor === 'users' ? { uri:item.profilePic } : item.media_type === 'person' ? {uri:`${posterURL}${item.profile_path}`}  : {uri:`${posterURL}${item.poster_path}`}}
                resizeMode='cover'
                style={{ width:50, height:75, borderRadius:10, overflow:'hidden' }}
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
            <View style={{ borderTopWidth: .5, borderColor:Colors.mainGray }} />
            </>
        )}}
      >

      </FlatList>
        ) : (
         
          <ScrollView
          refreshControl={
            <RefreshControl
              tintColor={Colors.secondary}
              refreshing={refreshing}
              onRefresh={refreshData}
            />
          }
  
          scrollEnabled={ !discoverPage ? false : true }
        >
          <View className='flex gap-6'>
            
            <View className='gap-3 flex' style={{height:200}} >
              <Text className='text-mainGray font-pbold text-lg'>Trending Movies</Text>
                <DiscoverHorizontal data={flatListCategories.upcomingMovies} handlePress={handlePressMovie} />
            </View>
            <View className='gap-3 flex' style={{height:200}} >
              <Text className='text-mainGray font-pbold text-lg'>Trending TV</Text>
                <DiscoverHorizontal data={flatListCategories.discoverTV} handlePress={handlePressTV} />
            </View>
            {/* <View className='gap-3 flex' style={{height:200}} >
              <Text className='text-mainGray font-pbold text-lg'>Trending People</Text>
                <DiscoverHorizontal data={flatListCategories.trendingPeople} handlePress={handlePressCast} />
            </View> */}
          </View>
        </ScrollView>
        ) }
    </SafeAreaView>
  )
}

export default SearchPage
