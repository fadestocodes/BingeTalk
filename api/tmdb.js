import * as nodeServer from '../lib/ipaddresses'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SignOutButton, useAuth } from '@clerk/clerk-react'



export const GetNowPlaying = async () => {
    try {
      const response = await fetch(`${nodeServer.currentIP}/tmdb/now-playing`);
      const data = await response.json();
      
      return (data);
    } catch (err) {
      console.log(err.message)
    }
  }
  
  
  export const GetMovieById = async (movieId) => {
    try {
      const response = await fetch (`${nodeServer.currentIP}/tmdb/movie/id?movieId=${movieId}`);
      const data = await response.json();
      // console.log('data is ', data);
      return (data);
    } catch (err) {
      console.log(err.message)
    }
  }
  
  export const GetTVById = async (tvId) => {
    try {
      const response = await fetch (`${nodeServer.currentIP}/tmdb/tv/id?tvId=${tvId}`);
      const data = await response.json();
      // console.log('data is ', data);
      return (data);
    } catch (err) {
      console.log(err.message)
    }
  }

  export const useGetTVById = ( tvId ) => {

    return useQuery({
      queryKey: ['tv', tvId],
      queryFn: async () => {
          return GetTVById(tvId);
      },
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
      enabled: true, // Ensures query runs when component mounts
      refetchOnWindowFocus: true, // Auto refetch when app regains focus
  });
  }
  
  export const getTrailer = async ({movieId, showId}) => {
  
    try {
      if (movieId) {
        const response = await fetch(`${nodeServer.currentIP}/tmdb/id/videos?movieId=${movieId}`);
        const data = await response.json();
        return data;
      } else if (showId) {
        const response = await fetch(`${nodeServer.currentIP}/tmdb/id/videos?showId=${showId}`);
        const data = await response.json();
        return data;
      }
    } catch(err) {
      console.log('Error fetching trailer', err.message)
    }
  
  }
  
  export const getCredits = async  ({movieId, showId}) => {
    try {
      if (movieId) {
        const response = await fetch (`${nodeServer.currentIP}/tmdb/id/credits?movieId=${movieId}`)
        const data = await response.json();
        return data;
      } else if (showId) {
        const response = await fetch (`${nodeServer.currentIP}/tmdb/id/credits?movieId=${movieId}`)
        const data = await response.json();
        return data;
      }
    } catch (err) {
      console.log('Error fetching credits', err.message)
    }
  }
  
  export const getPerson = async (castId) => {
    try {
      const response = await fetch(`${nodeServer.currentIP}/tmdb/person?id=${castId}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log('Error fetching person data', err)
    }
  }
  
  export const searchAll = async (query) => {
    
    try {
      const encodedQuery = encodeURIComponent(query)
      const response = await fetch (`${nodeServer.currentIP}/tmdb/search/all?query=${encodedQuery}`);
      const data = await response.json();
      return data
    } catch (err) {
      console.log(err)
    }
  }

  export const searchTitles = async (query) => {
      
    try {
        const encodedQuery = encodeURIComponent(query)
        const response = await fetch (`${nodeServer.currentIP}/tmdb/search/all?query=${encodedQuery}`);
        const data = await response.json();
        const filteredData = data.results.filter(item => item.media_type !== 'person');
        return filteredData
      } catch (err) {
        console.log(err)
      }
  }

  
  export const getTrending = async () => {
    try {
      const response = await fetch(`${nodeServer.currentIP}/tmdb/trending/all`);
      const data = await response.json();
      return data
    } catch (err) {
      console.log('Error fetching trending', err)
    }
  }
  
  export const getUpcoming = async () => {
    try {
      const response = await fetch(`${nodeServer.currentIP}/tmdb/movie/upcoming`);
      const data = await response.json();
      return data
    } catch (err) {
      console.log('Error fetching trending', err)
    }
  }
  
  export const getTrendingPeople = async () => {
    try {
      const response = await fetch(`${nodeServer.currentIP}/tmdb/trending/people`);
      const data = await response.json();
      return data
    } catch (err) {
      console.log('Error fetching trending people', err)
    }
  }
  
  export const getDiscoverTV = async () => {
    try {
      const response = await fetch(`${nodeServer.currentIP}/tmdb/discover/tv`);
      const data = await response.json();
      return data
    } catch (err) {
      console.log('Error fetching trending people', err)
    }
  }
  
  export const getTrendingTV = async () => {
    try {
      const response = await fetch(`${nodeServer.currentIP}/tmdb/trending/tv`);
      const data = await response.json();
      return data

    } catch (err) {
      console.log('Error fetching trending people', err)
    }
  }
  
  export const getTrendingMovie = async () => {
    try {
      const response = await fetch(`${nodeServer.currentIP}/tmdb/trending/movie`);
      const data = await response.json();
      return data

    } catch (err) {
      console.log('Error fetching trending people', err)
    }
  }


export const useTMDBHook = ( fetchFunction, keyName ) => {

    const { getToken } = useAuth();
    // const queryClient = useQueryClient(); // Get query client

    return useQuery({
        queryKey: [keyName],
        queryFn: async () => {
            if (typeof fetchFunction !== 'function') {
                throw new Error('fetchFunction must be a function');
            }
            const token = await getToken();
            return fetchFunction(token);
        },
        staleTime: 1000 * 60 * 10, // Cache for 5 minutes
        enabled: !!fetchFunction, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}