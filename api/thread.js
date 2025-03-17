import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

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


export const useGetTrendingThreadsInfinite = (limit, popular) => {
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore, setHasMore ] = useState(true)

    const getTrendingThreadsInfinite = async () => {
        if (!hasMore) return
        try {

            console.log('hello')
            const request = await fetch(`${nodeServer.currentIP}/thread/trending/infinite?limit=${limit}&cursor=${cursor}&popular=${popular}`)
            const response = await request.json()
            console.log('response from infinitethreads', response)
            setData(prev => [...prev, ...response.items])
            console.log('full data', data)
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)
        } catch (err){
            console.log(err)
        }
        setLoading(false)
    }


    useEffect(() => {
        getTrendingThreadsInfinite()
    }, [])


    return { data, refetch : getTrendingThreadsInfinite, loading, hasMore }
}

export const useGetRecentThreads = (limit) => {
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore, setHasMore ] = useState(true)

    const getRecentThreads = async () => {
        if (!hasMore) return
        try {

            console.log('hello')
            const request = await fetch(`${nodeServer.currentIP}/thread/recent/infinite?limit=${limit}&cursor=${cursor}`)
            const response = await request.json()
            setData(prev => [...prev, ...response.items])
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)
        } catch (err){
            console.log(err)
        }
        setLoading(false)
    }


    useEffect(() => {
        getRecentThreads()
    }, [])


    return { data, refetch : getRecentThreads, loading, hasMore }
}