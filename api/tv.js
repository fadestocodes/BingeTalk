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


export const fetchTVThreads = async ( data ) => {
    console.log('data from fetch tv threads', data)
    const { tvId, tvObj } = data
    console.log('TVOBJ', tvObj)
    try {
        const request = await fetch(`${nodeServer.currentIP}/tv/threads?tvId=${tvId}`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( {tvObj} )
        })
        const response = await request.json();
        console.log('thread response ', response)
        return response
    } catch (err) {
        console.log(err)
    }
}


export const useFetchTVThreads = ( data ) => {
    console.log('DATAAAA',data)

    // const queryClient = useQueryClient(); // Get query client


    return useQuery({
        queryKey: ['tvThreads', tvObj.id],
        queryFn: async () => {
            return fetchTVThreads(data);
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


export const getTVThreads = async (tvId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/tv/threads?tvId=${tvId}`)
        const response = await request.json()
        return response
    } catch(err){
        console.log(err)
    }
}

export const useGetTVThreads = (  tvId ) => {

    // const queryClient = useQueryClient(); // Get query client


    return useQuery({
        queryKey: ['threads',tvId],
        queryFn: async () => {
            return getTVThreads(tvId);
        },
        staleTime: 0, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}
