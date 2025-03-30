import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from './user'

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
    // console.log('trying to use hook with ',threadId)
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
        // console.log('trending threads response', response)
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
            // console.log('response from infinitethreads', response)
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

    const refetch = async () => {
        try {

            console.log('hello')
            const request = await fetch(`${nodeServer.currentIP}/thread/trending/infinite?limit=${limit}&cursor=null&popular=${popular}`)
            const response = await request.json()
            setData(response.items)
            console.log('full data', data)
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)
        } catch (err){
            console.log(err)
        }
        setLoading(false)
    }

    return { data, refetch , loading, hasMore }
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

    const refetch = async () => {
        try {

            console.log('hello')
            const request = await fetch(`${nodeServer.currentIP}/thread/recent/infinite?limit=${limit}&cursor=null`)
            const response = await request.json()
            setData(response.items)
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)
        } catch (err){
            console.log(err)
        }
        setLoading(false)
    }


    return { data, refetch, loading, hasMore }
}



export const deleteThread = async (data) => {
    try {
        const response = await fetch(`${nodeServer.currentIP}/thread/delete`, {
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



export const useCustomFetchSingleThread = ( threadId, replyCommentId ) => {
    const [ thread, setThread ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setEror ] = useState(null)
    const { user : clerkUser }  = useUser()
    const { data : ownerUser } = useFetchOwnerUser({email:clerkUser.emailAddresses[0].emailAddress})
    const [ interactedComments, setInteractedComments ] = useState({
        upvotes : [],
        downvotes : []
    })
    const [ commentsData, setCommentsData ] = useState([])
    const [ interactedCount, setInteractedCount ] = useState(null)

    console.log('Initial render of component, threadId:', threadId);

    const fetchThread = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${nodeServer.currentIP}/thread?threadId=${threadId}`);
            const fetchedThread = await response.json();
            const upvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedThread.comments.some( j => j.id === i.commentId && i.interactionType === 'UPVOTE' )
            } )
            const downvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedThread.comments.some( j => j.id === i.commentId && i.interactionType === 'DOWNVOTE' )
            } )
            // setInteractedComments(interactedCommentsData)
            setInteractedComments(prev => ({
                ...prev,
                upvotes : upvotedComments,
                downvotes : downvotedComments
            }))

            setThread(fetchedThread)

            if (replyCommentId){
                const request = await fetch(`${nodeServer.currentIP}/comment?id=${replyCommentId}`)
                const replyCommentFromNotif = await request.json();

                const reorderedCommentsData = [
                    ...fetchedThread?.comments.filter( comment => comment.id === replyCommentFromNotif?.parentId || comment.id ===replyCommentFromNotif.id) ,
                    ...fetchedThread?.comments.filter( comment => comment.id !== replyCommentFromNotif?.parentId) 
                ]
                setCommentsData(reorderedCommentsData)
            }else {
                setCommentsData(fetchedThread.comments)
            }
          
        } catch (err) {
            console.log(err)
            setEror(err)
        } finally {
            setIsLoading(false)
        }
    } 

    useEffect(()=>{
       
        console.log('triggerd from useEffect')
            fetchThread();
    }, [])

    return { thread, isLoading, error, commentsData, setCommentsData, interactedComments, setInteractedComments, refetch: fetchThread}
}
