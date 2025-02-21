import { StyleSheet, Text, View, TextInput,  Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Button } from 'react-native'
import React, {useState, useRef} from 'react'
import { useUser, useSignUp } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors'
import { signupSchema, signupPasswordSchema } from '../../lib/zodSchemas'
import { useLocalSearchParams, useRouter } from 'expo-router'


const step4 = () => {
    const length = 6;
    const router = useRouter();
    const { firstName, lastName, username, email } = useLocalSearchParams() // Get email from params
    const { isLoaded, signUp, setActive } = useSignUp()
    const [ errors, setErrors ] = useState({})
    const [ password, setPassword ] = useState('')
   


    const handleInputs = (name, value) => {
        setPassword( value) 

        const results = signupPasswordSchema.safeParse( {password : value} )
        if (!results.success) {
            const errorObj = results.error.format();
            console.log(errorObj)
            setErrors( prev => ({
                ...prev,
                password: errorObj.password ? errorObj.password._errors : undefined,
              }) )
              
            } else {
              setErrors( prev => ({
                ...prev,
                [name] : undefined
              }) )
            }
    }


    const handleContinue = () => {
        router.push({
            pathname : '/step5-confirmPassword',
            params : { firstName, lastName, username, email, password  }
        });
    }
        
  
  return (
    <SafeAreaView className='w-full h-full   bg-primary' style ={{height:'100%', height:'100%' , justifyContent:'center', alignItems:'center'}}>
    <KeyboardAvoidingView
   style={{ flex: 1, width:'100%', height:'100%' }}
   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
 >
   <ScrollView  className='bg-primary' style={{ width:'100%', height:'100%' }}  >
 <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} style={{width:'100%', height:'100%'}}>
   <View  style={{ justifyContent:'center', alignItems:'center', height:'100%', height:'100%', paddingTop:150,  backgroundColor:Colors.primary, gap:15 }} >

   

        <>
        <Text className='text-white font-pbold text-2xl '>Enter password</Text>
        <View className='items-start'>
        { errors.password && errors.password.map( (item, index) => (
            <View key={index} >
                <Text className='text-red-600 text-sm text-start'>* {item}</Text>
            </View>
            )) 
        }
        </View>
            <TextInput
              value={password}
              placeholder="Enter password"
              secureTextEntry={true}
              placeholderTextColor={Colors.mainGray}
              style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
              onChangeText={(text) => handleInputs('password', text)}
            />
       
            <TouchableOpacity onPress={handleContinue}   disabled={Object.values(errors).some((error) => error?.length > 0) || !password  } >
              <Text className='text-secondary text-lg font-psemibold'>Continue</Text>
            </TouchableOpacity>
            </>
    </View>
    </TouchableWithoutFeedback>
      </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
  )
}

export default step4

const styles = StyleSheet.create({})