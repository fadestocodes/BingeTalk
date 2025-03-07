import { StyleSheet, Text, View , ImageBackground, ScrollView, Image, ActivityIndicator} from 'react-native'
import React, {useState, useEffect} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import RatingUI from '../../../../components/RatingUI'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useFetchMovieFromDB, useGetMovieFromDB } from '../../../../api/movie'
import { useFetchTVFromDB, useGetTVFromDB } from '../../../../api/tv'
import { Colors } from '../../../../constants/Colors'
import { getYear } from '../../../../lib/formatDate'
import { createRating } from '../../../../api/rating'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../../../api/user'
import ToastMessage from '../../../../components/ui/ToastMessage'
import { Star } from 'lucide-react-native'

const ratingModal = () => {
    const { DBmovieId, DBtvId,  DBcastId, prevRating } = useLocalSearchParams();
    const [rating, setRating] = useState(5.0); // Starting at 5.0 rating
    // const [ prevRating, setPrevRating ] = useState(null)
    const { user: clerkUser } = useUser()
    const { data: ownerUser } = useFetchOwnerUser({ email :clerkUser.emailAddresses[0].emailAddress })
    const [ message, setMessage ] = useState(null)
    const [imageLoading, setImageLoading] = useState(true); // Track loading state
    const posterURL = 'https://image.tmdb.org/t/p/original';
    const router = useRouter()



    const movieData = DBmovieId && useGetMovieFromDB(DBmovieId);
    const tvData  = DBtvId && useGetTVFromDB(DBtvId);
    const movie = movieData?.movie;
    const tv = tvData?.tv;





    console.log('movie', movie)
    console.log('tv', tv)

    const handleImageLoad = () => {
        setImageLoading(false)
    }

    const handlePost = async (  ) => {

        const data = {
            userId:ownerUser.id,
            movieId : Number(DBmovieId),
            tvId : Number(DBtvId),
            rating : Number(rating.toFixed(1))

        }
        console.log('data ', data)
        const postedRating = await createRating(data)
        // router.back()
        console.log('postedRating', postedRating)
        if (postedRating){
            console.log('hello')
            setMessage('Successfully posted rating')
        }
        console.log('postedRating', postedRating)


    }



  return (
    <ScrollView className='w-full h-full bg-primary' style={{borderRadius:30}}>

        <View style={{gap:80, paddingTop:30, justifyContent:'center' , width:'100%'}}>
                <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20 , alignSelf:'center'}} />
        <ToastMessage message={message} onComplete={() => setMessage('')} icon={<Star size={30} color={Colors.secondary} />} />
        { !DBcastId && (
        <View style={{width:'100%', height:120, justifyContent:'center', alignItems:'center'}}>
            
            <View style={{ paddingTop:120, gap:10, justifyContent:'center', alignItems:'center' }}>
                <Text className='text-mainGray font-pbold' >{movie?.title || tv?.title || ''} ({getYear(movie?.releaseDate || tv?.releaseDate)})</Text>
                { imageLoading && <ActivityIndicator color={Colors.secondary}/> }
                        <Image
                            source={{ uri:`${posterURL}${movie?.posterPath || tv?.posterPath}` }}
                            style={{ width:90, height:130, borderRadius:15 }}
                            onLoad={handleImageLoad}
                        />
            </View>
        </View>
        ) }
        <View className='' style={{paddingTop:20}}>
            <RatingUI rating={rating} setRating={setRating}  handlePost={handlePost} prevRating={prevRating}/>
        </View>

        </View>
    </ScrollView>
  )
}

export default ratingModal

const styles = StyleSheet.create({})