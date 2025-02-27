import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query'

export const createList = async (postData) => {
    
    try { 
        const request = await fetch (`${nodeServer.currentIP}/list/create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(postData)
        })
    } catch (err) {
        console.log(err)
    }
}

export const fetchUsersLists = async ( userId ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/list?userId=${userId}`)
        const response = await request.json()
        console.log('Fetched users lists', response)
        return response
    } catch (err) {
        console.log(err)
    }
}



export const useFetchUsersLists = ( userId ) => {
    return useQuery({
        queryKey : ['lists', userId],
        queryFn : async () => {
            return fetchUsersLists(userId)
        },
        staleTime : 1000 * 60 * 30,
        refetchOnWindowFocus : true,
        refetchOnMount: true, 

    })
}

export const listInteraction = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/list/interact`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json()
        return response
    } catch (err) {
        console.log(err)
    }
}