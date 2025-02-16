import { StyleSheet, Text, View, TextInput,  Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Button } from 'react-native'
import React, {useState, useRef} from 'react'
import { useUser, useSignUp } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors'
import { signupNameSchema } from '../../lib/zodSchemas'
import { useLocalSearchParams, useRouter } from 'expo-router'


const step1 = () => {
    const router = useRouter();
    const [ errors, setErrors ] = useState({})
    const [ inputs, setInputs ]   = useState({
      firstName: '',
      lastName : ''
    })
   


    const handleInputs = (name, value) => {
        // setPassword( value) 
        setInputs( prev => ({
          ...prev,
          [name] : value
        }) )

        const results = signupNameSchema.safeParse( { ...inputs, [name] : value } )
        if (!results.success) {
            const errorObj = results.error.format();
            console.log(errorObj)
            setErrors( prev => ({
                ...prev,
                firstName: errorObj.firstName ? errorObj.firstName._errors : undefined,
                lastName: errorObj.lastName ? errorObj.lastName._errors : undefined,
              }) )
              
            } else {
              setErrors( prev => ({
                ...prev,
                [name] : undefined
              }) )
            }
    }


    const onSetup1Press = () => {
        router.push({
            pathname : '/step2-username',
            params : { firstName : inputs.firstName, lastName : inputs.lastName  }
        });
    }
        
  
  return (
    <SafeAreaView  style ={{height:'100%', width:'100%', backgroundColor:Colors.primary , justifyContent:'center', alignItems:'center'}}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
   <ScrollView  style={{  backgroundColor:Colors.primary, width:'100%', height:'100%' }}>
 <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} >
   <View  style={{ justifyContent:'center', alignItems:'center', height:'100%', height:'100%', paddingTop:100, paddingHorizontal:30,  backgroundColor:Colors.primary, gap:15 }} >
        <View   style={{ justifyContent:'center', alignItems:'center', gap:10, marginBottom:50 }} >
            <Text className='text-xl text-secondary font-pcourier  uppercase'>BingeTalk</Text>
            <Text className='font-pcourier text-white ' >Let's quickly create your account. First thing's first, what's your name?</Text>
        </View>
        <Text className='text-white font-pbold text-2xl '>Enter your name.</Text>
        <View className='items-start'>

        { errors.firstName && errors.firstName.map( (item, index) => (
            <View key={index} >
                <Text className='text-red-600 text-sm text-start'>* {item}</Text>
            </View>
            )) 
        }
        </View>
            <TextInput
              value={inputs.firstName}
              placeholder="First name"
              autoCorrect={false}
              placeholderTextColor={Colors.mainGray}
              style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
              onChangeText={(text) => handleInputs('firstName', text)}
            />
        <View className='items-start'>
        { errors.lastName && errors.lastName.map( (item, index) => (
            <View key={index} >
                <Text className='text-red-600 text-sm text-start'>* {item}</Text>
            </View>
            )) 
        }
        </View>
            <TextInput
              value={inputs.lastName}
              placeholder="Last name"
              autoCorrect={false}
              placeholderTextColor={Colors.mainGray}
              style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
              onChangeText={(text) => handleInputs('lastName', text)}
            />
       
            <TouchableOpacity onPress={onSetup1Press}   disabled={Object.values(errors).some((error) => error?.length > 0) || !inputs.firstName || !inputs.lastName  } >
              <Text className='text-secondary text-lg font-psemibold'>Next</Text>
            </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
      </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
  )
}

export default step1

const styles = StyleSheet.create({})