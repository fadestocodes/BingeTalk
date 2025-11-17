import { Link, useRouter } from 'expo-router'
import { Text, TextInput, Button, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native'
import React, {useState, useRef} from 'react'
import { Colors } from '../../constants/Colors'
import ToastMessage from '../../components/ui/ToastMessage'
import { signupPasswordSchema, signupConfirmPasswordSchema } from '../../lib/zodSchemas'
import ArrowNextButton from '../../components/ui/ArrowNextButton'
import { checkEmail } from '../../api/user'
import { checkExistingUser, checkNewPassword, checkVerificationCodeToCreateUser, checkVerificationCodeToResetPw, resetUserPassword, sendVerificationCode } from '../../api/auth'
import { ArrowDownNarrowWide } from 'lucide-react-native'



const resetPassword = () => {
  const length = 6;
  const [emailAddress, setEmailAddress] = useState('');
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState(Array(length).fill(''));
  const [ finalCode, setFinalCode ] = useState('')
  const [whichStep, setWhichStep] = useState('stepOne')
  const [secondFactor, setSecondFactor] = useState(false)
  const router = useRouter()
  // const { isLoaded, signIn, setActive } = useSignIn()
  const [error, setError] = useState('')
  const verificationInputs = useRef([]);
  const [newPassword, setNewPassword] = useState(null)
  const [ newPasswordConfirm, setNewPasswordConfirm ] = useState(null)
  const [ validationErrors, setValidationErrors ] = useState({})
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')


  const create = async () => {
    // console.log('hello from create')
    // await signIn
    // ?.create({
    //   strategy: 'reset_password_email_code',
    //   identifier: emailAddress,
    // })
    // .then((_) => {
    //   setSuccessfulCreation(true)
    //   setError('')
    // })
    // .catch((err) => {
    //   const longMessage =
    //   err?.errors?.[0]?.longMessage || err?.message || 'Unknown error';
    // console.error('error:', longMessage);
    //   setError(longMessage)
    // })
    setLoading(true)
    const emailRes  = await checkEmail(emailAddress)
    if (emailRes && emailRes?.available) {
      setEmailError("You haven't created an account with that email address yet.")
    } else if (emailRes ){
      setEmailError('')
      await sendVerificationCode({email : emailAddress})
      setWhichStep('stepTwo')
    }
    setLoading(false)
  }

  const reset = async () => {
    
    if (newPassword !== newPasswordConfirm) return
    const params = {
      email : emailAddress,
      password : newPasswordConfirm
    }
    const res = await resetUserPassword(params)
    if (res?.success){
      router.replace('/')
    }



      // await signIn
      // ?.attemptFirstFactor({

      //   strategy: 'reset_password_email_code',
      //   code: finalCode,
      //   password : newPassword,
      // })
      // .then((result) => {
      //   // Check if 2FA is required
      //   if (result.status === 'needs_second_factor') {
      //     setSecondFactor(true)
      //     setError('')
      //   } else if (result.status === 'complete') {
      //     // Set the active session to
      //     // the newly created session (user is now signed in)
      //     setActive({ session: result.createdSessionId })
      //     setError('')
      //   } else {
      //     console.log(result)
      //   }
      // })
      // .catch((err) => {
      //   // setMessage(err.error[0].longMessage)
      //   const message = err?.errors?.[0]?.longMessage || 'An unexpected error occurred.';
      //   console.error('error', message);
      //   setError(message);
      //   setError(message)
      // })

  }



const handleVerificationChange = async (text, index) => {
  const newCode = [...code];

  if (text.length > 1) {
      // Handle paste: distribute characters
      const pastedText = text.slice(0, length);
      for (let i = 0; i < pastedText.length; i++) {
      newCode[i] = pastedText[i];
      }
      setCode(newCode);
      verificationInputs.current[Math.min(pastedText.length - 1, length - 1)].focus();
  } else {
      // Normal single-character input
      newCode[index] = text;

      setCode(newCode);

      // Move to next input if current has a value
      if (text && index < length - 1) {
      verificationInputs.current[index + 1].focus();
      }
  }

  // Trigger onComplete if filled
  if (newCode.every((char) => char !== '')) {
      // setFinalCode(Number(newCode.join('')))
      const finalCodeInput = newCode.join('');
      setFinalCode(finalCodeInput)
      // onVerifyPress( finalCode );
      // reset()      

      const dataToReset = {
        email : emailAddress,
        code : finalCodeInput
      }
      const isValidCode = await checkVerificationCodeToCreateUser(dataToReset, true)
      if (isValidCode.success){
        setWhichStep('stepThree')
      }
    }
  };
  
  const handleCodeCheck = async () => {
    const dataToReset = {
      email : emailAddress,
      code : finalCode
    }
    const isValidCode = await checkVerificationCodeToCreateUser(dataToReset, true)
    if (isValidCode.success){
      setWhichStep('stepThree')
    }
    
  }


  const handleFocus = (index) => {
    // Ensure the cursor goes to the end when focusing an input field
    const refInput = verificationInputs.current[index];
    if (refInput) {
    refInput.setSelection(code[index].length, code[index].length); // Move cursor to the end
    }
};

  const handleKeyPress = ({ nativeEvent }, index) => {
  if (nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      verificationInputs.current[index - 1].focus();
  }
  };


  const handleInputs = (name, value) => {
    if (name === 'confirmPassword'){
      setNewPasswordConfirm( value) 
      const results = signupConfirmPasswordSchema(newPassword).safeParse( {confirmPassword:value} )
      if (!results.success) {
          const errorObj = results.error.format();
          setValidationErrors( prev => ({
              ...prev,
              confirmPassword: errorObj.confirmPassword ? errorObj.confirmPassword._errors : undefined,
            }) )
            
          } else {
            setValidationErrors( prev => ({
              ...prev,
              [name] : undefined
            }) )
          }
    } else if (name === 'newPassword'){
      setNewPassword(value)
      setPasswordError('')
      const results = signupPasswordSchema.safeParse( {password : value} )

      if (!results.success) {
          const errorObj = results.error.format();
          setValidationErrors( prev => ({
              ...prev,
              newPassword: errorObj.password ? errorObj.password._errors : undefined,
            }) )
            
          } else {
            setValidationErrors( prev => ({
              ...prev,
              [name] : undefined
            }) )
          }
    }
    

  }

  const handleCheckPassword = async () => {
    
    const params = {
      password : newPassword,
      email : emailAddress 
    }
    const res = await checkNewPassword(params)
    if (res?.status === 400){
      setPasswordError(res.message)
    } else if (res.success){
      setPasswordError('')
      setWhichStep('stepFour')
    }
  }





  return (
    <>
      <ToastMessage message={message}  onComplete={()=>setMessage('')} durationMultiple={1.5}  />
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View className="gap-5 " style={{ justifyContent:'center', alignItems:'center', width:'100%', height:'100%', backgroundColor:Colors.primary }} >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          { whichStep === 'stepOne' && (

            <View className="items-center gap-8 ">
            <Text className='text-white font-pbold text-3xl px-10'>Enter email to reset password</Text>

            
              {emailError && (
                <Text className='text-red-400 text-sm text-start'>* {emailError}</Text>
              )}              
              <View className="items-start gap-5">
                <TextInput
                  autoCapitalize="none"
                  textContentType='username'
                  value={emailAddress}
                  placeholder="Enter email"
                  placeholderTextColor={Colors.mainGray}
                  style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
                  onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                />
              
              </View>
              <View className="self-center">
                {/* <TouchableOpacity onPress={()=>{create();setWhichStep('stepTwo')}}  style={{ borderRadius:30, backgroundColor:Colors.secondary, paddingVertical:10, paddingHorizontal:15, width:280, justifyContent:'center', alignItems:'center' }}>
                  <Text className='text-primary text-lg font-bold w-full  text-center' style={{width:'100%'}} >Continue</Text>
                </TouchableOpacity> */}
                <ArrowNextButton disabled={!emailAddress}   onPress={()=>{create()}}/>
              </View>
            </View>
          ) }

          { whichStep === 'stepTwo' && (
            <View className="items-center gap-8">
            <View className='gap-5 px-24'>
                <Text className='text-white font-pbold text-2xl'>Enter the verification code sent to your email.</Text>
                <View style={{ flexDirection:'row', justifyContent:'center', gap:10 }}>
                {Array.from({ length }).map((_, index) => (
                    <TextInput
                        key={index}
                        ref={(el) => (verificationInputs.current[index] = el)}
                        value={code[index]}
                        onFocus={()=>handleFocus(index)}
                        onChangeText={(text) => handleVerificationChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        style={{ width:50, height:50, fontSize:20, textAlign:'center', borderWidth:1, borderColor:Colors.mainGray, borderRadius:10, color:'white', backgroundColor:Colors.primary }}
                        keyboardType="numeric"
                        maxLength={length}
                        returnKeyType="done"
                        autoCapitalize="none"
                        autoCorrect={false}
                        // Enable paste support by making all inputs handle the entire code
                        contextMenuHidden={false} 
                    />
                ))}
                </View>
            </View>
              <View className="gap-3 self-center">
                {/* <TouchableOpacity onPress={()=>{setWhichStep('stepThree')}}  style={{ borderRadius:30, backgroundColor:Colors.secondary, paddingVertical:10, paddingHorizontal:15, width:280, justifyContent:'center', alignItems:'center' }}>
                  <Text className='text-primary text-lg font-bold w-full  text-center' style={{width:'100%'}} >Continue</Text>
                </TouchableOpacity> */}

                <ArrowNextButton onPress={handleCodeCheck} />
                
              </View>
            </View>

          ) }

          { whichStep === 'stepThree' && (
          <View className="items-center gap-8 ">
          <Text className='text-white font-pbold text-3xl px-10'>Enter a new password</Text>
          <View className='gap-1'>

          { validationErrors.newPassword && validationErrors.newPassword.map( (item, index) => (
                <View key={index} >
                    <Text className='text-red-400 text-sm text-start'>* {item}</Text>
                </View>
                )) 
              }
          { passwordError && (
            <Text className='text-red-400 text-sm text-start'>* {passwordError}</Text>
          ) }
          </View>
          

            <View className="items-start gap-5">
              <TextInput
                autoCapitalize="none"
                secureTextEntry={true}
                textContentType='newPassword'
                value={newPassword}
                placeholder="New password"
                placeholderTextColor={Colors.mainGray}
                style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
                onChangeText={(text) => handleInputs('newPassword', text)}
                />
            
            </View>
            <View className='self-center'>

              <ArrowNextButton onPress={handleCheckPassword} />
           
              
            </View>
          </View>
          )}
          { whichStep === 'stepFour' && (
            <View className="items-center gap-8 ">
            <Text className='text-white font-pbold text-3xl px-10'>Confirm password</Text>
              <View className="items-start gap-5">

                <View className='gap-1'>
                { validationErrors.confirmPassword && validationErrors.confirmPassword.map( (item, index) => (
                <View key={index}  >
                <Text className='text-red-400 text-sm'>* {item}</Text>
                </View>
                )) 
            }
                </View>
                <TextInput
                  autoCapitalize="none"
                  secureTextEntry={true}
                  value={newPasswordConfirm}
                  textContentType='newPassword'
                  placeholder="Confirm password"
                  placeholderTextColor={Colors.mainGray}
                  style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
                  //  onChangeText={(text) => setNewPasswordConfirm(text)}
                  onChangeText={(text) => handleInputs('confirmPassword', text)}

                />
              
              </View>
              <View className="self-center ">
                
                <ArrowNextButton onPress={reset } />
                
              </View>
            </View>
          ) }
        </>

      )}


    </View>
  </TouchableWithoutFeedback>
  </>
  )
}

export default resetPassword
