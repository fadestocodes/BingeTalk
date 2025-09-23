import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query';
import { useState , useEffect} from 'react';

export const getMovieMentions = async (movieId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/movie/mentions?movieId=${movieId}`)
        const response = await request.json();
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


export const useFetchMovieFromDB = (  movieData ) => {

    // const queryClient = useQueryClient(); // Get query client


    return useQuery({
        queryKey: ['movieFromDB', movieData.id],
        queryFn: async () => {
            return fetchMovieFromDB({movieData});
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}

export const markMovieWatch =  async ( data ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/movie/update-hasWatched`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}


export const markMovieInterested =  async ( data ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/movie/update-interested`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}

export const markMovieCurrentlyWatching =  async ( data ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/movie/update-currentlyWatching`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}

export const markMovieWatchlist =  async ( data ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/movie/update-watchlist`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}


export const useGetMovieFromDB = ( DBmovieId ) => {

    const [ movie, setMovie ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    const getMovieFromDB = async () => {
        setLoading(true)
        try {
            const request = await fetch(`${nodeServer.currentIP}/movie?DBmovieId=${DBmovieId}`)
            const response = await request.json()
            setMovie(response)
        } catch (err){
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getMovieFromDB()
    },[DBmovieId])

    return { movie, loading }

}

export const swipeMovieInterested = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/movie/interested/swipe`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json()
        return response
    } catch (Err){
        console.log(Err)
    }

}