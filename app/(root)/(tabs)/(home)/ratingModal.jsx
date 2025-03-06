import { StyleSheet, Text, View , ImageBackground, ScrollView, Image, ActivityIndicator} from 'react-native'
import React, {useState, useEffect} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import RatingUI from '../../../../components/RatingUI'
import { useLocalSearchParams } from 'expo-router'
import { useFetchMovieFromDB, useGetMovieFromDB } from '../../../../api/movie'
import { useFetchTVFromDB } from '../../../../api/tv'
import { Colors } from '../../../../constants/Colors'
import { getYear } from '../../../../lib/formatDate'

const ratingModal = () => {
    const { DBmovieId, TMDBtvId, TMDBcastId } = useLocalSearchParams();
    const [rating, setRating] = useState(5.0); // Starting at 5.0 rating

    const [imageLoading, setImageLoading] = useState(true); // Track loading state
    const [imageReady, setImageReady] = useState(false); // Track if image is ready

    // const handleImageLoadStart = () => {
    //     setImageLoading(true); // Image is loading
    //     setImageReady(false); // Image is not ready
    // };

    const handleImageLoad = () => {
        setImageLoading(false); // Image has finished loading
        setImageReady(true); // Image is ready
    };

    const handleImageError = () => {
        setImageLoading(false); // Image failed to load
        setImageReady(false); // Set image as not ready
        // Optionally, you can show an error message or fallback image
    };


    const posterURL = 'https://image.tmdb.org/t/p/original';
    // console.log('movie Id', TMDBmovieId)
    console.log('dmovieId', DBmovieId)
    const { movie } = useGetMovieFromDB(DBmovieId)

    // const { data:movie } = useFetchMovieFromDB({tmdbId : TMDBmovieId})

    console.log('movie', movie)
    // const { data: show } = useFetchTVFromDB({tmdbId : TMDBtvId})

 



  return (
    <ScrollView className='w-full h-full bg-primary' style={{borderRadius:30}}>
        <View style={{gap:80}}>
        { !TMDBcastId && (
        <View style={{width:'100%', height:120, justifyContent:'center', alignItems:'center'}}>
            {/* <ImageBackground
                style={{width : '100%', height: '100%', position:'absolute', borderRadius:15, overflow:'hidden' }}
                source={{uri : `${posterURL}${movie && movie.backdropPath }`}}
                resizeMethod='cover'
                >
                <LinearGradient
                    colors={[ 'transparent',Colors.primary]}
                    style={{height : '100%', width : '100%'}}>
                </LinearGradient>
            </ImageBackground> */}
            <View style={{ paddingTop:120, gap:10, justifyContent:'center', alignItems:'center' }}>
                <Text className='text-mainGray font-pbold' >{movie && movie.title} ({getYear(movie && movie.releaseDate )})</Text>
                    
                    <Image
                        source={{ uri:`${posterURL}${movie && movie.posterPath }` }}
                        style={{ width:90, height:130, borderRadius:15 }}
                    />

             
            </View>
        </View>
        ) }
        <View className='' style={{paddingTop:20}}>
            <RatingUI rating={rating} setRating={setRating} />
        </View>

        </View>
    </ScrollView>
  )
}

export default ratingModal

const styles = StyleSheet.create({})