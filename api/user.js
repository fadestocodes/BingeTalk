import * as nodeServer from '../lib/ipaddresses'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SignOutButton, useAuth } from '@clerk/clerk-react'



export const checkUsername = async ( username ) => {
    try {
        const response = await fetch(`${nodeServer.expressServerHotspot}/user/check-username?username=${username}`)
        const data = await response.json();
        return data
    }  catch (err) {
        console.log(err)
    }
}


export const checkEmail = async (email) => {
    try {
        const response = await fetch(`${nodeServer.expressServerHotspot}/user/check-email`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({ email })
        })
        const data = await response.json()
        return data
    } catch (err) {
        console.log(err)
    }
}

export const addUser =  async ( { firstName, lastName, email, username } ) => {
    try {
        const response = await fetch (`${nodeServer.expressServerHotspot}/user/add-user`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify( { firstName, lastName, email, username } )
        })
        const data = await response.json();
        return data
    } catch(err) {
        console.log(err)
    }
}

export const updateUser = async ( params, email ) => {
    const queryClient = useQueryClient();

    try {



        const request = await fetch(`${nodeServer.expressServerHotspot}/user/update-user`, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify( params )
        })
        const response = await request.json();
        queryClient.invalidateQueries(['user', email]); // This will trigger a refetch the next time the query is used
        queryClient.refetchQueries(['user', email]);

        console.log('response from updateUser ', response)
        return response; 
    } catch (err) {
        console.log(err)
    }
}

export const updateRotation =  async ( userId, rotationItems, listItemObj  ) => {
    try {
        const request = await fetch(`${nodeServer.expressServerHotspot}/user/current-rotation`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(  {userId, rotationItems, listItemObj} )
        })
        const response = await request.json();
        console.log('resposne from updateRotation', response)
    } catch (err) {
        console.log(err)
    }
}


export const fetchUser = async ( email ) => {
    try {
        const request = await fetch(`${nodeServer.expressServerHotspot}/user`, {
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body:JSON.stringify({email})
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log('Error fetching user from db', err)
    }
}


export const useFetchUser = (email) => {

    // const { getToken } = useAuth();
    // const queryClient = useQueryClient(); // Get query client
    // Get all cached queries
    // Log the entire queries object
    console.log('trying to fetch user with email: ', email)

    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const fetchedUser = await fetchUser(email);
            return fetchedUser
        },
        staleTime: 1000 * 60 * 10, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}