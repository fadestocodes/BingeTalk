import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query';

export const fetchTVMentions = async (tvId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/tv/mentions?tvId=${tvId}`)
        const response = await request.json();
        console.log('response', response)
        return response

    } catch (err) {
        console.log(err)
    }
}


export const useFetchTVMentions = ( tvId ) => {

    // const queryClient = useQueryClient(); // Get query client

    return useQuery({
        queryKey: ['tvMentions', tvId],
        queryFn: async () => {
            return fetchTVMentions(tvId);
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}


export const fetchTVThreads = async ( {tvId, tvObj} ) => {
    try {
        console.log('fetching thread', tvId, tvObj)
        const request = await fetch(`${nodeServer.currentIP}/tv/threads?tvId=${tvId}`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( {tvId, tvObj} )
        })
        const response = await request.json();
        console.log('thread response ', response)
        return response
    } catch (err) {
        console.log(err)
    }
}


export const useFetchTVThreads = ( { tvId, tvObj } ) => {

    // const queryClient = useQueryClient(); // Get query client
    console.log('will use fetch threads', tvId, tvObj)


    return useQuery({
        queryKey: ['tvThreads', tvId],
        queryFn: async () => {
            return fetchTVThreads({tvId, tvObj});
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}

export const fetchTVFromDB = async ( {tvData} ) => {
    console.log('tvdata', tvData)
    try {
        const request = await fetch(`${nodeServer.currentIP}/tv/find-or-create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( {tvData} )
        })
        const response = await request.json();
        return response;
    } catch (err) {

        console.log(err)
    }
}


export const useFetchTVFromDB = (  tvData ) => {

    // const queryClient = useQueryClient(); // Get query client


    return useQuery({
        queryKey: ['tvFromDB', tvData.id],
        queryFn: async () => {
            return fetchTVFromDB({tvData});
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}