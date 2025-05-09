import { StyleSheet, Text, View , ImageBackground, ScrollView, ActivityIndicator, TouchableOpacity} from 'react-native'
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
import { CloseIcon } from '../../assets/icons/icons'
import { deleteRating } from '../../api/rating'

const RatingModalPage = () => {
    const { DBmovieId, DBtvId,  DBcastId, prevRating } = useLocalSearchParams();
    const [ previousRating, setPreviousRating ] = useState(prevRating)
    const [rating, setRating] = useState(1.0); // Starting at 5.0 rating
    // const [ prevRating, setPrevRating ] = useState(null)
    const { user: clerkUser } = useUser()
    const { data: ownerUser } = useFetchOwnerUser({ email :clerkUser?.emailAddresses[0].emailAddress })
    const [ message, setMessage ] = useState(null)
    const [imageLoading, setImageLoading] = useState(true); // Track loading state
    const router = useRouter()
    const [ isConfirmPage, setIsConfirmPage  ] = useState(false)
    
    
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';

    const movieData = DBmovieId && useGetMovieFromDB(DBmovieId);
    const tvData  = DBtvId && useGetTVFromDB(DBtvId);
    const movie = movieData?.movie;
    const tv = tvData?.tv;






    const handleImageLoad = () => {
        setImageLoading(false)
    }

    const handlePost = async (  ) => {

        const data = {
            userId:ownerUser?.id,
            movieId : Number(DBmovieId),
            tvId : Number(DBtvId),
            rating : Number(rating.toFixed(1))

        }
        const postedRating = await createRating(data)
        // router.back()
        if (postedRating){
            setMessage('Successfully posted rating')
        }
        setTimeout(() => {
            router.back()
        }, 1700)


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



  return (
    <ScrollView className='w-full h-full bg-primary' style={{borderRadius:30}}>

        <View style={{gap:80, paddingTop:30, justifyContent:'center' , width:'100%'}}>
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
            <RatingUI rating={rating} setRating={setRating}  handlePost={handlePost} prevRating={previousRating}/>
        </View>
        </>
        ) }

        </View>
    </ScrollView>
  )
}

export default RatingModalPage

const styles = StyleSheet.create({})