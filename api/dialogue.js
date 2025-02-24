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

export const fetchDialogues = async ( userId ) => {
    try {
        console.log('trying to fetch dialogues');
        console.log('userId', userId)
        const request = await fetch (`${nodeServer.currentIP}/dialogue/fetch-all?id=${userId}`);
        const response = await request.json();

        console.log('dialogue resposne ', response)
        return response
    } catch (err) {
        console.log(err)
    }
}

export const useFetchDialogues = ( userId ) => {

    // const queryClient = useQueryClient(); // Get query client

    return useQuery({
        queryKey: ['dialogues', userId],
        queryFn: async () => {
            return fetchDialogues(userId);
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}

export const fetchSingleDialogue =  async( dialogueId ) => {
    console.log('trying to fethc single dialogue')
    try {
        const request = await fetch(`${nodeServer.currentIP}/dialogue?id=${dialogueId}`);
        const response = await request.json();
        console.log('the resposne is ', response)
        return response
    } catch (err) {
        console.log(err)
    }
}

export const useFetchSingleDialogue = ( dialogueId ) => {
    console.log('trying to use hook with ',dialogueId)
    return useQuery({
        queryKey : ['dialogues', dialogueId],
        queryFn : async () => {
            return fetchSingleDialogue(dialogueId)
        },
        // staleTime : 1000 * 60 * 30,
        staleTime : 0,
        refetchOnWindowFocus : true,
        refetchOnMount: true, 

    })
}