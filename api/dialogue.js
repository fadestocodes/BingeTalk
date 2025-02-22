import * as nodeServer from '../lib/ipaddresses'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SignOutButton, useAuth } from '@clerk/clerk-react'




export const createDialogue = async ( postData ) => {
    console.log('hello')
    // const queryClient = useQueryClient(); // Get query client
    console.log('post data for createdialogue', postData)

    try {
        console.log('trying to createDialogue')
        const request = await fetch (`${nodeServer.currentIP}/dialogue/create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( {postData} )
        })
        const response = await request.json();
        console.log('response', response)           
        // queryClient.invalidateQueries(['dialogues']);

        return response
    } catch (err) {
        console.log(err)
    }
}

// export const fetchDialogues = async ( token ) => {
//     try {
//         console.log('trying to fetch');
//         const request = await fetch (`${nodeServer.currentIP}/dialogue/fetch-all`, {
//             method : 'GET',
//             headers : {
//                 'Content-type' : 'application/json',
//                 'Authorization' : `Bearer ${token}`
//             }
//         });
//         const response = await request.json();

//         console.log('resposne ', response)
//         return response.dialogues
//     } catch (err) {
//         console.log(err)
//     }
// }

// export const fetchDialogues = async ( token ) => {
//     try {
//         console.log('trying to fetch');
//         const request = await fetch (`${nodeServer.currentIP}/dialogue/fetch-all`, {
//             method : 'GET',
//             headers : {
//                 'Content-type' : 'application/json',
//                 'Authorization' : `Bearer ${token}`
//             }
//         });
//         const response = await request.json();

//         console.log('resposne ', response)
//         return response.dialogues
//     } catch (err) {
//         console.log(err)
//     }
// }

export const fetchDialogues = async ( id ) => {
    try {
        console.log('trying to fetch dialogues');
        const request = await fetch (`${nodeServer.currentIP}/dialogue/fetch-all?id=${id}`);
        const response = await request.json();

        console.log('dialogue resposne ', response)
        return response
    } catch (err) {
        console.log(err)
    }
}

export const useFetchDialogues = ( id ) => {

    // const queryClient = useQueryClient(); // Get query client

    return useQuery({
        queryKey: ['dialogues', id],
        queryFn: async () => {
            return fetchDialogues(id);
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}