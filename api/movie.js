import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query';

export const getMovieMentions = async (tmdbId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/movie/mentions?tmdbId=${tmdbId}`)
        const response = await request.json();
        console.log('response', response)
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