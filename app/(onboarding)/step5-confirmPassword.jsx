import { StyleSheet, Text, View, TextInput,  Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Button } from 'react-native'
import React, {useState, useRef} from 'react'
import { useRouter } from 'expo-router'
import { useUser, useSignUp } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors'
import { signupSchema, signupConfirmPasswordSchema } from '../../lib/zodSchemas'
import { useLocalSearchParams } from 'expo-router'
import { addUser } from '../../api/user'
import { useUserDB } from '../../lib/UserDBContext'

const step5 = () => {
    const { userDB, updateUserDB } = useUserDB();
    const length = 6;
    const { firstName, lastName, username, email, password } = useLocalSearchParams() // Get email from params
    const { isLoaded, signUp, setActive } = useSignUp()
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [ errors, setErrors ] = useState({})
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const router = useRouter();
    const [code, setCode] = useState(Array(length).fill(''));
    const [ userFromDB, setUserFromDB ] = useState(null)
    const verificationInputs = useRef([]);

    const handleInputs = (name, value) => {
        setConfirmPassword( value) 

        const results = signupConfirmPasswordSchema(password).safeParse( {confirmPassword:value} )
        if (!results.success) {
            const errorObj = results.error.format();
            setErrors( prev => ({
                ...prev,
                confirmPassword: errorObj.confirmPassword ? errorObj.confirmPassword._errors : undefined,
              }) )
              
            } else {
              setErrors( prev => ({
                ...prev,
                [name] : undefined
              }) )
            }
    }

    const onSignUpPress = async () => {
        if (!isLoaded) return
    
        // Start sign-up process using email and password provided
        try {
            await signUp.create({
            emailAddress : email,
            password,
            firstName,
            lastName,
            username
            })
    
            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
    
            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
            try {
                const response = await addUser( { firstName, lastName, email, username } );
                updateUserDB(response)

                if (!response) {
                    console.log('Error trying to add user')
                }
            } catch (err) {
                console.log(err)
            }

        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }
    
        // Handle submission of verification form
    const onVerifyPress = async ( finalCode ) => {
        if (!isLoaded) return
    
        try {
            // Use the code the user provided to attempt verificatione
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
            code : finalCode,
            })
    
            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
            await setActive({ session: signUpAttempt.createdSessionId })
            router.replace({
                pathname:'(profileSetup)/profile1',
            })

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
    
     


    const handleVerificationChange = (text, index) => {
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
            const finalCode = newCode.join('');
            onVerifyPress( finalCode );
            
        }
        };
    
        const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            verificationInputs.current[index - 1].focus();
        }
        };

    const handleFocus = (index) => {
        // Ensure the cursor goes to the end when focusing an input field
        const refInput = verificationInputs.current[index];
        if (refInput) {
        refInput.setSelection(code[index].length, code[index].length); // Move cursor to the end
        }
    };

        
  
  return (
    <SafeAreaView className='w-full h-full   bg-primary' style ={{height:'100%', height:'100%' , justifyContent:'center', alignItems:'center'}}>
    <KeyboardAvoidingView
   style={{ flex: 1, width:'100%', height:'100%' }}
   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
 >
   <ScrollView  className='bg-primary' style={{ width:'100%', height:'100%' }}>
 <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} style={{width:'100%', height:'100%'}}>
   <View  style={{ justifyContent:'center', alignItems:'center', height:'100%', height:'100%', paddingTop:150,  backgroundColor:Colors.primary, gap:15 }} >

    { pendingVerification ? (
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

    ) : (
        <>
        <Text className='text-white font-pbold text-2xl '>Confirm password</Text>
        <View className='items-start'>
        { errors.confirmPassword && errors.confirmPassword.map( (item, index) => (
            <View key={index}  >
            <Text className='text-red-600 text-sm'>* {item}</Text>
            </View>
            )) 
        }
        </View>
            <TextInput
              value={confirmPassword}
              placeholder="Confirm password"
              secureTextEntry={true}
              placeholderTextColor={Colors.mainGray}
              style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
              onChangeText={(text) => handleInputs('confirmPassword', text)}
            />
            <TouchableOpacity onPress={onSignUpPress}   disabled={Object.values(errors).some((error) => error?.length > 0) || !confirmPassword  } >
              <Text className='text-secondary text-lg font-psemibold'>Continue</Text>
            </TouchableOpacity>
            </>

    ) }

    </View>
    </TouchableWithoutFeedback>
      </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
  )
}

export default step5

const styles = StyleSheet.create({})