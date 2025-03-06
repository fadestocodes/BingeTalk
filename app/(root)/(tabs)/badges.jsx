import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import RatingUI from '../../../components/RatingUI'

const badges = () => {



    // const handleRatingChange = (newRating) => {
    //     console.log('New Rating:', newRating);
    //   };
      
    //   <ScrollableRating onRatingChange={handleRatingChange} />

    const [rating, setRating] = useState(5.0); // Starting at 5.0 rating

      
  return (
    <View className='w-full h-full justify-center items-center bg-primary'>
      <Text>badges</Text>
      
      <RatingUI  rating={rating} setRating={setRating} />
    </View>
  )
}

export default badges

const styles = StyleSheet.create({})