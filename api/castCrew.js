import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query';

export const fetchCastMentions = async (castId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/person/mentions?castId=${castId}`)
        const response = await request.json();
        console.log('response', response)
        return response

    } catch (err) {
        console.log(err)
    }
}


export const useFetchCastMentions = ( castId ) => {

    // const queryClient = useQueryClient(); // Get query client

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