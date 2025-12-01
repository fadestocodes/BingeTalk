import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React from 'react'
import { ArrowRight } from 'lucide-react-native'
import { Colors } from '../../constants/Colors'

const ArrowNextButton = ({ onPress, size='md', disabled=false}) => {

    const dimensions = {
        sm: 25,
        md: 45,
        lg: 65,
      };
    
      const buttonSize = dimensions[size] || dimensions.md; 

  return (

    <TouchableOpacity onPress={onPress} disabled={!!disabled} style={{ width: buttonSize, height:buttonSize, opacity:disabled ? 0.3 : 1 }} className='rounded-full bg-primaryLight  justify-center items-center'>
        <View className=''>
            <ArrowRight color={Colors.newLightGray} />
        </View>
    </TouchableOpacity>
  )
}

export default ArrowNextButton

const styles = StyleSheet.create({})