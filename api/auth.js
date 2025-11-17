import { useState, useEffect } from 'react';
import * as nodeServer from '../lib/ipaddresses'
import * as SecureStore from 'expo-secure-store';
import { useUserContext } from '../lib/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'expo-router';
import { router } from 'expo-router';
import { useCreateContext } from '@/lib/CreateContext';


// Token storage helpers
async function getAccessToken() {
  return await SecureStore.getItemAsync('accessToken');
}
async function getRefreshToken() {
  return await SecureStore.getItemAsync('refreshToken');
}
async function saveAccessToken(token) {
  await SecureStore.setItemAsync('accessToken', token);
}
async function saveRefreshToken(token) {
  await SecureStore.setItemAsync('refreshToken', token);
}

export async function clearAuthTokens() {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    } catch (err) {
      console.error('Failed to clear auth tokens:', err);
      // Optionally show a user-friendly message or handle retry
    }
}

// Refresh access token
async function refreshAccessToken() {

    try  {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) return;
      
        const res = await fetch(`${nodeServer.currentIP}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
     
        if (!res.ok) throw new Error('Refresh failed');
      
        const data = await res.json();
        await saveAccessToken(data.accessToken);
        if (data.refreshToken) await saveRefreshToken(data.refreshToken);
        return data.accessToken;

    } catch (err){
        console.error(err)
    }
}

// Central fetch wrapper
export async function apiFetch(url, options = {}) {
    let accessToken = await getAccessToken();

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });


    if (res.status !== 401) return res; // success or other error

    
    // Access token expired → refresh
    try {
        const newAccessToken = await refreshAccessToken();
        
        if (!newAccessToken) return
            // Retry original request
        res = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${newAccessToken}`,
        },
        });
        return res;
    } catch (err) {
        console.error(err); // Refresh failed → force logout
        
    }

}

export const loginLocal = async (login, password) => {
    try {
        const existingToken = await getRefreshToken()
        const body = { login, password };
        if (existingToken) body.existingToken = existingToken;
        const response = await fetch(`${nodeServer.currentIP}/auth/login`, {
            method : 'POST',
            headers : {
                'Content-type':"application/json"
            },
            body : JSON.stringify(body)
        })
        if (!response.ok){
            return {error : "Invalid credentials"}
        }
        const data = await response.json()
        const {accessToken, refreshToken} = data
        await saveAccessToken(accessToken)
        await saveRefreshToken(refreshToken)
        return {messaage : "Successfully logged in"}
    } catch (err){
        console.error(err)
        return {error : "Invalid credentials"}
    }
}

