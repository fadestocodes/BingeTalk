import { StyleSheet, Text, View, TextInput,  Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Button } from 'react-native'
import React, {useState, useRef} from 'react'
import { useUser, useSignUp } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors'
import { signupSchema, signupPasswordSchema, signupEmailSchema } from '../../lib/zodSchemas'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { checkEmail } from '../../api/user'
import debounce from 'lodash.debounce'
import { useSignUpContext } from '../../lib/SignUpContext'


const step3 = () => {
  const { signUpData, updateSignUpData } = useSignUpContext()
  const router = useRouter()
    const [ errors, setErrors ] = React.useState({
      email:[]
    });
    const [ emailTakenError, setEmailTakenError ] = useState('')

    const handleEmailCheck = debounce( async (email) => {
      const response = await checkEmail(email);

      if (response.available) {
        setEmailTakenError('')
      } else {
        setEmailTakenError(response.message || "Unexpected error")
      }
    }, 500)

    const handleInputs = ( name, value ) => {

      updateSignUpData(prev => ({
        ...prev,
        [name] : value
      }))
  
      const results = signupEmailSchema.safeParse( {...signUpData, [name]: value })
      if (!results.success) {
        const errorObj = results.error.format();
        setErrors( prev => ({
          ...prev,
          email: errorObj.email ? errorObj.email._errors : [],
        }) )
      } else {
        setErrors( prev => ({
          ...prev,
          [name] : []
        }) )
      }
      handleEmailCheck(value);
    }
  
    const handleContinue = () => {
      router.push('/(onboarding)/step4-password')
    }

    const handleTermsPress = () => {
      router.push('/(onboarding)/termsPage')
    }
    const handlePrivacyPress = () => {
      router.push('/(onboarding)/privacyPage')
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
                <Text className='text-red-400 text-sm'>* {item}</Text>
              </View>
              )) 
          }
          { emailTakenError && (
             <View  >
             <Text className='text-red-400 text-sm'>* {emailTakenError}</Text>
           </View>
          ) }
            </View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType='email-address'
              value={signUpData.email}
              placeholder="Enter email"
              placeholderTextColor={Colors.mainGray}
              style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
              onChangeText={(text) => handleInputs('email', text)}
            />
          <View className='gap-0 justify-start items-start '>
            <View style={{ flexDirection: 'row', alignItems: 'center', width:'100%', justifyContent:'flex-start',  }}>
      <Text className='text-sm' style={{ color: 'white' }}>
        By proceeding, you accept our{' '}
      </Text>
      
      <TouchableOpacity onPress={handleTermsPress}>
        <Text className='text-sm' style={{ color: 'white', fontWeight: 'bold' }}>Terms of Service</Text>
      </TouchableOpacity>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', width:'100%', justifyContent:'flex-start' }}>


      <Text style={{ color: 'white' }}> and </Text>

      <TouchableOpacity onPress={handlePrivacyPress}>
        <Text className='text-sm' style={{ color: 'white', fontWeight: 'bold' }}>Privacy Policy</Text>
      </TouchableOpacity>
      <Text style={{ color: 'white' }}>.</Text>
      </View>
      </View>

            <TouchableOpacity onPress={handleContinue}   disabled={Object.values(errors).some((error) => error?.length > 0)|| !signUpData.email || !!emailTakenError} >
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