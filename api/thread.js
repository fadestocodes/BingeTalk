import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query'

export const createThread = async ( threadData ) => {
    console.log('threadData', threadData)
    try {
        const request = await fetch(`${nodeServer.currentIP}/thread/create`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify( threadData )
        })
        const response = await request.json()
        return response
    } catch (err) {
        console.log(err)
    }
}

export const fetchSingleThread = async (threadId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/thread?threadId=${threadId}`)
        const response = await request.json()
        return response
    } catch (err) {
        console.log(err)
    }
}


export const useFetchSingleThread = ( threadId ) => {
    console.log('trying to use hook with ',threadId)
    return useQuery({
        queryKey : ['dialogues', threadId],
        queryFn : async () => {
            return fetchSingleThread(threadId)
        },
        // staleTime : 1000 * 60 * 30,
        staleTime : 0,
        refetchOnWindowFocus : true,
        refetchOnMount: true, 

    })
}


export const threadInteraction = async ( data ) => {
    console.log('trying to create thread interaction')
    try {
        const request = await fetch(`${nodeServer.currentIP}/thread/interact`, {
            method : 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body:JSON.stringify( data )
        })
        const response = await request.json();
        console.log('updated thread', response)
        return response
    } catch (err) {
        console.log(err)
    }
} 

export const getTrendingThreads = async (limit) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/thread/trending?limit=${limit}`)
        const response = await request.json();
        console.log('trending threads response', response)
        return response
    } catch (err) {
        console.log(err)
    }
}