export const useGetUser = () => {
  const { user, updateUser } = useUserContext();
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState(null);
    const router = useRouter()
  const getUser = async () => {
    // 1️⃣ Check global state
    if (user) return user;

    const accessToken = await SecureStore.getItemAsync('accessToken');
    if (!accessToken) {
      return null;
    }
  

    // 2️⃣ Check AsyncStorage
    try {
      const storedJSON = await AsyncStorage.getItem('user-data');
      if (storedJSON) {
        const storedUser = JSON.parse(storedJSON);
        updateUser(storedUser);
        return storedUser;
      }
    } catch (err) {
      console.error('Failed to read or parse user from AsyncStorage', err);
      await AsyncStorage.removeItem('user-data'); // clear corrupted data
    }

    // 3️⃣ Fetch from API (using apiFetch to auto-refresh token)
    try {
       
      const res = await apiFetch(`${nodeServer.currentIP}/user/simple`);
      if (res.status === 401){
        return
      }
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

      const userData = await res.json();
      const userJSON = JSON.stringify(userData);

      // Update AsyncStorage and global state
      await AsyncStorage.setItem('user-data', userJSON);
      updateUser(userData);

      return userData;
    } catch (err) {
      console.error('Failed to fetch user', err);

    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        setLoading(true);
        try {
          await getUser();
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [user]);

  return { user, loading, error, refetch:getUser, updateUser };
};



export const useCheckSignedIn =  () => {
    
    const [isSignedIn, setIsSignedIn] = useState()
    const [loading, setLoading] = useState(true)

    const checkSignedIn = async () => {
      
        setLoading(true)
        //  First try to get refreshToken from SecureStore
        const refreshToken = await getRefreshToken()
        if (!refreshToken) setIsSignedIn(false)
     
        try {
            const decoded = jwtDecode(refreshToken);
            const expiry = new Date(decoded.exp * 1000); // convert seconds → ms
            const check =  expiry > new Date(); // true if not expired
            setIsSignedIn(check)

        } catch (err) {
        setIsSignedIn(false)
        }
        setLoading(false)
    }

    useEffect(() => {
        checkSignedIn()
    }, [])

    return {isSignedIn, loading}

}
  

export const useGetUserFull = (id) => {
    const [userFull, setUserFull] = useState(null)
    const [loading, setLoading] = useState(true)


    const getUserFull = async () => {


        const accessToken = await SecureStore.getItemAsync('accessToken');
        if (!accessToken || !id) {
          return null;
        }
      
        try {
            setLoading(true)
            const res = await apiFetch(`${nodeServer.currentIP}/user`, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({id})
            })
            if (!res.ok){
                throw new Error ("Couldn't get full user data")
            }
            const userData = await res.json()
            setUserFull(userData)
        }catch (err){
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUserFull()
    }, [id])

    return {userFull, loading, refetch: getUserFull}
}

export const useSignOutUser = () => {
    
    
    const router = useRouter()
    const {user,updateUser} = useUserContext()

    const signOutUser = async () => {
        try {
            const refreshToken = await getRefreshToken()
            if (refreshToken){
              const res = await apiFetch(`${nodeServer.currentIP}/user/sign-out`, {
                method : 'POST',
                headers : {
                  'Content-type' : 'application/json'
                },
                body:JSON.stringify({token:refreshToken})
              })
              if (!res.ok){
                throw new Error("Error signing out user")
              }

            }
            await clearAuthTokens()
            updateUser(null)
            await AsyncStorage.removeItem('user-data')
    
        } catch(err){
            console.error(err)
        }
    }

    return {signOutUser}
}



export const getUserInfoGoogle = async (token) => {
  if (!token) return
  try {
    const res = await fetch("https://www.googleapis.com/userinfo/v2/me",{
      headers:{Authorization: `Bearer ${token}`}
    })
    const user = await res.json()
    return user
  } catch (err){
    console.error(err)
  }
}

export const checkExistingUser = async (checkData) => {
  try {
    const res = await fetch(`${nodeServer.currentIP}/user/oauth-check`, {
      method : 'POST',
      headers : {
        'Content-type' : 'application/json'
      },

      body : JSON.stringify(checkData)
    })
    if (!res.ok){
      throw new Error ("Couldn't check user")
  
    } 
    if (res.status === 202){
      return {status: 202}
    }
    const data = await res.json()
    const {accessToken, refreshToken} = data
    await saveAccessToken(accessToken)
    await saveRefreshToken(refreshToken)
    return {status : 200}
  } catch (err){
    console.error(err)
  }
}


export const signInAppleAuth = async (data) => {
  // console.log('createuserdata', createUserData)
  try {
    ('data to login', data)
    if (!data?.email){
      const email = await AsyncStorage.getItem('apple-email')
      data.email = email
    }
    const res = await fetch(`${nodeServer.currentIP}/user/oauth/apple`, {
      method : 'POST',
      headers:{
        'Content-type' : 'application/json'
      },
      body : JSON.stringify(data)
    })
    if (res.status === 202) {
      // const appleId = await AsyncStorage.setItem('appleId', data.appleId || '');
      // console.log('appleId...', appleId)
      await AsyncStorage.setItem('apple-email', data.email || '');
      await AsyncStorage.setItem('apple-fullName', JSON.stringify(data.fullName || {}));
      
      // updateCreateUserData({
      //   ...createUserData,
      //   appleId : data.appleId,
      //   email : data.email,
      //   firstName : data?.fullName?.givenName ,
      //   lastName : data?.fullName?.familyName
      // })
      return { status: 202, data: responseData }
    };
    if (!res.ok) throw new Error("Error trying to login with apple auth")


    const responseData = await res.json()
    const {accessToken, refreshToken} = responseData
    await saveAccessToken(accessToken)
    await saveRefreshToken(refreshToken)

    return true
  } catch (err){
    console.error(err)
  }
}


 export const createOauthUser = async (data) => {
    try {
      const res = await fetch(`${nodeServer.currentIP}/user/oauth/create`, {
        method : 'POST',
        headers : {'Content-type' : 'application/json'},
        body:JSON.stringify(data)
      })
      if (!res.ok) throw new Error ("Couldn't create user with apple data")
      const resData = await res.json()
      const {accessToken, refreshToken} = resData.data
      await saveAccessToken(accessToken)
      await saveRefreshToken(refreshToken)
      return true
      
    } catch(err){
      console.error(err)
    }
}


export const sendVerificationCode = async (params) => {
  try {
    const res = await fetch(`${nodeServer.currentIP}/auth/verification-code`, {
      method : 'POST',
      headers : {
        'Content-type' : 'application/json'
      },
      body: JSON.stringify(params)
    })
    if (!res.ok) throw new Error("Coudlnt' send verification code")
    const resData = await res.json()
  } catch(err){
    console.error(err)
  }
}

export const checkVerificationCodeToCreateUser = async (params, checkOnly=null) => {
  try {
    ("hello from here")
    const query = checkOnly ? '?checkOnly=true' : ''

    const res = await fetch(`${nodeServer.currentIP}/auth/verification-code/check${query}`, {
      method : 'POST',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify(params)
    })
    if (!res.ok) throw new Error("Invalid response")
    if (res.status === 202) return {success : true}
    const resData = await res.json()
    const {accessToken,refreshToken} = resData.data
    await saveAccessToken(accessToken)
    await saveRefreshToken(refreshToken)
    return {success: true}
  } catch(err){
    console.error(err)
    return {success:false}
  }

}


export const checkNewPassword = async (params) => {
  ('params.....', params)
  try {
    const res = await fetch(`${nodeServer.currentIP}/user/new-password`, {
      method : 'POST',
      headers:{'Content-type' : 'application/json'},
      body:JSON.stringify(params)
    })
    if (res.status === 400) {
      return {success : false, status : 400, message : "Cannot use previous password"}
    }
    const resData = await res.json()
    return {success : true}
  } catch(err){
    console.error(err)
    return {success : false}
  }
}

export const resetUserPassword = async (params) => {
  try {
    const res = await fetch(`${nodeServer.currentIP}/auth/password-reset`, {
      method : 'POST',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify(params)
    })
    if (!res.ok) throw new Error("Invalid response")
    const resData = await res.json()
    const {accessToken,refreshToken} = resData.data
    await saveAccessToken(accessToken)
    await saveRefreshToken(refreshToken)
    return {success : true}
  } catch(err){
    console.error(err)
    return {success:false}
  }
}