import * as nodeServer from '../lib/ipaddresses'
import { useState, useEffect } from 'react'

export const createComment = async ( commentData ) => {
    console.log('commentData',commentData)
    try {
        console.log('trting to create comment')
        const request = await fetch(`${nodeServer.currentIP}/comment/create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( commentData )
        })

        const newComment = await request.json();
        console.log('newcomment', newComment)
        return newComment;
    } catch (err) {
        console.log(err)
    }
}

export const useFetchSingleComment = (id) => {
    const [ data, setData] = useState(null);
    const [loading, setLoading ]  = useState(true)
    
     const fetchSingleComment = async () => {
        try {
            const request = await fetch(`${nodeServer.currentIP}/comment?id=${id}`)
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
        const response = await fetch(`${nodeServer.currentIP}/comment/delete`, {
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