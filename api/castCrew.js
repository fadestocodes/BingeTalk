import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query';

export const fetchCastMentions = async (castId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/person/mentions?castId=${castId}`)
        const response = await request.json();
        return response

    } catch (err) {
        console.log(err)
    }
}


export const useFetchCastMentions = ( castId ) => {


    return useQuery({
        queryKey: ['tvMentions', castId],
        queryFn: async () => {
            return fetchCastMentions(castId);
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}

export const fetchPersonFromDB = async ( {castData} ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/person/find-or-create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( {castData} )
        })
        const response = await request.json();
        return response;
    } catch (err) {

        console.log(err)
    }
}

export const addCastToFav = async (data) => {
    try {   
        const response = await fetch(`${nodeServer.currentIP}/person/add-to-fav`, {
            method : 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body:JSON.stringify(data)
        })
        const result = await response.json()
        return result
    } catch(err){
        console.log(err)
    }
}