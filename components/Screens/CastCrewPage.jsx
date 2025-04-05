import {  ScrollView, Text, TouchableOpacity, View, RefreshControl, FlatList, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { BackIcon, DownIcon, CastCrewIcon } from '../../assets/icons/icons'
import { Colors } from '../../constants/Colors'
import { getPerson } from '../../api/tmdb'
import { useTMDB } from '../../lib/useTMDB'
import { LinearGradient } from 'expo-linear-gradient'
import DiscussionThread from '../DiscussionThread'
import CastCrewHorizontal from '../CastCrewHorizontal'
import { capitalize } from '../../lib/capitalize'
import DialogueCard from '../DialogueCard'
import { addCastToFav, useFetchCastMentions } from '../../api/castCrew'
import { fetchPersonFromDB } from '../../api/castCrew'
import { useQueryClient } from '@tanstack/react-query';
import ThreadCard from '../ThreadCard'
import { Eye, EyeOff, ListChecks, Handshake, Star, Ellipsis } from 'lucide-react-native'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../api/user'
import ToastMessage from '../ui/ToastMessage'



const CastIdPage = () => {

    const params = useLocalSearchParams();
    const castId = params.castId;
    const router = useRouter();
    const { user:clerkUser } = useUser()
    const { data:ownerUser } = useFetchOwnerUser({email : clerkUser.emailAddresses[0].emailAddress})
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const [creditOptions, setCreditOptions] = useState([])
    const [whichCredits, setWhichCredits] = useState('')
    const [readMore, setReadMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    // const {data:personData, loading, refetch} = useTMDB(()=>getPerson(castId));
    const [ loadingDB, setLoading] = useState(false)
    const queryClient = useQueryClient();
    const [personData, setPersonData] = useState(null)
    const [ mentions, setMentions ] = useState([])
    const [DBcast, setDBcast] = useState({})
    const [ toastMesage, setToastMessage ] = useState(null)
    const [ threads, setThreads ] = useState([])
    const [ alreadyFav, setAlreadyFav ] = useState(null)
    const [ favLength, setFavLength ] = useState(null)





    const fetchData = async () => {
        setLoading(true);    
        try {
            const fetchedPerson = await getPerson(castId);  // Pass movieId here
            setPersonData(fetchedPerson)
            // setMovie(personData);
            const credits = fetchedPerson.credits;
            if (fetchedPerson.combined_credits) {
                const dropdownOptions = Object.keys(fetchedPerson.combined_credits)
                .filter(key => {
                  const credits = fetchedPerson.combined_credits[key];
                  return (key === 'cast' && credits.length > 0) || (key === 'crew' && credits.length > 0)});
          
                setCreditOptions(dropdownOptions);
          
                // Safely set the initial value for whichCredits
                if (dropdownOptions.length > 0) {
                  setWhichCredits(dropdownOptions[0]);
                }
              }

              const castData = {
                tmdbId : fetchedPerson.id,
                name : fetchedPerson.name,
                dob : fetchedPerson.birthday,
                posterPath  : fetchedPerson.profile_path,
            }

            // const cachedCastFromDB = queryClient.getQueryData(['cast', castId]);
            // if (cachedCastFromDB){
            //     setThreads(cachedCastFromDB.threads)
            //     setMentions(cachedCastFromDB.mentions)
            //     const alreadyFavCheck = ownerUser.favCastCrew.some( item => item.castId === cachedCastFromDB.id )
            //     setAlreadyFav(alreadyFavCheck)
            // } else {
                // console.log('fetchedPerson', fetchedPerson)
                const castFromDB = await fetchPersonFromDB({castData})
                setDBcast(castFromDB)
                setFavLength(castFromDB.favCastCrew.length)
                const alreadyFavCheck = ownerUser.favCastCrew.some( item => item.castId === castFromDB.id )
                setAlreadyFav(alreadyFavCheck)
                // queryClient.setQueryData(['cast', castId]);
    
                setThreads( castFromDB.threads );
                setMentions(castFromDB.mentions)
                // queryClient.setQueryData(['threads', castId], castFromDB.threads);
            // }

            // const fetchedMentions = await getMovieMentions(movieId);
            // setMentions(fetchedMentions);
          
        } catch (err) {
            Alert.alert("Error", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (castId) {  // Only fetch if castId is available
            fetchData();
        }
    }, [castId]); 




    const handleAddToFav = async () => {

      
      const data = {
        userId : ownerUser.id,
        castId : DBcast.id
      }
      const newFav = await addCastToFav(data);
      setAlreadyFav(prev => !prev)
      setToastMessage(newFav.message)
      // fetchData()
    }

    const refreshData = () => {
        setRefreshing(true);
        refetch();
        setRefreshing(false)
    }



    const backPress = () => {
        router.back()
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
        router.push(`/threads/${id}?castId=${castId}`)
    }

    const handleMentionPress = (item) => {
        router.push(`/dialogue/${item.dialogueId}`)
    }



    const handleRecommendation = () => {
      router.push({
          pathname : '/recommendationModal',
          params: { DBcastId : DBcast.id }
      })
  }


    // const dynamicIcon = (button) => {
    //   if (button === 'addToFav'){
    //     return <CastCrewIcon size ={30} color={Colors.secondary} />
    //   }
    // }


    if (!personData) {

        return (
          <View className='w-full h-full bg-primary'>
        <ActivityIndicator></ActivityIndicator>
        </View>
        )
    }


  return (
    <SafeAreaView className='h-full pb-24 bg-primary'>
      <ToastMessage message={toastMesage} onComplete={()=>setToastMessage(null)} icon={<CastCrewIcon size ={30} color={Colors.secondary} />}   />
    <ScrollView 
     refreshControl={
        <RefreshControl
          tintColor={Colors.secondary}
          refreshing={refreshing}
          onRefresh={fetchData}
        />
         }

    
    className=' h-full  flex  ' style={{backgroundColor:Colors.primary}}>
      <TouchableOpacity className='border-white rounded-md w-16 flex items-center left-2 py-1 absolute   ' style={{}}   onPress={backPress}>
                      <BackIcon className='' color={Colors.mainGray}  size={22}/>
      </TouchableOpacity>
      <View className='gap-8 w-full px-6'>
        <View className='image-and-name items-center justify-center gap-5  w-full pt-20 '>
          <View className="px-8 flex-row items-center w-full justify-center">
            <Image className=''
              source={{uri:`${posterURL}${personData.profile_path}`}}
              placeholder={{uri:`${posterURLlow}${personData.profile_path}`}}
              placeholderContentFit='cover'
               style={{ width:100, height: 180, overflow:'hidden', borderRadius:10}}
                contentFit='cover'
              />
            <View className='name-bio items-start gap-0  text-wrap flex-wrap px-8 max-w-64  '>
              <Text className=' text-3xl text-secondary font-pbold'>{personData.name}</Text>
              <Text className=' text-sm text-mainGray font-medium '>{personData.birthday}</Text>
              <Text className=' text-sm text-mainGray font-medium '>{personData.place_of_birth}</Text>
              <Text className=' text-sm text-mainGray font-medium '>Known for: {personData.known_for_department}</Text>
            </View>
          </View>
        </View>
        
        <View className="buttons flex gap-4 w-full items-center mb-6">

          <TouchableOpacity onPress={() => handleAddToFav()}  >
              <View  className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center' style={{ backgroundColor: alreadyFav ? 'transparent' :  Colors.secondary }} >
                      <CastCrewIcon size={20}  color={alreadyFav ? Colors.secondary : Colors.primary} />
                  <Text className='text-primary font-pbold text-sm' style={{ color : alreadyFav ? Colors.secondary : Colors.primary }}>{ alreadyFav ? 'Remove from Fav Cast/Crew' : 'Add to Fav Cast/Crew' }</Text>
              </View>
          </TouchableOpacity>
         
          <TouchableOpacity onPress={handleRecommendation} >
              <View    className='border-2 rounded-3xl border-secondary bg-secondary p-2 w-96 items-center flex-row gap-3 justify-center'>
                  <Handshake color={Colors.primary} size={20} />
                  <Text className='text-primary font-pbold text-sm'>Recommend to friend</Text>
              </View>
          </TouchableOpacity>
         
          </View>


          <View style={{paddingBottom:70}} >
            <View className="bio relative gap-8 w-full" style={{  height:readMore ? 'auto' : 65 }}>
              <Text className=' text-sm text-mainGray w-full  ' numberOfLines={!readMore && 3} >{personData.biography} </Text>
              <LinearGradient className=''
                  colors={[`${Colors.primary}00`, `${Colors.primary}FF`]}
                  style={{height : readMore ? 'auto' :65, width:'100%', position:'absolute', top:0 }}>
                </LinearGradient>
                <View className="w-full px-20">
                  
                  <TouchableOpacity onPress={()=>setReadMore(prev => !prev)} className='w-full  items-center rounded-lg' style={{  paddingVertical:5, paddingHorizontal:10, borderWidth:2, borderColor:Colors.mainGray }}>
                      <Text className='text-mainGray'>{ readMore ? 'Collapse' : 'Read more'}</Text>
                  </TouchableOpacity>
                </View>
            </View>
          <View className='ratings  flex pt-20 gap-6 ' style={{marginTop:20, marginBottom:20}}>
            <View className='ratings flex-row justify-center items-center flex-wrap gap-8'>
                <View className='gap-0 items-center'>
                    <Text className='text-mainGray text-sm font-psemibold'>Favorites</Text>
                    <Text className='text-mainGray text-3xl font-pbold'>{favLength < 1 ? 'N/A' : favLength }</Text>
                </View>
                <View className='gap-0'>
                    <Text className='text-mainGray text-sm font-psemibold'>Mentions</Text>
                    <View className='flex-row items-center gap-2 justify-center'>
                        <Text className='text-mainGray text-3xl font-pbold'>{mentions.length < 1 ? 'N/A' : mentions.length}</Text>
                    </View>
                </View>
                <View className='gap-0'>
                    <Text className='text-mainGray text-sm font-psemibold'>Threads</Text>
                    <View className='flex-row items-center gap-2 justify-center'>
                        <Text className='text-mainGray text-3xl font-pbold'>{threads.length < 1 ? 'N/A' : threads.length}</Text>
                    </View>
                </View>
            </View>
          </View>
          <View>
          <View className='dropdown-menu relative flex gap-5 w-auto'>
            <View className='flex-row gap-2 justify-start items-center'>

                    <Text className='text-mainGray font-psemibold '>Credits as:  </Text>
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
                            <TouchableOpacity style={{ width:'auto' }} onPress={()=>{setWhichCredits(item);setDropdownMenu(false)}}>
                                <Text className='text-mainGray items-center justify-center' style={{width:300}}>
                                    {capitalize(item)}
                                </Text>
                            </TouchableOpacity>
                                <View style={{ borderTopWidth:1, marginTop:10, borderColor:Colors.mainGray, width:'320',  }}/>
                        </View>

                    )) }
                    </View>
                    </>
                )  }
                { whichCredits === 'cast' && (
                    <CastCrewHorizontal  param={ personData?.combined_credits.cast} handlePress={handlePress}/>
                ) }
                { whichCredits === 'crew' && (
                    <CastCrewHorizontal  param={ personData?.combined_credits.crew } handlePress={handlePress} />
                ) }
          </View>
          </View>

          <View className='w-full border-t-[1px] border-mainGrayDark  my-5 items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>
          <View className='w-full justify-center items-center gap-0'>
                <Text className='text-white font-pbold text-lg'>Mentions</Text>
                <FlatList
                    horizontal
                    data={mentions}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ gap:15, marginTop:10 }}
                    renderItem = {({item}) => (
                        <TouchableOpacity onPress={()=>handleMentionPress(item)}  style={{ width:300 }}>
                            <DialogueCard dialogue={item.dialogue} refetch={fetchData} isBackground={true}></DialogueCard>
                        </TouchableOpacity>
                    )}
                />
            </View>


            <View className='w-full border-t-[1px] border-mainGrayDark my-5 items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGrayDark}}/>
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
                                <ThreadCard thread={item} refetch={ fetchData} ></ThreadCard>
                            </TouchableOpacity>
                        )}}
                    />
            <View className='w-full border-t-[1px] border-mainGrayDark items-center self-center shadow-md shadow-black-200 my-5' style={{borderColor:Colors.mainGrayDark}}/>

          </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default CastIdPage


CastIdPage.options = {
    headerShown: false,  // Optional: Hide header if not needed
  };