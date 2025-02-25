import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query'

export const createThread = async ( threadData ) => {
    console.log('threadData', threadData)
    try {
        const request = await fetch(`${nodeServer.currentIP}/thread/create`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify( threadData )
        })
        const response = await request.json()
        return response
    } catch (err) {
        console.log(err)
    }
}

export const fetchSingleThread = async (threadId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/thread?threadId=${threadId}`)
        const response = await request.json()
        return response
    } catch (err) {
        console.log(err)
    }
}


export const useFetchSingleThread = ( threadId ) => {
    console.log('trying to use hook with ',threadId)
    return useQuery({
        queryKey : ['dialogues', threadId],
        queryFn : async () => {
            return fetchSingleThread(threadId)
        },
        // staleTime : 1000 * 60 * 30,
        staleTime : 0,
        refetchOnWindowFocus : true,
        refetchOnMount: true, 

    })
}