import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import RatingOptionModalPage from '../../../../components/Screens/RatingOptionModalPage'
import { fetchMovieFromDB } from '../../../../api/movie'
import { fetchTVFromDB } from '../../../../api/tv'
import { useLocalSearchParams } from 'expo-router'

const ratingOptionModal = () => {
    const { movieId, tvId } = useLocalSearchParams()
    const [ item, setItem ] = useState(null)

    useEffect(() => {
        
    }, [])
  return (
   <RatingOptionModalPage />
  )
}

export default ratingOptionModal

const styles = StyleSheet.create({})