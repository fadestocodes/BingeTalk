import { apiFetch, useGetUser, useGetUserFull } from "./auth"
import * as nodeServer from '../lib/ipaddresses'
import { useEffect, useState } from "react"

export const createSetDay = async (data) => {
    try {
        const res = await apiFetch(`${nodeServer.currentIP}/set-days`, {
            method : "POST",
            headers : {'Content-type' : 'application/json'},
            body : JSON.stringify(data)
        })
        const resData = await res.json()
        if (!res.ok) throw new Error(resData?.error || "Request failed")
        return {success : true, data : resData, message : "Successfully posted your SetDay"}
    } catch (err){
        console.error(err)
        return {success : false, message : err?.message || "Couldn't post your SetDay"}
    }
}

export const useGetSetDayGraph = (userId) => {
    const [ data, setData ] = useState('')
    const [loading, setLoading] = useState(true)

    const getSetDayGraph = async () => {
        try {
            if (!userId) return
            setLoading(true)
            const res = await fetch(`${nodeServer.currentIP}/set-days/graph?userId=${userId}`)
            const resData = await res.json()
            if (!res.ok) throw new Error (resData?.error || "Invalid request")
            setData(resData)
            
        } catch (err){
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        getSetDayGraph()
    }, [userId])

    return { data, loading, refetch: getSetDayGraph }
}

export const useGetSetDaysInfinite = (userId, limit=15) => {
    const [ data, setData ] = useState([])
    const [loading, setLoading] = useState(true)
    const [cursor, setCursor] = useState(null)
    const [hasMore, setHasMore] = useState(true)

    const getSetDaysInfinite = async () => {
        try {   
            if (!hasMore) return
            if (!userId) return
            setLoading(true)
            const res =  await fetch(`${nodeServer.currentIP}/set-days/infinite?userId=${userId}&cursor=${cursor}&limit=${limit}`)
            const resData = await res.json()
            setData(prev => [...prev, ...resData.items])
            setCursor(resData.nextCursor)
            setHasMore(!!resData.nextCursor)
        } catch (err){
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    
    const getSetDays = async () => {
        try {   
            setLoading(true)
            if (!userId) return
            const res =  await fetch(`${nodeServer.currentIP}/set-days/infinite?userId=${userId}&cursor=null&limit=${limit}`)
            const resData = await res.json()
            setData(resData.items)
            setCursor(resData.nextCursor)
            setHasMore(!!resData.nextCursor)
        } catch (err){
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSetDays()
    }, [userId])

    return { data, loading, refetch: getSetDays, fetchMore:getSetDaysInfinite, hasMore }
}


export const useGetSetDay = (id, replyCommentId=null) => {
    const [data, setData] = useState('')
    const [loading, setLoading] = useState(true)
    const {user} = useGetUser()
    const {userFull:ownerUser, refetch:refetchUserFull} = useGetUserFull(user?.id)
    const [ interactedComments, setInteractedComments ] = useState({
        upvotes : [],
        downvotes : []
    })
    const [ commentsData, setCommentsData ] = useState([])

    const getSetDay = async () => {
        try {
            if (!id) return
            setLoading(true)
            const res = await fetch(`${nodeServer.currentIP}/set-days/${id}`)
            const resData = await res.json()
            if (!res.ok) throw new Error(resData?.error || "Invalid request")
            setData(resData)

            const upvotedComments = ownerUser?.commentInteractions.filter( i => {
                return resData?.comment.some( j => j.id === i.commentId && i.interactionType === 'UPVOTE' )
            } )
            const downvotedComments = ownerUser?.commentInteractions.filter( i => {
                return resData?.comment.some( j => j.id === i.commentId && i.interactionType === 'DOWNVOTE' )
            } )

            setInteractedComments( {
                upvotes : upvotedComments,
                downvotes : downvotedComments
            })
            if (replyCommentId){
                const request = await apiFetch(`${nodeServer.currentIP}/comment?id=${replyCommentId}`)
                const replyCommentFromNotif = await request.json();

                const reorderedCommentsData = [
                    ...resData?.comment.filter( comment => comment.id === replyCommentFromNotif?.parentId || comment.id === replyCommentFromNotif.id) ,
                    ...resData?.comment.filter( comment => comment.id !== replyCommentFromNotif?.parentId && comment.id !== replyCommentFromNotif?.id) 
                ]
                setCommentsData(reorderedCommentsData)
            }else {
                setCommentsData(resData?.comment)
            }
            
        } catch(err){
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSetDay()
    }, [id, ownerUser])

    const refetch = async () => {
        await refetchUserFull()
        await getSetDay()
    }

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

    return {data, loading, refetch, commentsData, interactedComments, setInteractedComments, setCommentsData, removeItem}
}


export const setDayInteraction = async ( data ) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/set-days/interact`, {
            method : 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body:JSON.stringify( data )
        })
        const response = await request.json();
        console.log('response...',response)
        return response
    } catch (err) {
        console.log(err)
    }
} 