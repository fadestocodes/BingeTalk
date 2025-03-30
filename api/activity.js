import * as nodeServer from '../lib/ipaddresses'
import { useState, useEffect } from 'react';

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

export const useFetchActivityId = (id) => {
    const [ data, setData ] = useState(null)
    const [ loading, setLoading ] = useState(true);

    const fetchActivityId = async () => {
        try {   
            setLoading(true)
            const request = await fetch(`${nodeServer.currentIP}/activity?id=${id}`)
            const response = await request.json();
            setData(response);
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    } 

    useEffect(()=>{
        fetchActivityId()
    }, [id])

    return { data, loading, refetch : fetchActivityId }
}