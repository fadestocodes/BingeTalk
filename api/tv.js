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