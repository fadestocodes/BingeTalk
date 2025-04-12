import { StyleSheet, Text, View, TextInput,  Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Button } from 'react-native'
import React, {useState, useRef} from 'react'
import { useRouter } from 'expo-router'
import { useUser, useSignUp } from '@clerk/clerk-expo'
import { Colors } from '../../constants/Colors'
import { signupSchema, signupConfirmPasswordSchema } from '../../lib/zodSchemas'
import { useLocalSearchParams } from 'expo-router'
import { addUser } from '../../api/user'
import { useUserDB } from '../../lib/UserDBContext'
import { useSignUpContext } from '../../lib/SignUpContext'

const step5 = () => {
    const { isLoaded, signUp, setActive } = useSignUp()
    const { signUpData, updateSignUpData } = useSignUpContext()
    const { userDB, updateUserDB } = useUserDB();
    const length = 6;
    const [pendingVerification, setPendingVerification] = useState(false)
    const [ errors, setErrors ] = useState({})
    const router = useRouter();
    const [code, setCode] = useState(Array(length).fill(''));
    const verificationInputs = useRef([]);



    const handleInputs = (name, value) => {
        updateSignUpData(prev => ({
            ...prev,
            confirmPassword : value
        }))

        const results = signupConfirmPasswordSchema(signUpData.password).safeParse( {confirmPassword:value} )
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
    
        try {
             await signUp.create({
            emailAddress : signUpData?.email,
            password : signUpData?.password,
            firstName : signUpData?.firstName,
            lastName : signUpData?.lastName,
            username : signUpData?.username.toLocaleLowerCase()
            })
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setPendingVerification(true)
            
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }
    }
    
    const onVerifyPress = async ( finalCode ) => {
        if (!isLoaded) return
    
        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
            code : finalCode,
            })
    
            if (signUpAttempt.status === 'complete') {
            await setActive({ session: signUpAttempt.createdSessionId })
            const response = await addUser( { firstName:signUpData.firstName, lastName:signUpData.lastName, email:signUpData.email, username : signUpData.username.toLocaleLowerCase() } );

            updateUserDB(response)

            if (!response) {
                console.log('Error trying to add user')
            }

            router.replace({
                pathname:'(profileSetup)/profile1',
            })

            } else {
            console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }
    }
    
     


    const handleVerificationChange = (text, index) => {
        const newCode = [...code];
    
        if (text.length > 1) {
            const pastedText = text.slice(0, length);
            for (let i = 0; i < pastedText.length; i++) {
            newCode[i] = pastedText[i];
            }
            setCode(newCode);
            verificationInputs.current[Math.min(pastedText.length - 1, length - 1)].focus();
        } else {
            newCode[index] = text;
            setCode(newCode);
            if (text && index < length - 1) {
            verificationInputs.current[index + 1].focus();
            }
        }
    
        if (newCode.every((char) => char !== '')) {
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
        const refInput = verificationInputs.current[index];
        if (refInput) {
        refInput.setSelection(code[index].length, code[index].length);
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
            <Text className='text-red-400 text-sm'>* {item}</Text>
            </View>
            )) 
        }
        </View>
            <TextInput
              value={signUpData.confirmPassword}
              placeholder="Confirm password"
              secureTextEntry={true}
              placeholderTextColor={Colors.mainGray}
              style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
              onChangeText={(text) => handleInputs('confirmPassword', text)}
            />
            <TouchableOpacity onPress={onSignUpPress}   disabled={Object.values(errors).some((error) => error?.length > 0) || !signUpData.confirmPassword  } >
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