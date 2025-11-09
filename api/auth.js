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
      console.log('Auth tokens cleared successfully');
    } catch (err) {
      console.error('Failed to clear auth tokens:', err);
      // Optionally show a user-friendly message or handle retry
    }
}

// Refresh access token
async function refreshAccessToken() {

    try  {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');
      
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
        
        if (!newAccessToken) throw new Error("Couldn't refresh access token")
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
        console.log('existingToken?', existingToken)
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
            return {error : "Error signing in"}
        }
        const data = await response.json()
        const {accessToken, refreshToken} = data
        await saveAccessToken(accessToken)
        await saveRefreshToken(refreshToken)
        return {messaage : "Successfully logged in"}
    } catch (err){
        console.error(err)
        return {error : "Error signing in"}
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
        console.log('401 from getUser')
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
            console.log('trying to get userful with id', id)
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
    console.log('USERDATA', user)
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
      console.log('status 202')
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
  console.log('hello')
  // console.log('createuserdata', createUserData)
  try {
    console.log('data to login', data)
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
      console.log('Need to onboard user and store apple response data')  
      // const appleId = await AsyncStorage.setItem('appleId', data.appleId || '');
      // console.log('appleId...', appleId)
      await AsyncStorage.setItem('apple-email', data.email || '');
      await AsyncStorage.setItem('apple-fullName', JSON.stringify(data.fullName || {}));
      console.log('successfulyl stored apple data...')
      
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
    console.log('the resposne data...', responseData)
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
      console.log('resdata',resData)
      const {accessToken, refreshToken} = resData.data
      await saveAccessToken(accessToken)
      await saveRefreshToken(refreshToken)
      return true
      
    } catch(err){
      console.error(err)
    }
}


