import * as nodeServer from '../lib/ipaddresses'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SignOutButton, useAuth, useUser } from '@clerk/clerk-react'
import React, {useState,useEffect} from 'react';
import { useFetchOwnerUser } from './user';



export const createDialogue = async ( postData ) => {

    try {
        const request = await fetch (`${nodeServer.currentIP}/dialogue/create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( {postData} )
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}


export const fetchDialogues = async ( userId ) => {
    try {
        const request = await fetch (`${nodeServer.currentIP}/dialogue/fetch-all?id=${userId}`);
        const response = await request.json();

        return response
    } catch (err) {
        console.log(err)
    }
}

export const useFetchDialogues = ( userId ) => {


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
    try {
        const request = await fetch(`${nodeServer.currentIP}/dialogue?id=${dialogueId}`);
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}

export const useFetchSingleDialogue = ( dialogueId ) => {
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

export const useCustomFetchSingleDialogue = ( dialogueId, replyCommentId ) => {
    const [ dialogue, setDialogue ] = useState(null);
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


    const fetchDialogue = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${nodeServer.currentIP}/dialogue?id=${dialogueId}`);
            const fetchedDialogue = await response.json();
            const upvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedDialogue.comments.some( j => j.id === i.commentId && i.interactionType === 'UPVOTE' )
            } )
            const downvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedDialogue.comments.some( j => j.id === i.commentId && i.interactionType === 'DOWNVOTE' )
            } )
            // setInteractedComments(interactedCommentsData)
            setInteractedComments(prev => ({
                ...prev,
                upvotes : upvotedComments,
                downvotes : downvotedComments
            }))

            setDialogue(fetchedDialogue)

            if (replyCommentId){
                const request = await fetch(`${nodeServer.currentIP}/comment?id=${replyCommentId}`)
                const replyCommentFromNotif = await request.json();

                const reorderedCommentsData = [
                    ...fetchedDialogue?.comments.filter( comment => comment.id === replyCommentFromNotif?.parentId || comment.id === replyCommentFromNotif.id) ,
                    ...fetchedDialogue?.comments.filter( comment => comment.id !== replyCommentFromNotif?.parentId) 
                ]
                setCommentsData(reorderedCommentsData)
            }else {
                setCommentsData(fetchedDialogue.comments)
            }
          
        } catch (err) {
            console.log(err)
            setEror(err)
        } finally {
            setIsLoading(false)
        }
    } 

    useEffect(()=>{
       
            fetchDialogue();
    }, [])

    return { dialogue, isLoading, error, commentsData, setCommentsData, interactedComments, setInteractedComments, refetch: fetchDialogue}
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

            const request = await fetch(`${nodeServer.currentIP}/dialogue/trending/infinite?limit=${limit}&cursor=${cursor}&popular=${popular}`)
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
        getTrendingDialoguesInfinite()
    }, [])

    const refetch = async () => {
        try {

            const request = await fetch(`${nodeServer.currentIP}/dialogue/trending/infinite?limit=${limit}&cursor=null&popular=${popular}`)
            const response = await request.json()
            setData(response.items)
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)
        } catch (err){
            console.log(err)
        }
        setLoading(false)
    }


    return { data, refetch, loading, hasMore, fetchMore:getTrendingDialoguesInfinite }
}

export const useGetRecentDialoguesInfinite = (limit) => {
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore, setHasMore ] = useState(true)

    const getRecentDialoguesInfinite = async () => {
        if (!hasMore) return
        try {

            const request = await fetch(`${nodeServer.currentIP}/dialogue/recent/infinite?limit=${limit}&cursor=${cursor}`)
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
        getRecentDialoguesInfinite()
    }, [])

    const refetch = async () => {
        try {

            const request = await fetch(`${nodeServer.currentIP}/dialogue/recent/infinite?limit=${limit}&cursor=null`)
            const response = await request.json()
            setData(response.items)
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)
        } catch (err){
            console.log(err)
        }
        setLoading(false)
    }


    return { data, refetch , loading, hasMore , fetchMore:getRecentDialoguesInfinite}
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