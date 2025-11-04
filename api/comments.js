import * as nodeServer from '../lib/ipaddresses'
import { useState, useEffect } from 'react'
import { apiFetch } from './auth';

export const createComment = async ( commentData ) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/comment/create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( commentData )
        })

        const newComment = await request.json();
        return newComment;
    } catch (err) {
        console.log(err)
    }
}



export const useFetchSingleComment = (id) => {
    const [ data, setData] = useState(null);
    const [loading, setLoading ]  = useState(true)
    
     const fetchSingleComment = async () => {
        if (!id) return
        try {
            const request = await apiFetch(`${nodeServer.currentIP}/comment?id=${id}`)
            const response = await request.json();
            setData( response)
    
        } catch (err){
            console.log(err)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchSingleComment()
    }, [])

    return { data, loading, refetch : fetchSingleComment }

}



export const deleteComment = async (data) => {
    try {
        const response = await apiFetch(`${nodeServer.currentIP}/comment/delete`, {
            method:'POST',
            headers:{
                'Content-type': 'application/json'
            },
            body:JSON.stringify(data)
        })
        const result = await response.json()
        return result
    } catch(err){
        console.log(err)
    }
}



export const commentInteraction = async ( data ) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/comment/interact`, {
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