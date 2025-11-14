import { apiFetch } from "./auth"
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
        return resData
    } catch (err){
        console.error(err)
        return err
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


export const useGetSetDay = (id) => {
    const [data, setData] = useState('')
    const [loading, setLoading] = useState(true)

    const getSetDay = async () => {
        try {
            if (!id) return
            setLoading(true)
            const res = await fetch(`${nodeServer.currentIP}/set-days/${id}`)
            const resData = await res.json()
            if (!res.ok) throw new Error(resData?.error || "Invalid request")
            setData(resData)
            
        } catch(err){
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSetDay()
    }, [id])

    return {data, loading, refetch:getSetDay}
}