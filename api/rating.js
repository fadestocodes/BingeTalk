import { useUser } from '@clerk/clerk-expo'
import * as nodeServer from '../lib/ipaddresses'
import { useState, useEffect } from 'react'

export const createRating = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/rating/create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json()
        return response
    } catch (err){
        console.log(err)
    }
}

export const deleteRating = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/rating/delete`, {
            method : "POST",
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json()
        return response
    } catch (err){
        console.log(err)
    }
}

export const useGetTitleRatings = (data) => {
    const [ratings, setRatings] = useState('')
    const [ isLoading, setIsLoading ] = useState(false)
    const { user : clerkUser } = useUser()
    const { data : ownerUser, refetch : refetchOwner } = useFetchOwnerUser({email:clerkUser?.emailAddresses[0]?.emailAddress})
    const { ratingsId } = data

    useEffect(() => {

    }, [ownerUser, ratingsId])


    return { ratings, isLoading, ownerUser }

}