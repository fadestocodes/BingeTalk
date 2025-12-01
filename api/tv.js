import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { apiFetch } from './auth';

export const fetchTVMentions = async (tvId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/tv/mentions?tvId=${tvId}`)
        const response = await request.json();
        return response

    } catch (err) {
        console.log(err)
    }
}


export const useFetchTVMentions = ( tvId ) => {

    // const queryClient = useQueryClient(); // Get query client

    return useQuery({
        queryKey: ['tvMentions', tvId],
        queryFn: async () => {
            return fetchTVMentions(tvId);
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}


export const fetchTVThreads = async ( data ) => {
    const { tvId, tvObj } = data
    try {
        const request = await fetch(`${nodeServer.currentIP}/tv/threads?tvId=${tvId}`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( {tvObj} )
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}


export const useFetchTVThreads = ( data ) => {

    return useQuery({
        queryKey: ['tvThreads', tvObj.id],
        queryFn: async () => {
            return fetchTVThreads(data);
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}

export const fetchTVFromDB = async ( {tvData} ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/tv/find-or-create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( {tvData} )
        })
        const response = await request.json();
        return response;
    } catch (err) {

        console.log(err)
    }
}


export const useFetchTVFromDB = (  tvData ) => {

    // const queryClient = useQueryClient(); // Get query client


    return useQuery({
        queryKey: ['tvFromDB', tvData.id],
        queryFn: async () => {
            return fetchTVFromDB({tvData});
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}


export const getTVThreads = async (tvId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/tv/threads?tvId=${tvId}`)
        const response = await request.json()
        return response
    } catch(err){
        console.log(err)
    }
}

export const useGetTVThreads = (  tvId ) => {

    // const queryClient = useQueryClient(); // Get query client


    return useQuery({
        queryKey: ['threads',tvId],
        queryFn: async () => {
            return getTVThreads(tvId);
        },
        staleTime: 0, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}


export const markTVWatch =  async ( data ) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/tv/update-hasWatched`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json();
        console.log('tv watch response', response)
        return response
    } catch (err) {
        console.log(err)
    }
}

export const markTVInterested =  async ( data ) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/tv/update-interested`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}

export const markTVCurrentlyWatching =  async ( data ) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/tv/update-currentlyWatching`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}

export const markTVWatchlist =  async ( data ) => {
    try {

        if (!data.tvId || !data.userId) throw new Error("Invalid params")
        const request = await apiFetch(`${nodeServer.currentIP}/tv/update-watchlist`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}


export const useGetTVFromDB = ( DBtvId ) => {

    const [ tv, setTv ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    const getTVFromDB = async () => {
        setLoading(true)
        try {
            const request = await fetch(`${nodeServer.currentIP}/tv?DBtvId=${DBtvId}`)
            const response = await request.json()
            setTv(response)
        } catch (err){
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTVFromDB()
    },[DBtvId])

    return { tv, loading }

}


export const swipeTVInterested = async (data) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/tv/interested/swipe`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json()

        if (response.status === 201){
            return 
        }
        return response
    } catch (Err){
        console.log(Err)
    }

}