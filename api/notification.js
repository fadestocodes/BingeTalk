import * as nodeServer from '../lib/ipaddresses'
import { useState, useEffect } from 'react'

export const useGetAllNotifs = (recipientId, limit, fetchAll=false) => {
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(false);
    const [ hasMore , setHasMore ] = useState(true);
    const [ cursor, setCursor ] = useState(null)

    const getAllNotifs = async () => {
        if (!hasMore) return
        try {
            setLoading(true);
            console.log('hello')
            const notifications = await fetch(`${nodeServer.currentIP}/notifications?notificationRecipientId=${recipientId}&cursor=${cursor}&limit=${limit}&fetchAll=${fetchAll}`)
            const response = await notifications.json();
            setData(prev => [...prev, ...response.items])
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)

            
        } catch (Err){
            console.log(Err)
        }
        setLoading(false)
    }

    useEffect(() => {
        getAllNotifs()
    }, [])

    return { data, loading, hasMore, refetch :getAllNotifs }
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
            body : JSON.stringify(data)
        })
        const result = await request.json();
        console.log('response', result)
        
    } catch (err){
        console.log('Error trying to mark notifications as read')
    }
}