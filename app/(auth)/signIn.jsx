import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, Button, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, {useState} from 'react'
import { Colors } from '../../constants/Colors'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [ validationErrors, setValidationErrors ] = useState('')


  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        setValidationErrors(err.errors[0].message)

        console.log(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setValidationErrors(err.errors[0].message)
      console.log(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View className="gap-5 " style={{ justifyContent:'center', alignItems:'center', width:'100%', height:'100%', backgroundColor:Colors.primary }} >
      <View className="items-center gap-8">
      <Text className='text-white font-pbold text-3xl'>Sign in</Text>

      { validationErrors && (
            <View  >
                <Text className='text-red-400 text-sm text-start'>* {validationErrors}</Text>
            </View>
            ) 
        }

        <View className="items-start gap-5">
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email/username"
            placeholderTextColor={Colors.mainGray}
          
            style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
          <TextInput
            value={password}
            placeholder="Enter password"
            textContentType="password"   
            autoComplete='password'
            secureTextEntry={true}
            placeholderTextColor={Colors.mainGray}
            style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        <View className="gap-3 justify-center items-center w-full">
          <TouchableOpacity onPress={onSignInPress}  style={{ borderRadius:30, backgroundColor:Colors.secondary, paddingVertical:10, paddingHorizontal:15, width:280, justifyContent:'center', alignItems:'center' }}>
            <Text className='text-primary text-lg font-bold w-full  text-center' style={{width:'100%'}} >Sign in</Text>
          </TouchableOpacity>
          <View className='gap-3 flex-row  justify-center items-center mt-5'>
            <TouchableOpacity onPress={()=>router.push('/(onboarding)/step1-firstName')} style={{borderRadius:15, borderWidth:1, borderColor:'white', paddingHorizontal:10, paddingVertical:3}}>
                <Text className='text-white  text-sm text-center' >Create an account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.push('/(auth)/resetPassword')} style={{borderRadius:15, borderWidth:1, borderColor:'white', paddingHorizontal:10, paddingVertical:3}}>
                <Text className='text-white text-sm  text-center' >Forgot password</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
  )
}