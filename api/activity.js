import * as nodeServer from '../lib/ipaddresses'
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useFetchOwnerUser } from './user';


export const addActivity = async ( activityData ) => {
    try {
        const request = await fetch (`${nodeServer.currentIP}/activity/create`, {
            method : 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(activityData)
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}

export const likeActivity = async (data) => {
    try {
        const request = await fetch (`${nodeServer.currentIP}/activity/interact`, {
            method : 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body: JSON.stringify(data)
        })
        const response = await request.json();
        return response
    } catch (err){
        console.log(err)
        
    }
}

export const useFetchActivityId = (id, replyCommentId) => {
    const [ data, setData ] = useState(null)
    const [ loading, setLoading ] = useState(true);
    const { user : clerkUser }  = useUser()
    const { data : ownerUser } = useFetchOwnerUser({email:clerkUser.emailAddresses[0].emailAddress})
    const [ interactedComments, setInteractedComments ] = useState({
        upvotes : [],
        downvotes : []
    })
    const [ commentsData, setCommentsData ] = useState([])

    const fetchActivityId = async () => {
        try {   
            setLoading(true)
            const request = await fetch(`${nodeServer.currentIP}/activity?id=${id}`)
            const activity = await request.json();
            console.log('activity', activity)
            setData(activity);
            const upvotedComments = ownerUser.commentInteractions.filter( i => {
                return activity.commentsOnActivity.some( j => j.id === i.commentId && i.interactionType === 'UPVOTE' )
            } )
            const downvotedComments = ownerUser.commentInteractions.filter( i => {
                return activity.commentsOnActivity.some( j => j.id === i.commentId && i.interactionType === 'DOWNVOTE' )
            } )
            // setInteractedComments(interactedCommentsData)
            setInteractedComments(prev => ({
                ...prev,
                upvotes : upvotedComments,
                downvotes : downvotedComments
            }))
            if (replyCommentId){
                const request = await fetch(`${nodeServer.currentIP}/comment?id=${replyCommentId}`)
                const replyCommentFromNotif = await request.json();

                const reorderedCommentsData = [
                    ...activity?.commentsOnActivity.filter( comment => comment.id === replyCommentFromNotif?.parentId || comment.id === replyCommentFromNotif.id) ,
                    ...activity?.commentsOnActivity.filter( comment => comment.id !== replyCommentFromNotif?.parentId && comment.id !== replyCommentFromNotif?.id) 
                ]
                setCommentsData(reorderedCommentsData)
            }else {
                setCommentsData(activity.commentsOnActivity)
            }

        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    } 

    useEffect(()=>{
        fetchActivityId()
    }, [id])

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

    return { data, loading, refetch : fetchActivityId, removeItem, commentsData, interactedComments, setInteractedComments, setCommentsData }
}


export const activityInteraction = async ( data ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/activity/interact`, {
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