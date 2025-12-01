  import { StyleSheet, Text, View, TextInput,  Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Button } from 'react-native'
import React, {useState, useRef} from 'react'
import { Colors } from '../../constants/Colors'
import { signupSchema, signupPasswordSchema } from '../../lib/zodSchemas'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSignUpContext } from '../../lib/SignUpContext'
import ArrowBackButton from '../../components/ui/ArrowBackButton'
import ArrowNextButton from '../../components/ui/ArrowNextButton'


const step4 = () => {
    const length = 6;
    const { signUpData, updateSignUpData } = useSignUpContext()
    const router = useRouter();
    const [ errors, setErrors ] = useState({})
    const handleInputs = (name, value) => {
        updateSignUpData(prev => ({
          ...prev,
          [name] : value
        }))

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
        router.push('/step5-confirmPassword')
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
                <Text className='text-red-400 text-sm text-start'>* {item}</Text>
            </View>
            )) 
        }
        </View>
            <TextInput
              value={signUpData.password}
              placeholder="Enter password"
              textContentType='newPassword'
              secureTextEntry={true}
              placeholderTextColor={Colors.mainGray}
              style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
              onChangeText={(text) => handleInputs('password', text)}
            />


            <View className='pt-10 self-center flex flex-row gap-3'>
                <ArrowBackButton onPress={()=>router.back()} />
                <ArrowNextButton onPress={handleContinue}   disabled={Object.values(errors).some((error) => error?.length > 0) || !signUpData.password } />
            </View>
            
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