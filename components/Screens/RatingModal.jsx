import { StyleSheet, Text, View , ImageBackground, ScrollView, ActivityIndicator, TouchableOpacity,FlatList, TextInput} from 'react-native'
import { Image } from 'expo-image'
import React, {useState, useEffect} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import RatingUI from '../RatingUI'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useFetchMovieFromDB, useGetMovieFromDB } from '../../api/movie'
import { useFetchTVFromDB, useGetTVFromDB } from '../../api/tv'
import { Colors } from '../../constants/Colors'
import { getYear } from '../../lib/formatDate'
import { createRating } from '../../api/rating'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../api/user'
import ToastMessage from '../../components/ui/ToastMessage'
import { Star } from 'lucide-react-native'
import { CloseIcon, BackIcon} from '../../assets/icons/icons'
import { deleteRating } from '../../api/rating'
import Animated, {
    useAnimatedKeyboard,
    useAnimatedStyle,
  } from 'react-native-reanimated';
import { reviewTraits } from '../../lib/tagOptions'
import { useGetMovieOrTvFromDB } from '../../api/db'

const RatingModalPage = () => {
    const { DBmovieId, DBtvId,  DBcastId, prevRating } = useLocalSearchParams();
    const [ previousRating, setPreviousRating ] = useState(prevRating)
    const [rating, setRating] = useState(1.0); // Starting at 5.0 rating
    const [ isStepOne, setIsStepOne ] = useState(true)
    // const [ prevRating, setPrevRating ] = useState(null)
    const [ review, setReview ] = useState('')
    const { user: clerkUser } = useUser()
    const { data: ownerUser } = useFetchOwnerUser({ email :clerkUser?.emailAddresses[0].emailAddress })
    const [ message, setMessage ] = useState(null)
    const [imageLoading, setImageLoading] = useState(true); // Track loading state
    const router = useRouter()
    const [ isConfirmPage, setIsConfirmPage  ] = useState(false)
    const keyboard = useAnimatedKeyboard();
    const [ traits, setTraits ] = useState([])

    // const params = {DBmovieId, DBtvId}
    // const {movie, tv, isLoading} = useGetMovieOrTvFromDB(params)
    
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateY: -keyboard.height.value / 3 }],
    }));
    
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';

    const movieData = DBmovieId && useGetMovieFromDB(DBmovieId);
    const tvData  = DBtvId && useGetTVFromDB(DBtvId);
    const movie = movieData?.movie;
    console.log('MOVIEEEE', movie)
    const tv = tvData?.tv;

    // const {movie} =  useGetMovieFromDB(DBmovieId);
    // const {tv}  =  useGetTVFromDB(DBtvId);


    






    const handleImageLoad = () => {
        setImageLoading(false)
    }

    const handlePost = async (  ) => {

        const data = {
            userId:ownerUser?.id,
            movieId : Number(DBmovieId),
            tvId : Number(DBtvId),
            rating : Number(rating.toFixed(1)),
            review : review.trim(),
            traits 

        }
        console.log('REVIEW DATAAA', data)
        const postedRating = await createRating(data)
        // router.back()
        if (postedRating){
            setMessage('Successfully posted rating')
        }
        setTimeout(() => {
            router.back()
        }, 1700)


    }

    const stepTwo = () =>{
        setIsStepOne(false)
    }

    const handleDelete = async () => {
        const data = {
            userId : ownerUser.id,
            movieId : DBmovieId,
            tvId : DBtvId,
            castId : DBcastId
        }
        const response = await deleteRating(data)
        setMessage(response.message)
        setPreviousRating(null)
        setIsConfirmPage(false)

    }


    const handleTraitPress = (item) => {
      
        const alreadySelected = traits.some( i => i === item)
        if (alreadySelected) {
            setTraits( prev => prev.filter( i => i !== item))
        } else {
            if (traits.length >= 3){
                return
            }
            setTraits( prev => [...prev, item])

        }
    }



  return (
    <ScrollView className='w-full h-full bg-primary' style={{borderRadius:30}}>

        {!movie?.title && !tv?.title ? (
            <ActivityIndicator />
        ) : (


        <View style={{gap:80, paddingTop:30, paddingBottom:150,justifyContent:'center' , width:'100%'}}>
                <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20 , alignSelf:'center'}} />
        <ToastMessage message={message} onComplete={() => setMessage('')} icon={<Star size={30} color={Colors.secondary} />} />

        { isConfirmPage ? (
            <View className="gap-3" style={{paddingTop:30, paddingHorizontal:15}}>  
            <Text className="text-3xl self-center font-pbold text-white">Delete your previous rating?</Text>
            <View className="pt-10 gap-3">
                <TouchableOpacity onPress={handleDelete} style={{ backgroundColor:Colors.secondary, borderRadius:30, paddingVertical:10, width:200, alignSelf:'center'}}>
                    <Text className="text-primary font-pbold text-center">Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setIsConfirmPage(false)} style={{ backgroundColor:Colors.secondary, borderRadius:30, paddingVertical:10, width:200, alignSelf:'center'}}>
                    <Text  className="text-primary font-pbold text-center">Cancel</Text>
                </TouchableOpacity>
                </View>
            </View>
        ) : (
            <>
            { isStepOne ? (

                <>
        { !DBcastId && (
        <View style={{width:'100%', height:120,justifyContent:'center', alignItems:'center'}}>
            
            <View style={{ paddingTop:120, gap:10, justifyContent:'center', alignItems:'center' }}>
                <Text className='text-mainGray font-pbold' >{movie?.title || tv?.title || ''} ({getYear(movie?.releaseDate || tv?.releaseDate)})</Text>
                {previousRating && (
                <View style={{backgroundColor:Colors.mainGray, borderRadius:10, flexDirection:'row', marginBottom:15, justifyContent:'space-between', gap:5, alignItems:'center', paddingHorizontal:5, paddingVertical:3}}>
                    <Text className='font-pbold text-xs'>Previous rating: {prevRating}</Text>
                    <TouchableOpacity onPress={() => setIsConfirmPage(true)}>
                        <CloseIcon size={20} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
                )}
                        <Image
                            source={{ uri:`${posterURL}${movie?.posterPath || tv?.posterPath}` }}
                            placeholder={{ uri:`${posterURLlow}${movie?.posterPath || tv?.posterPath}` }}
                            placeholderContentFit='cover'
                            contentFit='cover'
                            transition={300}
                            style={{ width:90, height:130, borderRadius:15 }}
                        />
            </View>
        </View>

            ) }
        <View className='' style={{paddingTop:30}}>
            <RatingUI rating={rating} setRating={setRating}  handlePost={stepTwo} prevRating={previousRating}/>
        </View>
            </>
            ) : (
                <Animated.View
                style={[
                  animatedStyles,
                ]}>
                <View className='w-full h-full px-6 pt-10 gap-5'>
                    <TouchableOpacity onPress={()=>setIsStepOne(true)}>
                        <BackIcon color={Colors.mainGray} size={26}></BackIcon>
                    </TouchableOpacity>
                    <Text className='text-white font-pbold text-2xl text-center'>Turn your rating into a Review!</Text>
                    <View>
                    
                    </View>
                    <View className='relative'>

                    <TextInput 
                        value={review}
                        onChangeText={(text)=>setReview(text)}
                        maxLength={5000}
                        multiline
                        placeholder='Write your review (optional)'
                        placeholderTextColor={Colors.mainGray}
                        scrollEnabled
                        className='text-white font-pcourier relative'
                        style={{ borderWidth:0, paddingBottom:100, minHeight:130, backgroundColor:Colors.mainGrayDark, borderRadius:10, borderColor:Colors.mainGray, paddingHorizontal:20, paddingTop:25, maxHeight:400}}

                    />
                        <View className='absolute bottom-0 justify-between items-end w-full flex-row px-[20px] ' style={{borderRadius:10, paddingBottom:20,backgroundColor:Colors.mainGrayDark}}>
                            <TouchableOpacity style={{backgroundColor: Colors.primary, padding:7, borderRadius:15}} onPress={()=>setIsStepOne(true)} className='flex-row justify-center items-center gap-2'>
                                <Star size={20} color={Colors.secondary}/>
                                <Text className='text-mainGray font-pbold text-2xl'>{rating.toFixed(1)}/10</Text>
                            </TouchableOpacity>
                            <Text className='text-mainGray'>{review.length}/5000</Text>
                        </View>
                    </View>

                    <Text className='text-white font-psemibold text-lg'>Choose up to 3 to give praise for:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>

                        {reviewTraits.map((item, index) => {
                            const alreadySelected = traits.includes(item);

                            return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleTraitPress(item)}
                                style={{
                                borderRadius: 15,
                                backgroundColor: alreadySelected ? 'white' : 'transparent',
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                borderWidth: 1,
                                borderColor: 'white',
                                marginRight: 8,
                                marginBottom: 8,
                                }}
                            >
                                <Text className="font-pmedium" style={{ color: alreadySelected ? Colors.primary : 'white' }}>{item} </Text>
                            </TouchableOpacity>
                            );
                        })}
                    </View>
                          <TouchableOpacity onPress={handlePost} className='justify-center items-center self-center ' style={{backgroundColor:Colors.secondary, borderRadius:30, width:150, height:40}}>
                        <Text className='font-pbold text-lg' >Post</Text>
                    </TouchableOpacity>
                </View>
                
                </Animated.View>
            )}
            
        </>
        
        ) }
        

        </View>
        )}

        
    </ScrollView>
  )
}

export default RatingModalPage

const styles = StyleSheet.create({
   
})