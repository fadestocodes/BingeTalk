import * as React from 'react'
import { Text, TextInput, Button, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  const [ inputs, setInputs ] = React.useState({
    email:'',
    password:''
  })

  const [ errors, setErrors ] = React.useState([]);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('(onboarding)/step1')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View style={{ width:'100%', height:'100%', justifyContent:'center', alignItems:'center', backgroundColor:Colors.primary }}>
        <Text className="text-white">Verify your email</Text>
        <TextInput
          value={code}
          style={{color:'white'}}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <Button title="Verify" onPress={onVerifyPress} />
      </View>
    )
  }

  return (
    <View  style={{ justifyContent:'center', alignItems:'center', width:'100%', height:'100%', backgroundColor:Colors.primary }} >
      <>
        <Text className='text-white'>Sign up</Text>
        <View className="items-start gap-5">
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            placeholderTextColor={Colors.mainGray}
          
            style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
          <TextInput
            value={password}
            placeholder="Enter password"
            secureTextEntry={true}
            placeholderTextColor={Colors.mainGray}
            style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        <Button title="Continue" onPress={onSignUpPress} />
      </>
    </View>
  )
}