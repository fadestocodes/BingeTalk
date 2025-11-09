import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AppleIcon, FacebookIcon, GoogleIcon } from '../assets/icons/icons'
import { Colors } from '../constants/Colors'
import { User } from 'lucide-react-native'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'
import { useEffect } from 'react'
import jwtDecode from "jwt-decode";
import { checkExistingUser, getUserInfoGoogle, signInAppleAuth } from '../api/auth'
import { useRouter } from 'expo-router'
import * as AuthSession from 'expo-auth-session'
import * as AppleAuthentication from 'expo-apple-authentication';




const keyID = "BYS3B5F84C";



const SigninComponent = () => {
  
  const [userInfo, setUserInfo] = useState(null)
  const router= useRouter()
  
  const IS_DEV = process.env.NODE_ENV === 'development'
  
  const APPLE_CLIENT_ID = IS_DEV ? "com.bingeableappdev.service" : "com.bingeableapp"
  const APPLE_REDIRECT_URI = AuthSession.makeRedirectUri({
    scheme: IS_DEV ? "bingeable-dev" : "bingeable",
  });
  console.log('redirect URI', APPLE_REDIRECT_URI)

  const appleDiscovery = {
    authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
    tokenEndpoint: 'https://appleid.apple.com/auth/token',
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IS_DEV ? '652130626539-189sbvepfl67000fc0vec1l0iqfi0nl9.apps.googleusercontent.com' :  "652130626539-phlfp948jq7ldul0ark0nl865jhkt1bu.apps.googleusercontent.com",
  })

  const [requestApple, responseApple, promptAsyncApple] = AuthSession.useAuthRequest(
    {
      clientId: APPLE_CLIENT_ID,
      redirectUri: APPLE_REDIRECT_URI,
      responseType: 'code id_token',
      scope: 'email name',
      extraParams: {
        response_mode: 'form_post', // Apple requires this for getting the id_token
      },
      usePKCE: true,
    },
    appleDiscovery
  );

  useEffect(() => {
    console.log(response);
    if (response?.type === "success") {
      const checkUser = async () => {
        const googleUser = await getUserInfoGoogle(response.authentication.accessToken)      
        const createData = {
          email : googleUser.email,
          firstName : googleUser.given_name,
          lastName : googleUser.family_name,
          profilePic : googleUser.picture,
          googleId : googleUser.id
        }

        const checkData = {
          email : googleUser.email,
          oauthProvider : 'GOOGLE',
          oauthId : googleUser.id
        }

        const isExistingUser = await checkExistingUser(checkData)
        if (!isExistingUser) {
          // No user with this oauth, create user then log them in
          router.replace('(onboarding)/step1')
        } else {
          router.replace('/')
        }
      };
      checkUser();
    }
  }, [response])

  useEffect(() => {
    console.log('hello from useEffect for repsoneApple')
    console.log('repsone from apple',responseApple);
    if (responseApple?.type === "success") {
      console.log('apple oauth login success')
      // const checkUser = async () => {
      //   const googleUser = await getUserInfoGoogle(response.authentication.accessToken)      
      //   const createData = {
      //     email : googleUser.email,
      //     firstName : googleUser.given_name,
      //     lastName : googleUser.family_name,
      //     profilePic : googleUser.picture,
      //     googleId : googleUser.id
      //   }

      //   const checkData = {
      //     email : googleUser.email,
      //     oauthProvider : 'GOOGLE',
      //     oauthId : googleUser.id
      //   }

      //   const isExistingUser = await checkExistingUser(checkData)
      //   if (!isExistingUser) {
      //     // No user with this oauth, create user then log them in
      //     router.replace('(onboarding)/step1')
      //   } else {
      //     router.replace('/')
      //   }
      // };
      // checkUser();
    }
  }, [responseApple])

  

  const handleLocalLogin = () =>{
    router.push('(auth)/signIn')
  }

  const handleApplePrompt = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log('Signed in with apple', credential)
      const signInData = {
        appleId : credential.user,
        email : credential.email,
        fullName : credential.fullName
      }
      const res = await signInAppleAuth(signInData)
      console.log('res here', res)
      if (res?.status === 202){
        // Create user onboard
        router.replace('/(onboarding)/step1')
      } else {
        router.replace('/')
      }
    } catch (e) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  }


  return (
    <View className='flex flex-col gap-2'>
      <TouchableOpacity onPress={()=>promptAsyncApple()} className='w-[300px] px-4 py-3 rounded-2xl bg-primary flex flex-row justify-center items-center gap-3 relative'>
        <AppleIcon color={Colors.lightGray} size={20}  className='absolute left-5'/>
        <Text className='text-mainGray font-semibold'>Continue with Apple</Text>
      </TouchableOpacity>

      <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={handleApplePrompt}
      />
    </View>
     
      <TouchableOpacity onPress={()=>{console.log('pressed');promptAsync()}} className='w-[300px] px-4 py-3 rounded-2xl bg-primary flex flex-row justify-center items-center gap-3 relative'>
        <GoogleIcon color={Colors.lightGray} size={20} className='absolute left-5'/>
        <Text className='text-mainGray font-semibold'>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLocalLogin} className='w-[300px] px-4 py-3 rounded-2xl bg-primary flex flex-row justify-center items-center gap-3 relative'>
        <User color={Colors.lightGray} size={20} style={{position:'absolute', left:14}}/>
        <Text className='text-mainGray font-semibold'>Use email or username</Text>
      </TouchableOpacity>
        <TouchableOpacity className='pt-6 justify-center items-center'>
            <Text className='text-mainGray'>Don't have an account? Sign up</Text>
        </TouchableOpacity>
    </View>
  )
}

export default SigninComponent



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
    height: 44,
  },
});
