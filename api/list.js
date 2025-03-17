import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

export const createList = async (postData) => {
    
    try { 
        const request = await fetch (`${nodeServer.currentIP}/list/create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(postData)
        })
        const response = await request.json();
        return response;
    } catch (err) {
        console.log(err)
    }
}

export const addToList = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/list/add-to-list`, {
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
        return err
    }
}

export const fetchUsersLists = async ( userId ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/list/user?userId=${userId}`)
        const response = await request.json()
        // console.log('Fetched users lists', response)
        return response
    } catch (err) {
        console.log(err)
    }
}



export const useFetchUsersLists = ( userId ) => {
    return useQuery({
        queryKey : ['lists', userId],
        queryFn : async () => {
            return fetchUsersLists(userId)
        },
        staleTime : 1000 * 60 * 30,
        refetchOnWindowFocus : true,
        refetchOnMount: true, 

    })
}

export const useFetchUsersListsInfinite = (userId, limit) => {
    const [ data, setData ] = useState([]);
    const [ cursor, setCursor ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ hasMore, setHasMore ] = useState(true)

    const fetchUsersListsInfinite = async () => {
        if(!hasMore) return
        try {
            const response = await fetch(`${nodeServer.currentIP}/list/infinite?userId=${userId}&limit=${limit}&cursor=${cursor}`)
            const results = await response.json()
            setData(prev => [...prev, ...results.items])
            setCursor(results.nextCursor)
            setHasMore(!!results.nextCursor)
        } catch (err){
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsersListsInfinite()
    }, [])

    return { data, loading, hasMore, refetch: fetchUsersListsInfinite }
 }


export const listInteraction = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/list/interact`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json()
        return response
    } catch (err) {
        console.log(err)
    }
}

export const fetchSpecificList = async (listId) => {
    try {
        const request = await fetch (`${nodeServer.currentIP}/list?listId=${listId}`)
        const response = await request.json();
        // console.log('fetched list ', response)
        return response
    } catch (err) {
        console.log(err)
    }
}

export const useFetchSpecificList = ( listId ) => {
    return useQuery({
        queryKey : ['lists', listId],
        queryFn : async () => {
            return fetchSpecificList(listId)
        },
        staleTime : 1000 * 60 * 30,
        refetchOnWindowFocus : true,
        refetchOnMount: true, 

    })
}

export const getTrendingLists = async (limit) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/list/trending?limit=${limit}`)
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}

export const useGetTrendingLists = (limit) => {
    const [ trendingList, setTrendingList ] = useState([])
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore, setHasMore ] = useState(true)
    const [ loading, setLoading ] = useState(false)
    const getTrendingLists = async (limit) => {
        if (!hasMore) return 
        setLoading(true)
        try {
            const request = await fetch(`${nodeServer.currentIP}/list/trending?cursor=${cursor}&limit=${limit}`)
            const response = await request.json();
            setTrendingList(prev => [...prev, ...response.items]);
            setCursor(response.nextCursor)
            setHasMore( !!response.nextCursor )
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTrendingLists(limit)
    },[])

    const refetch = () => {
        getTrendingLists(5);
    }
    
    return { trendingList, loading, refetch , hasMore }
}

export const useGetRecentLists = (limit) => {
    const [ recentLists, setRecentLists ] = useState([])
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore, setHasMore ] = useState(true)
    const [ loading, setLoading ] = useState(false)

    const getRecentLists = async (limit) => {
        if (!hasMore) return
        setLoading(true)
        try {
            const request = await fetch(`${nodeServer.currentIP}/list/most-recent?cursor=${cursor}&limit=${limit}`)
            const response = await request.json();
            console.log('respone from recent lists', response)
            setRecentLists(prev => [...prev, ...response.items]);
            setCursor(response.nextCursor)
            setHasMore( !!response.nextCursor )
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getRecentLists(limit)
    },[])

    const refetch = () => {
        getRecentLists(5);
    }
    
    return { recentLists, loading, refetch, hasMore  }
}