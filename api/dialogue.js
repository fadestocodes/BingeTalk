import * as nodeServer from '../lib/ipaddresses'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SignOutButton, useAuth } from '@clerk/clerk-react'
import React, {useState,useEffect} from 'react';



export const createDialogue = async ( postData ) => {
    console.log('hello')
    // const queryClient = useQueryClient(); // Get query client
    console.log('post data for createdialogue', postData)

    try {
        console.log('trying to createDialogue')
        const request = await fetch (`${nodeServer.currentIP}/dialogue/create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( {postData} )
        })
        const response = await request.json();
        console.log('response', response)           
        // queryClient.invalidateQueries(['dialogues']);

        return response
    } catch (err) {
        console.log(err)
    }
}

// export const fetchDialogues = async ( token ) => {
//     try {
//         console.log('trying to fetch');
//         const request = await fetch (`${nodeServer.currentIP}/dialogue/fetch-all`, {
//             method : 'GET',
//             headers : {
//                 'Content-type' : 'application/json',
//                 'Authorization' : `Bearer ${token}`
//             }
//         });
//         const response = await request.json();

//         console.log('resposne ', response)
//         return response.dialogues
//     } catch (err) {
//         console.log(err)
//     }
// }

// export const fetchDialogues = async ( token ) => {
//     try {
//         console.log('trying to fetch');
//         const request = await fetch (`${nodeServer.currentIP}/dialogue/fetch-all`, {
//             method : 'GET',
//             headers : {
//                 'Content-type' : 'application/json',
//                 'Authorization' : `Bearer ${token}`
//             }
//         });
//         const response = await request.json();

//         console.log('resposne ', response)
//         return response.dialogues
//     } catch (err) {
//         console.log(err)
//     }
// }

export const fetchDialogues = async ( userId ) => {
    try {
        console.log('trying to fetch dialogues');
        console.log('userId', userId)
        const request = await fetch (`${nodeServer.currentIP}/dialogue/fetch-all?id=${userId}`);
        const response = await request.json();

        return response
    } catch (err) {
        console.log(err)
    }
}

export const useFetchDialogues = ( userId ) => {

    // const queryClient = useQueryClient(); // Get query client

    return useQuery({
        queryKey: ['dialogues', userId],
        queryFn: async () => {
            return fetchDialogues(userId);
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}

export const fetchSingleDialogue =  async( dialogueId ) => {
    console.log('trying to fethc single dialogue')
    try {
        const request = await fetch(`${nodeServer.currentIP}/dialogue?id=${dialogueId}`);
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}

export const useFetchSingleDialogue = ( dialogueId ) => {
    // console.log('trying to use hook with ',dialogueId)
    return useQuery({
        queryKey : ['dialogues', dialogueId],
        queryFn : async () => {
            return fetchSingleDialogue(dialogueId)
        },
        // staleTime : 1000 * 60 * 30,
        staleTime : 0,
        refetchOnWindowFocus : true,
        refetchOnMount: true, 

    })
}

export const useCustomFetchSingleDialogue = ( dialogueId ) => {
    const [ dialogue, setDialogue ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setEror ] = useState(null)

    console.log('Initial render of component, dialogueId:', dialogueId);

    useEffect(()=>{
       
        console.log('triggerd from useEffect')
        const fetchDialogue = async () => {
            try {
                setIsLoading(true)
                const fetchedDialogue = await fetchSingleDialogue(dialogueId);
                setDialogue(fetchedDialogue)
            } catch (err) {
                console.log(err)
                setEror(err)
            } finally {
                setIsLoading(false)
            }
        } 
            fetchDialogue();
    }, [])

    return { dialogue, isLoading, error }
}

export const dialogueInteraction = async ( data ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/dialogue/interact`, {
            method : 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body:JSON.stringify( data )
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
} 

export const getTrendingDialogues = async (limit) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/dialogue/trending?limit=${limit}`)
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}

export const useGetTrendingDialoguesInfinite = (limit, popular) => {
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore, setHasMore ] = useState(true)

    const getTrendingDialoguesInfinite = async () => {
        if (!hasMore) return
        try {

            console.log('hello')
            const request = await fetch(`${nodeServer.currentIP}/dialogue/trending/infinite?limit=${limit}&cursor=${cursor}&popular=${popular}`)
            const response = await request.json()
            // console.log('response from infinitedialogues', response)
            setData(prev => [...prev, ...response.items])
            // console.log('full data', data)
            console.log(response.nextCursor )
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)
        } catch (err){
            console.log(err)
        }
        setLoading(false)
    }


    useEffect(() => {
        getTrendingDialoguesInfinite()
    }, [])


    return { data, refetch : getTrendingDialoguesInfinite, loading, hasMore }
}

export const useGetRecentDialoguesInfinite = (limit) => {
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore, setHasMore ] = useState(true)

    const getRecentDialoguesInfinite = async () => {
        if (!hasMore) return
        try {

            console.log('hello')
            const request = await fetch(`${nodeServer.currentIP}/dialogue/recent/infinite?limit=${limit}&cursor=${cursor}`)
            const response = await request.json()
            setData(prev => [...prev, ...response.items])
            console.log(response.nextCursor )
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)
        } catch (err){
            console.log(err)
        }
        setLoading(false)
    }


    useEffect(() => {
        getRecentDialoguesInfinite()
    }, [])


    return { data, refetch : getRecentDialoguesInfinite, loading, hasMore }
}

export const deleteDialogue = async (data) => {
    try {
        const response = await fetch(`${nodeServer.currentIP}/dialogue/delete`, {
            method:'POST',
            headers:{
                'Content-type': 'application/json'
            },
            body:JSON.stringify(data)
        })
        const result = await response.json()
        return result
    } catch(err){
        console.log(err)
    }
}