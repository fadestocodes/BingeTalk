import { useState, useEffect } from "react"


import * as nodeServer from '../lib/ipaddresses'
import { apiFetch, useGetUser, useGetUserFull } from "./auth"


export const useFetchReview = (reviewId, replyCommentId) => {
    const [ review, setReview ] = useState('')

    const {user} = useGetUser()
    const {userFull:ownerUser, refetch:refetchOwner}= useGetUserFull(user?.id)
    
    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setEror ] = useState(null)
    const [ interactedComments, setInteractedComments ] = useState({
        upvotes : [],
        downvotes : []
    })
    const [ commentsData, setCommentsData ] = useState([])
    const [ interactedCount, setInteractedCount ] = useState(null)

    const fetchReview = async () => {
        try {
             const response = await fetch(`${nodeServer.currentIP}/review?id=${reviewId}`)
             const fetchedReview = await response.json()
             const upvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedReview.comments.some( j => j.id === i.commentId && i.interactionType === 'UPVOTE' )
            } )
            const downvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedReview.comments.some( j => j.id === i.commentId && i.interactionType === 'DOWNVOTE' )
            } )
            setInteractedComments({
                upvotes : upvotedComments,
                downvotes : downvotedComments
            })

            setReview(fetchedReview)

            if (replyCommentId){
                const request = await fetch(`${nodeServer.currentIP}/comment?id=${replyCommentId}`)
                const replyCommentFromNotif = await request.json();

                const reorderedCommentsData = [
                    ...fetchedReview?.comments.filter( comment => comment.id === replyCommentFromNotif?.parentId || comment.id === replyCommentFromNotif.id) ,
                    ...fetchedReview?.comments.filter( comment => comment.id !== replyCommentFromNotif?.parentId && comment.id !== replyCommentFromNotif?.id) 
                ]
                setCommentsData(reorderedCommentsData)
            } else {
                setCommentsData(fetchedReview.comments)
            }
        } catch (err) {
            console.log(err)
            setEror(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        fetchReview();
    }, [ownerUser, reviewId])

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
        await refetchOwner()
        try {
            const response = await fetch(`${nodeServer.currentIP}/review?id=${reviewId}`);
            const fetchedReview = await response.json();
            const upvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedReview.comments.some( j => j.id === i.commentId && i.interactionType === 'UPVOTE' )
            } )
            const downvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedReview.comments.some( j => j.id === i.commentId && i.interactionType === 'DOWNVOTE' )
            } )
            // setInteractedComments(interactedCommentsData)
            setInteractedComments({
                upvotes : upvotedComments,
                downvotes : downvotedComments
            })

            setReview(fetchedReview)

            if (replyCommentId){
                const request = await fetch(`${nodeServer.currentIP}/comment?id=${replyCommentId}`)
                const replyCommentFromNotif = await request.json();

                const reorderedCommentsData = [
                    ...fetchedReview?.comments.filter( comment => comment.id === replyCommentFromNotif?.parentId || comment.id === replyCommentFromNotif.id) ,
                    ...fetchedReview?.comments.filter( comment => comment.id !== replyCommentFromNotif?.parentId && comment.id !== replyCommentFromNotif?.id) 
                ]
                setCommentsData(reorderedCommentsData)
            }else {
                setCommentsData(fetchedReview.comments)
            }
        
        } catch (err) {
            console.log(err)
            setEror(err)
        } finally {
            setIsLoading(false)
        }
    }

    return { review, ownerUser, isLoading, error, commentsData, setCommentsData, interactedComments, setInteractedComments, refetch, removeItem}
 

}

export const reviewInteraction = async (data) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/review/interact`, {
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

export const deleteReview = async (params) => {
    try {
        const res = await apiFetch(`${nodeServer.currentIP}/review`, {
            method : 'DELETE', 
            headers : {
                "Content-type" : 'application/json'
            },
            body : JSON.stringify(params)
        })
        const data = await res.json()
        return data
    } catch (err){
        console.log(err)
    }
}

export const fetchTrendingReviews = async () => {
    try {
        const res = await fetch(`${nodeServer.currentIP}/review/trending`)
        if (res.ok){
            console.log("RES IS OKAYYY")
        }
        const data = await res.json()
        return data.data
    } catch (err) {
        console.log(err)
    }
}