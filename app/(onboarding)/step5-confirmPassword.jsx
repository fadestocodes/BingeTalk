import { StyleSheet, Text, View, TextInput,  Keyboard, TouchableWithoutFeedback, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Button, ActivityIndicator } from 'react-native'
import React, {useState, useRef} from 'react'
import { useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { signupSchema, signupConfirmPasswordSchema } from '../../lib/zodSchemas'
import { useLocalSearchParams } from 'expo-router'
import { addUser } from '../../api/user'
import { useSignUpContext } from '../../lib/SignUpContext'
import * as Sentry from '@sentry/react-native'
import { checkVerificationCodeToCreateUser, sendVerificationCode } from '../../api/auth'
import ArrowBackButton from '../../components/ui/ArrowBackButton'
import ArrowNextButton from '../../components/ui/ArrowNextButton'

const step5 = () => {
    // const { isLoaded, signUp, setActive } = useSignUp()
    const { signUpData, updateSignUpData } = useSignUpContext()
    const length = 6;
    const [pendingVerification, setPendingVerification] = useState(false)
    const [ errors, setErrors ] = useState({})
    const router = useRouter();
    const [code, setCode] = useState(Array(length).fill(''));
    const verificationInputs = useRef([]);
    const [uploading, setUploading] = useState(false)
    const [sendingVerificationCode, setSendingVerificationCode] = useState(false)



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

        const params = {email: signUpData?.email}
        setSendingVerificationCode(true)
        await sendVerificationCode(params)
        setPendingVerification(true)
        setSendingVerificationCode(false)



        // if (!isLoaded) return
    
        // try {
        //      await signUp.create({
        //     emailAddress : signUpData?.email,
        //     password : signUpData?.password,
        //     firstName : signUpData?.firstName?.trim(),
        //     lastName : signUpData?.lastName?.trim(),
        //     username : signUpData?.username?.trim().toLocaleLowerCase()
        //     })
        //     await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        //     setPendingVerification(true)
            
        // } catch (err) {
        //     console.error(JSON.stringify(err, null, 2))
        //     Sentry.captureException(err)
        // }
    }
    
    const onVerifyPress = async ( finalCode ) => {

        const createUserData = {
            email : signUpData.email,
            code : finalCode,
            password : signUpData.password,
            username : signUpData.username,
            firstName : signUpData.firstName,
            lastName : signUpData.lastName,
            accountType : signUpData.accountType,
            filmDept : signUpData.filmDept,
            filmRole : signUpData.filmRole,
            profilePic : signUpData.image,
            city : signUpData.city,
            country : signUpData.country,
            countryCode: signUpData.countryCode,

        }
        console.log('aobut ot create user with this data', createUserData)

        setUploading(true)
        const newUser = await checkVerificationCodeToCreateUser(createUserData)
        console.log('new user', newUser)
        setUploading(false)
        if (newUser.success) {
            router.replace('(onboarding)/recentlyWatched')
        }

    //     if (!isLoaded) return
    
    //     try {
    //         const signUpAttempt = await signUp.attemptEmailAddressVerification({
    //         code : finalCode,
    //         })
    
    //         if (signUpAttempt.status === 'complete') {
    //         await setActive({ session: signUpAttempt.createdSessionId })
    //         try {
    //             const response = await addUser( { firstName:signUpData.firstName.trim(), lastName:signUpData.lastName.trim(), email:signUpData.email, username : signUpData.username.trim().toLocaleLowerCase() } );
    //             if (!response){
    //                 Sentry.captureException(err)
    //             }
    //             // updateUserDB(response)
    //         } catch (err){
    //             Sentry.captureException(err)
    //         }

    //         router.replace({
    //             pathname:'(profileSetup)/profile1',
    //         })

    //         } else {
    //             const error = new Error(`Email verification failed. Status: ${signUpAttempt.status}`);
    //             Sentry.captureException(error, {
    //               extra: { signUpAttempt },
    //             });
    //             console.error(JSON.stringify(signUpAttempt, null, 2))
    //         }
    // } catch (err) {
    //         console.error(JSON.stringify(err, null, 2))
    //         Sentry.captureException(err)
    //     }
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
    {uploading && (
        <ActivityIndicator />
    )}
    { pendingVerification ? (
        <View className='gap-5 px-24'>
            <Text className='text-white font-bold text-2xl'>Enter the verification code sent to your email.</Text>
            <Text className='text-mainGray  '>Check your spam or junk folder if you don't see it in your inbox</Text>
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
                    textContentType='oneTimeCode'
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

        {sendingVerificationCode ? (
            <ActivityIndicator/>
        ) : (
            <>
            <TextInput
              value={signUpData.confirmPassword}
              placeholder="Confirm password"
              textContentType='newPassword'
              secureTextEntry={true}
              placeholderTextColor={Colors.mainGray}
              style={{ color:'white', fontSize:18, backgroundColor:Colors.mainGrayDark, paddingVertical:10, width:300, paddingHorizontal:15, borderRadius:10   }}
              onChangeText={(text) => handleInputs('confirmPassword', text)}
            />

           
            <View className='pt-10 self-center flex flex-row gap-3'>
                <ArrowBackButton onPress={()=>router.back()} />
                <ArrowNextButton onPress={onSignUpPress}    disabled={Object.values(errors).some((error) => error?.length > 0) || !signUpData.confirmPassword  } />
            </View>
            </>

        )}
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