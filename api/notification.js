import { useUser } from '@clerk/clerk-expo';
import * as nodeServer from '../lib/ipaddresses'
import { useState, useEffect } from 'react'
import { useFetchOwnerUser } from './user';


export const useGetAllNotifs = (recipientId, limit, fetchAll=false) => {
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(true);
    const [ hasMore , setHasMore ] = useState(true);
    const [ cursor, setCursor ] = useState(null)
    const [ isFollowingIds, setIsFollowingIds ] = useState([])
    const { user:clerkUser } = useUser()
    const { data : ownerUser } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })
    const [ unreadIds, setUnreadIds ] = useState([])

    const getAllNotifs = async () => {
        if (!hasMore) return
        try {
            console.log('hello')
            const notifications = await fetch(`${nodeServer.currentIP}/notifications?notificationRecipientId=${recipientId}&cursor=${cursor}&limit=${limit}&fetchAll=${fetchAll}`)
            const response = await notifications.json();
            setData(prev => [...prev, ...response.items])
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)

            const isFollowingId = response.items.filter( notif => ownerUser.following.some( f =>  f.followerId === notif.userId ) ).map( element => element.userId );
            setIsFollowingIds(prev=> [...prev, ...isFollowingId])
            const unreadIds = response.items.filter( notif => notif.isRead === false ).map(i => i.id)
            // console.log('unreadIds', unreadIds)
            setUnreadIds( prev => [ ...prev, ...unreadIds ] )

            

            
        } catch (Err){
            console.log(Err)
        }
        setLoading(false)
    }

    useEffect(() => {
        getAllNotifs()
    }, [recipientId])

    

    

    return { data, loading, hasMore, refetch :getAllNotifs , isFollowingIds, setIsFollowingIds, unreadIds, setUnreadIds}
}

export const getAllNotifs = async (recipientId, limit, fetchAll) => {
    try {
        console.log('hello')
        const notifications = await fetch(`${nodeServer.currentIP}/notifications?notificationRecipientId=${recipientId}&cursor=null&limit=${limit}&fetchAll=${fetchAll}`)
        const response = await notifications.json();
        return response
        
    } catch (Err){
        console.log(Err)
    }
}

export const markNotifRead = async (data) => {
    try {
        console.log('data', data)
        const request = await fetch(`${nodeServer.currentIP}/notifications/mark-read`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({data})
        })
        const result = await request.json();
        console.log('response', result)
        
    } catch (err){
        console.log('Error trying to mark notifications as read')
    }
}

export const postPushToken = async (token) => {
    try {
        console.log('trying to sasve token', token)
        const response = await fetch(`${nodeServer.currentIP}/notifications/save-push-token`,{
            method : 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(token)
        })

        console.log('response', response)
        const result = await response.json()
        console.log('results from sending push token', result)
        return result
    } catch (err){
        console.log(err)
    }
}