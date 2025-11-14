
import * as nodeServer from '../lib/ipaddresses'
import { useState, useEffect } from 'react'
import { useFetchOwnerUser } from './user';
import { useNotificationCountContext } from '@/lib/NotificationCountContext';
import { apiFetch, useGetUser, useGetUserFull } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications'

export const useGetAllNotifs = (recipientId, limit, fetchAll=false) => {
    console.log('recipient id is ',recipientId)
    const [ data, setData ] = useState([])
    const [ readNotifs, setReadNotifs ] = useState([])
    const [ unreadNotifs, setUnreadNotifs ] = useState([])
    const [ loading, setLoading ] = useState(true);
    const [ hasMore , setHasMore ] = useState(true);
    const [ cursor, setCursor ] = useState(null)
    const [ isFollowingIds, setIsFollowingIds ] = useState([])
    const {user} = useGetUser()
    const {userFull:ownerUser} = useGetUserFull(user?.id)

    const [ unreadIds, setUnreadIds ] = useState([])

    const getAllNotifs = async () => {
        
        if (!hasMore || !ownerUser || !recipientId) return
        try {
            const notifications = await apiFetch(`${nodeServer.currentIP}/notifications?notificationRecipientId=${recipientId}&cursor=${cursor}&limit=${limit}&fetchAll=${fetchAll}`)
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
            const notifications = await apiFetch(`${nodeServer.currentIP}/notifications?notificationRecipientId=${recipientId}&cursor=null&limit=${limit}&fetchAll=${fetchAll}`)
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
        const notifications = await apiFetch(`${nodeServer.currentIP}/notifications?notificationRecipientId=${recipientId}&cursor=null&limit=${limit}&fetchAll=${fetchAll}`)
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
        const request = await apiFetch(`${nodeServer.currentIP}/notifications/mark-read`, {
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
        const response = await apiFetch(`${nodeServer.currentIP}/notifications/mark-all-read`, {
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
        const response = await apiFetch(`${nodeServer.currentIP}/notifications/save-push-token`,{
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
        return err
    }
}

export const useGetAllNotifRead = async (limit) => {
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ cursor, setCursor ] = useState('null')

    const getAllNotifRead = async () => {
        const response = await apiFetch(`${nodeServer.currentIP}/notifications/read`)
    }
}

export const useCheckNotificationPrompt = () => {

    const [showModal, setShowModal] = useState('')


    const checkNotificationPrompt = async () => {

        console.log('checking notifi....')
        const { status, granted, canAskAgain } = await Notifications.getPermissionsAsync();
        console.log('status...',status)
        if (status !== 'undetermined'){
            console.log('os notif setting is not undetermined, so iether granted or denied or undefined...',status)
            return
        }

        const flag = await AsyncStorage.getItem('hasPromptedNotif')
        console.log('flag status..', flag)
        if (flag && flag === 'true') return

        setShowModal(true)
        
        
    }
    
    const handleYesCustomPrompt = async () => {
        console.log('trying to turn on notifs...')
        const { status } = await Notifications.requestPermissionsAsync();
        console.log('status', status)
        await AsyncStorage.setItem('hasPromptedNotif', 'true')
        setShowModal('')
        console.log('done...')
    }
    
    const handleNoCustomPrompt = async () => {
        console.log('trying to turn off notifs...')
        await AsyncStorage.setItem('hasPromptedNotif', 'true')
        setShowModal('')
        console.log('done...')
    }



    useEffect(()=> {
        checkNotificationPrompt()
    }, [])

    return {showModal, setShowModal, handleYesCustomPrompt, handleNoCustomPrompt}

}