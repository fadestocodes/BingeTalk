import { useEffect, useState } from 'react';
import * as nodeServer from '../lib/ipaddresses'
import { findDirector } from './tmdb';

import { useFetchOwnerUser } from './user';
import { useGetUser, useGetUserFull } from './auth';

export const newRecommendation = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/recommend-to-friend`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json();
        return response
    } catch (err){
        console.log(err)
    }
}

export const mySentRecommendations = async (userId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/`)
    } catch (err){
        console.log(err)
        
    }
}

export const deleteRecommendation = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/recommendation/delete`, {
            method : 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body:JSON.stringify(data)
        })
        const response = await request.json()
        console.log(response)
        return response
    } catch (Err) {
        console.log(Err)
    }
}

export const useGetRecommendation =  (params, replyCommentId) => {
    
    const {user} = useGetUser()
    const {userFull:ownerUser, refetch:refetchOwner}= useGetUserFull(user?.id)
    
    const [ recommendation, setRecommendation ] = useState('')
    const [ loading, setLoading ] = useState(true)
    const { id , userId } = params
    const [ commentsData, setCommentsData ] = useState([])
    const [ interactedComments, setInteractedComments ] = useState({
        upvotes : [],
        downvotes : []
    })
    const [ didOwnerSend, setDidOwnerSend ] = useState(null)
    const [ director, setDirector ] = useState('')
    const [ ratings, setRatings ] = useState([])


    
    const getRecommendation = async () => {
        try {
            const response = await fetch(`${nodeServer.currentIP}/recommendation?id=${id}&userId=${userId}`)
            const data = await response.json()
            setRecommendation(data)
            const ownerSent = Number(userId) === data.recommender.id
            setDidOwnerSend(ownerSent)

            const upvotedComments = ownerUser.commentInteractions.filter( i => {
                return data.comments.some( j => j.id === i.commentId && i.interactionType === 'UPVOTE' )
            } )
            const downvotedComments = ownerUser.commentInteractions.filter( i => {
                return data.comments.some( j => j.id === i.commentId && i.interactionType === 'DOWNVOTE' )
            } )
            // setInteractedComments(interactedCommentsData)
            setInteractedComments({
                upvotes : upvotedComments,
                downvotes : downvotedComments
            })
            
            if (replyCommentId){
                const commentResponse = await fetch(`${nodeServer.currentIP}/comment?id=${replyCommentId}`)
                const replyCommentFromNotif = await commentResponse.json();
                
                const reorderedCommentsData = [
                    ...data?.comments.filter( comment => comment.id === replyCommentFromNotif?.parentId || comment.id === replyCommentFromNotif.id) ,
                    ...data?.comments.filter( comment => comment.id !== replyCommentFromNotif?.parentId && comment.id !== replyCommentFromNotif?.id) 
                ]
                setCommentsData(reorderedCommentsData)
            }else {
                setCommentsData(data.comments)
            }
            
            let type
            let tmdbId
            let ratings

            if ( data.movie ){
                type = 'MOVIE'
                tmdbId = data.movie.tmdbId
                ratings = data.movie.ratings.length > 0 && data.movie.ratings
            } else if (data.tv){
                type = 'TV'
                tmdbId = data.tv.tmdbId
                ratings = data.tv.ratings.length > 0 && data.tv.ratings
            }
            const directorParams = {
                type,
                tmdbId
            }
            const foundDirector = await findDirector(directorParams)
            setDirector(foundDirector)

            const totalOverallRatings = ratings ? ratings.reduce((sum,rating) => sum + rating.rating, 0) : null
            const overallRatings = ratings.length > 0 ? (totalOverallRatings / ratings.length).toFixed(1) : 'N/A'
            setRatings(overallRatings)            


        } catch (err){
            console.log(err)
        }


        setLoading(false)

    }
    useEffect(() => {
        getRecommendation()
    }, [ownerUser])

    const refetch = async () => {

        await refetchOwner()
        try {
            const response = await fetch(`${nodeServer.currentIP}/recommendation?id=${id}&userId=${userId}`)
            const data = await response.json()
            setRecommendation(data)
            const ownerSent = Number(userId) === data.recommender.id
            setDidOwnerSend(ownerSent)

            const upvotedComments = ownerUser.commentInteractions.filter( i => {
                return data.comments.some( j => j.id === i.commentId && i.interactionType === 'UPVOTE' )
            } )
            const downvotedComments = ownerUser.commentInteractions.filter( i => {
                return data.comments.some( j => j.id === i.commentId && i.interactionType === 'DOWNVOTE' )
            } )
            // setInteractedComments(interactedCommentsData)
            setInteractedComments({
                upvotes : upvotedComments,
                downvotes : downvotedComments
            })
            
            if (replyCommentId){
                const commentResponse = await fetch(`${nodeServer.currentIP}/comment?id=${replyCommentId}`)
                const replyCommentFromNotif = await commentResponse.json();
                
                const reorderedCommentsData = [
                    ...data?.comments.filter( comment => comment.id === replyCommentFromNotif?.parentId || comment.id === replyCommentFromNotif.id) ,
                    ...data?.comments.filter( comment => comment.id !== replyCommentFromNotif?.parentId && comment.id !== replyCommentFromNotif?.id) 
                ]
                setCommentsData(reorderedCommentsData)
            }else {
                setCommentsData(data.comments)
            }
            
            let type
            let tmdbId
            let ratings

            if ( data.movie ){
                type = 'MOVIE'
                tmdbId = data.movie.tmdbId
                ratings = data.movie.ratings.length > 0 && data.movie.ratings
            } else if (data.tv){
                type = 'TV'
                tmdbId = data.tv.tmdbId
                ratings = data.tv.ratings.length > 0 && data.tv.ratings
            }
            const directorParams = {
                type,
                tmdbId
            }
            const foundDirector = await findDirector(directorParams)
            setDirector(foundDirector)

            const totalOverallRatings = ratings ? ratings.reduce((sum,rating) => sum + rating.rating, 0) : null
            const overallRatings = ratings.length > 0 ? (totalOverallRatings / ratings.length).toFixed(1) : 'N/A'
            setRatings(overallRatings)            


        } catch (err){
            console.log(err)
        }


        setLoading(false)
    }

    return { recommendation, ownerUser, refetch , loading, commentsData, director, ratings, interactedComments, setCommentsData, setInteractedComments, didOwnerSend }
}

export const acceptRecommendation = async (data) => {
    try {
        if (!data.userId || !data.recommenderId || !data.recommendationId || !data.type) throw new Error("Invalid params")
        const {userId, recommendationId} = data

        const response = await fetch(`${nodeServer.currentIP}/recommendation/${recommendationId}`, {
            method : 'PATCH',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        if (!response.ok) throw new Error("Unexpected error")
        const result = await response.json()
    

    } catch(err){
        console.error(err)
    }
}