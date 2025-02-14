import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, {useState} from 'react'
import { useUser } from '@clerk/clerk-expo'

const step1 = () => {
    const [ inputs, setInputs ] = useState({
        firstName : '',
        lastName : '',
    })

    const { user } = useUser();
    console.log('user obj', user);
    // const handleText = (text) => {

    // }

  return (
    <View className='w-full h-full bg-primary justify-center items-center' style={{}} >
      <Text className='text-white'>Welcome!</Text>
        {/* <TextInput
            placeholder='First name'
            value=''
            onChangeText={handleText}
        /> */}


    </View>
  )
}

export default step1

const styles = StyleSheet.create({})