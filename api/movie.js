import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query';

export const getMovieMentions = async (movieId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/movie/mentions?movieId=${movieId}`)
        const response = await request.json();
        // console.log('response', response)
        console.log('fetching mentions for movie!')
        console.log('movieId', movieId)
        return response

    } catch (err) {
        console.log(err)
    }
}


export const useFetchMovieMentions = ( movieId ) => {

    // const queryClient = useQueryClient(); // Get query client

    return useQuery({
        queryKey: ['movieMentions', movieId],
        queryFn: async () => {
            return getMovieMentions(movieId);
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}


export const fetchMovieFromDB = async ( {movieData} ) => {
    console.log('movieData', movieData)
    try {
        const request = await fetch(`${nodeServer.currentIP}/movie/find-or-create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( {movieData} )
        })
        const response = await request.json();
        return response;
    } catch (err) {

        console.log(err)
    }
}