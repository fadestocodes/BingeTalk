import * as nodeServer from '../lib/ipaddresses'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SignOutButton, useAuth } from '@clerk/clerk-react'



export const checkUsername = async ( username ) => {
    try {
        const response = await fetch(`${nodeServer.currentIP}/user/check-username?username=${username}`)
        const data = await response.json();
        return data
    }  catch (err) {
        console.log(err)
    }
}


export const checkEmail = async (email) => {
    try {
        const response = await fetch(`${nodeServer.currentIP}/user/check-email`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({ email })
        })
        const data = await response.json()
        return data
    } catch (err) {
        console.log(err)
    }
}

export const addUser =  async ( { firstName, lastName, email, username } ) => {
    try {
        const response = await fetch (`${nodeServer.currentIP}/user/add-user`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify( { firstName, lastName, email, username } )
        })
        const data = await response.json();
        return data
    } catch(err) {
        console.log(err)
    }
}

export const updateUser = async ( params, email ) => {
    // const queryClient = useQueryClient();

    try {



        const request = await fetch(`${nodeServer.currentIP}/user/update-user`, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify( params )
        })
        const response = await request.json();
        // queryClient.invalidateQueries(['user', email]); // This will trigger a refetch the next time the query is used
        // queryClient.refetchQueries(['user', email]);

        return response; 
    } catch (err) {
        console.log(err)
    }
}

export const updateRotation =  async ( userId, rotationItems, listItemObj  ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/current-rotation`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(  {userId, rotationItems, listItemObj} )
        })
        const response = await request.json();
        console.log('resposne from updateRotation', response)
    } catch (err) {
        console.log(err)
    }
}


export const fetchUser = async ( emailOrId ) => {
    console.log('hello here', emailOrId)
    try {
        const request = await fetch(`${nodeServer.currentIP}/user`, {
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body:JSON.stringify(emailOrId)
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log('Error fetching user from db', err)
    }
}


export const useFetchUser = (emailOrId ) => {

    // const { getToken } = useAuth();
    // const queryClient = useQueryClient(); // Get query client
    // Get all cached queries
    // Log the entire queries object
    console.log('trying to fetch user with email: ', (emailOrId))


    return useQuery({
        queryKey: ['user', emailOrId],
        queryFn: async () => {
            console.log('Executing query function...');
            const fetchedUser = await fetchUser(emailOrId);
            return fetchedUser
        },
        staleTime: 1000 * 60 * 10, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}

export const useFetchOwnerUser = (email) => {
    return useQuery({
        queryKey: ['ownerUser', email],
        queryFn: async () => {
            const fetchedUser = await fetchUser(email);
            return fetchedUser
        },
        staleTime: 1000 * 60 * 10, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}


export const searchUsers = async ( query ) => {
    try {
        console.log('trying to serch users')
        const request = await fetch (`${nodeServer.currentIP}/user/search-all?query=${query}`)
        console.log('worked')
        const response = await request.json();
        console.log('users', response);
        return response;
    } catch (err) {
        console.log(err)
    }
}

export const followUser = async ( followData ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/follow`, {
            method : 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( followData )
        })
        const response = await request.json();
        console.log(response);
        return response
    } catch (err){
        console.log(err)
    }
}

export const unfollowUser = async ( followData ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/unfollow`, {
            method : 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( followData )
        })
        const response = await request.json();
        console.log(response);
        return response
    } catch (err){
        console.log(err)
    }
}

export const fetchRecentlyWatched = async (userId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/recently-watched?userId=${userId}`)
        const response = await request.json()
        return response
    } catch (Err){
        console.log(Err)
    }
}

export const useFetchRecentlyWatched = (userId) => {
    return useQuery({
        queryKey : ['recentlyWatched', userId],
        queryFn: async () => {
            const recentlyWatched = await fetchRecentlyWatched(userId)
            return recentlyWatched
        },
        staleTime: 1000 * 60 * 10, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refet
    })
}

export const fetchWatchlist = async (userId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/watchlist?userId=${userId}`)
        const response = await request.json()
        console.log('response getting watchlist', response)
        return response
    } catch (Err){
        console.log(Err)
    }
}

export const useFetchWatchlist = (userId) => {
    return useQuery({
        queryKey : ['watchlist', userId],
        queryFn: async () => {
            const recentlyWatched = await fetchWatchlist(userId)
            return recentlyWatched
        },
        staleTime: 1000 * 60 * 10, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refet
    })
}

export const fetchInterested = async (userId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/interested?userId=${userId}`)
        const response = await request.json()
        return response
    } catch (Err){
        console.log(Err)
    }
}

export const useFetchInterested = (userId) => {
    return useQuery({
        queryKey : ['interested', userId],
        queryFn: async () => {
            const recentlyWatched = await fetchInterested(userId)
            return recentlyWatched
        },
        staleTime: 1000 * 60 * 10, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refet
    })
}

export const fetchRecommended = async (userId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/recommended?userId=${userId}`)
        const response = await request.json()
        return response
    } catch (Err){
        console.log(Err)
    }
}

export const useFetchRecommended = (userId) => {
    return useQuery({
        queryKey : ['recommended', userId],
        queryFn: async () => {
            const recommended = await fetchRecommended(userId)
            return recommended
        },
        staleTime: 1000 * 60 * 10, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refet
    })
}