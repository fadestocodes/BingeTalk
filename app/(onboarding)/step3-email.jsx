import { StyleSheet, Text, View, TextInput,  Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Button } from 'react-native'
import React, {useState, useRef} from 'react'
import { useUser, useSignUp } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors'
import { signupSchema, signupPasswordSchema, signupEmailSchema } from '../../lib/zodSchemas'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { checkEmail } from '../../api/user'
import debounce from 'lodash.debounce'


const step3 = () => {
  const { firstName, lastName, username } = useLocalSearchParams();
  
  const router = useRouter()
    const [ inputs, setInputs ] = React.useState({
      email:'',
    })
    const [ errors, setErrors ] = React.useState({});
    const [ emailTakenError, setEmailTakenError ] = useState('')

    const checkEmail = debounce( async (email) => {
      const response = checkEmail(email);
      if (!response.available) {
        setEmailTakenError(response.message)
      } else {
        setEmailTakenError('')
      }
    }, 500)

    const handleInputs = ( name, value ) => {


      setInputs(prev => ({
        ...prev,
        [name] : value
      }))
  
      const results = signupEmailSchema.safeParse( {...inputs, [name]: value })
      if (!results.success) {
        const errorObj = results.error.format();
        setErrors( prev => ({
          ...prev,
          email: errorObj.email ? errorObj.email._errors : undefined,
        }) )
      } else {
        setErrors( prev => ({
          ...prev,
          [name] : undefined
        }) )
      }
      checkEmail(value);
    }
  
    const handleContinue = () => {
      router.push({
        pathname:'/(onboarding)/step4-password',
        params : {  firstName, lastName, email:inputs.email, username }
      })
    }
        
  
  return (
    <SafeAreaView className='w-full h-full   bg-primary' style ={{height:'100%', height:'100%' , justifyContent:'center', alignItems:'center'}}>
       <KeyboardAvoidingView
      style={{ flex: 1, width:'100%', height:'100%' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView  className='bg-primary' style={{ width:'100%', height:'100%' }}>
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} style={{width:'100%', height:'100%'}}>
      <View  style={{ justifyContent:'center', alignItems:'center', height:'100%', height:'100%', paddingTop:150,  backgroundColor:Colors.primary, gap:15 }} >
          <Text className='text-white font-pbold text-2xl '>Enter email address</Text>
          <View className='items-start'>

          { errors.email && errors.email.map( (item, index) => (
              <View key={index} >
                <Text className='text-red-600 text-sm'>* {item}</Text>
              </View>
              )) 
          }
          { emailTakenError && (
             <View  >
             <Text className='text-red-600 text-sm'>* {emailTakenError}</Text>
           </View>
          ) }
            </View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              value={inputs.email}
              placeholder="Enter email"
              placeholderTextColor={Colors.mainGray}
              style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
              onChangeText={(text) => handleInputs('email', text)}
            />
            <TouchableOpacity onPress={handleContinue}   disabled={Object.values(errors).some((error) => error?.length > 0) || !inputs.email || emailTakenError} >
              <Text className='text-secondary text-lg font-psemibold'>Continue</Text>
            </TouchableOpacity>
            </View>
    </TouchableWithoutFeedback>
      </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>

  )
}

export default step3

const styles = StyleSheet.create({})