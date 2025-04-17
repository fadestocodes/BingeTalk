import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from './user'

export const createThread = async ( threadData ) => {
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
    return useQuery({
        queryKey : ['dialogues', threadId],
        queryFn : async () => {
            return fetchSingleThread(threadId)
        },
        staleTime : 0,
        refetchOnWindowFocus : true,
        refetchOnMount: true, 

    })
}


export const threadInteraction = async ( data ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/thread/interact`, {
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

export const getTrendingThreads = async (limit) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/thread/trending?limit=${limit}`)
        const response = await request.json();
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

            const request = await fetch(`${nodeServer.currentIP}/thread/trending/infinite?limit=${limit}&cursor=${cursor}&popular=${popular}`)
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
        getTrendingThreadsInfinite()
    }, [])

    const refetch = async () => {
        try {

            const request = await fetch(`${nodeServer.currentIP}/thread/trending/infinite?limit=${limit}&cursor=null&popular=${popular}`)
            const response = await request.json()
            setData(response.items)
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)
        } catch (err){
            console.log(err)
        }
        setLoading(false)
    }

    return { data, refetch , loading, hasMore, fetchMore : getTrendingThreadsInfinite }
}

export const useGetRecentThreads = (limit) => {
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore, setHasMore ] = useState(true)

    const getRecentThreads = async () => {
        if (!hasMore) return
        try {

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


    return { data, refetch, loading, hasMore, fetchMore:getRecentThreads }
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
    const { data : ownerUser, refetch:refetchOwner } = useFetchOwnerUser({email:clerkUser.emailAddresses[0].emailAddress})
    const [ interactedComments, setInteractedComments ] = useState({
        upvotes : [],
        downvotes : []
    })
    const [ commentsData, setCommentsData ] = useState([])
    const [ interactedCount, setInteractedCount ] = useState(null)


    const fetchThread = async () => {
        try {
            const response = await fetch(`${nodeServer.currentIP}/thread?threadId=${threadId}`);
            const fetchedThread = await response.json();
            const upvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedThread.comments.some( j => j.id === i.commentId && i.interactionType === 'UPVOTE' )
            } )
            const downvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedThread.comments.some( j => j.id === i.commentId && i.interactionType === 'DOWNVOTE' )
            } )
            setInteractedComments({
                upvotes : upvotedComments,
                downvotes : downvotedComments
            })

            setThread(fetchedThread)

            if (replyCommentId){
                const request = await fetch(`${nodeServer.currentIP}/comment?id=${replyCommentId}`)
                const replyCommentFromNotif = await request.json();

                const reorderedCommentsData = [
                    ...fetchedThread?.comments.filter( comment => comment.id === replyCommentFromNotif?.parentId || comment.id ===replyCommentFromNotif.id) ,
                    ...fetchedThread?.comments.filter( comment => comment.id !== replyCommentFromNotif?.parentId && comment.id !== replyCommentFromNotif?.id) 
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
       
            fetchThread();
    }, [ownerUser, threadId])

    const removeItem = (removeId, removePostType) => {
        if (removePostType === 'REPLY'){
            const filteredComments = commentsData.map( i => {

                if (i.replies.length > 0 && i.replies.some( x => x.id === Number(removeId))){
                    i.replies = i.replies.filter( reply => reply.id !== Number(removeId) )
                }
                return i
            } )
            setCommentsData(filteredComments)
        } else {
            const filteredCommments = commentsData.filter( i => i.id !== Number(removeId) )
            setCommentsData(filteredCommments)
        }
    }

    const refetch = async () => {
        // await refetchOwner()
        try {
            const response = await fetch(`${nodeServer.currentIP}/thread?threadId=${threadId}`);
            const fetchedThread = await response.json();
            const upvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedThread.comments.some( j => j.id === i.commentId && i.interactionType === 'UPVOTE' )
            } )
            const downvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedThread.comments.some( j => j.id === i.commentId && i.interactionType === 'DOWNVOTE' )
            } )
            setInteractedComments({
                upvotes : upvotedComments,
                downvotes : downvotedComments
            })

            setThread(fetchedThread)

            if (replyCommentId){
                const request = await fetch(`${nodeServer.currentIP}/comment?id=${replyCommentId}`)
                const replyCommentFromNotif = await request.json();

                const reorderedCommentsData = [
                    ...fetchedThread?.comments.filter( comment => comment.id === replyCommentFromNotif?.parentId || comment.id ===replyCommentFromNotif.id) ,
                    ...fetchedThread?.comments.filter( comment => comment.id !== replyCommentFromNotif?.parentId && comment.id !== replyCommentFromNotif?.id) 
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

    return { thread, isLoading, error, commentsData, setCommentsData, interactedComments, setInteractedComments, refetch, removeItem}
}
