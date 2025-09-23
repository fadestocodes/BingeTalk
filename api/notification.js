import { useUser } from '@clerk/clerk-expo';
import * as nodeServer from '../lib/ipaddresses'
import { useState, useEffect } from 'react'
import { useFetchOwnerUser } from './user';
import { useNotificationCountContext } from '@/lib/NotificationCountContext';


export const useGetAllNotifs = (recipientId, limit, fetchAll=false) => {
    const [ data, setData ] = useState([])
    const [ readNotifs, setReadNotifs ] = useState([])
    const [ unreadNotifs, setUnreadNotifs ] = useState([])
    const [ loading, setLoading ] = useState(true);
    const [ hasMore , setHasMore ] = useState(true);
    const [ cursor, setCursor ] = useState(null)
    const [ isFollowingIds, setIsFollowingIds ] = useState([])
    const { user:clerkUser } = useUser()
    const { data : ownerUser } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })
    const [ unreadIds, setUnreadIds ] = useState([])

    const getAllNotifs = async () => {
        if (!hasMore || !ownerUser) return
        try {
            const notifications = await fetch(`${nodeServer.currentIP}/notifications?notificationRecipientId=${recipientId}&cursor=${cursor}&limit=${limit}&fetchAll=${fetchAll}`)
            const response = await notifications.json();
            setData(prev => [...prev, ...response.items])
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)

            const isFollowingId = response.items.filter( notif => ownerUser.following.some( f =>  f.followerId === notif.userId ) ).map( element => element.userId );
            setIsFollowingIds(prev=> [...prev, ...isFollowingId])
            const unreadIds = response.items.filter( notif => notif.isRead === false ).map(i => i.id)
            setUnreadIds( prev => [ ...prev, ...unreadIds ] )
            

            
        } catch (Err){
            console.log(Err)
        }
        setLoading(false)
    }

    useEffect(() => {
        getAllNotifs()
    }, [recipientId])


    const refetch = async () => {
        try {
            const notifications = await fetch(`${nodeServer.currentIP}/notifications?notificationRecipientId=${recipientId}&cursor=null&limit=${limit}&fetchAll=${fetchAll}`)
            const response = await notifications.json();
            setData(response.items)

            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)

            const isFollowingId = response.items.filter( notif => ownerUser.following.some( f =>  f.followerId === notif.userId ) ).map( element => element.userId );
            setIsFollowingIds(isFollowingId)
            const unreadIds = response.items.filter( notif => notif.isRead === false ).map(i => i.id)
            setUnreadIds( unreadIds  )
            // const readNotifData = response.items.filter( i => i.isRead === true )
            // setReadNotifs(readNotifData)
            // const unreadNotifData = response.item.filter( i => i.isRead === false)
            // setUnreadIds(unreadNotifData)
            
            

            
        } catch (Err){
            console.log(Err)
        }
        setLoading(false)
    }
    

    

    return { data ,loading, hasMore, refetch , fetchMore:getAllNotifs, isFollowingIds, setIsFollowingIds, unreadIds, setUnreadIds}
}

export const getAllNotifs = async (recipientId, limit, fetchAll, updateNotifCount) => {
    try {
        const notifications = await fetch(`${nodeServer.currentIP}/notifications?notificationRecipientId=${recipientId}&cursor=null&limit=${limit}&fetchAll=${fetchAll}`)
        const response = await notifications.json();
        // console.log('NOTIFRESPONSE', response)
        const unreadNotifs = response.filter(i => i.isRead === false)
        updateNotifCount(unreadNotifs.length)
        return response
        
    } catch (Err){
        console.log(Err)
    }
}

export const markNotifRead = async (data, notifCount, updateNotifCount) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/notifications/mark-read`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({data})
        })
        const result = await request.json();
        updateNotifCount(notifCount-1)
        
    } catch (err){
        console.log('Error trying to mark notifications as read')
    }
}

export const markAllRead = async (data) => {
    try {
        const response = await fetch(`${nodeServer.currentIP}/notifications/mark-all-read`, {
            method : "POST",
            headers:{
                'Content-type' : 'application/json'
            },
            body:JSON.stringify(data)
        })
        const result = await response.json()
        return result
    } catch (err){
        console.log(err)
    }
}

export const postPushToken = async (token) => {
    try {
        const response = await fetch(`${nodeServer.currentIP}/notifications/save-push-token`,{
            method : 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(token)
        })

        const result = await response.json()
        return result
    } catch (err){
        console.log(err)
    }
}

export const useGetAllNotifRead = async (limit) => {
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ cursor, setCursor ] = useState('null')

    const getAllNotifRead = async () => {
        const response = await fetch(`${nodeServer.currentIP}/notifications/read`)
    }
}