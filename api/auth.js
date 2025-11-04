import { useState, useEffect } from 'react';
import * as nodeServer from '../lib/ipaddresses'
import * as SecureStore from 'expo-secure-store';
import { useUserContext } from '../lib/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';


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

// Refresh access token
async function refreshAccessToken() {
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
        const response = await fetch(`${nodeServer.currentIP}/auth/login`, {
            method : 'POST',
            headers : {
                'Content-type':"application/json"
            },
            body : JSON.stringify({login, password})
        })
        if (!response.ok){
            throw new Error("Couldn't login")
        }
        const data = await response.json()
        const {accessToken, refreshToken} = data
        await saveAccessToken(accessToken)
        await saveRefreshToken(refreshToken)
        return {messaage : "Successfully logged in"}
    } catch (err){
        console.error(err)
        return {error : err}
    }
}

export const useGetUser = () => {
  const { user, updateUser } = useUserContext();
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState(null);

  const getUser = async () => {
    // 1️⃣ Check global state
    if (user) return user;

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