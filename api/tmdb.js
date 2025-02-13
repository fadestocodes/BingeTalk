import * as nodeServer from '../lib/ipaddresses'


export const GetNowPlaying = async () => {
    try {
      const response = await fetch(`${nodeServer.expressServerHotspot}/tmdb/now-playing`);
      const data = await response.json();
      
      return (data);
    } catch (err) {
      console.log(err.message)
    }
  }
  
  
  export const GetMovieById = async (movieId) => {
    try {
      const response = await fetch (`${nodeServer.expressServerHotspot}/tmdb/movie/id?movieId=${movieId}`);
      const data = await response.json();
      // console.log('data is ', data);
      return (data);
    } catch (err) {
      console.log(err.message)
    }
  }
  
  export const GetTVById = async (tvId) => {
    try {
      const response = await fetch (`${nodeServer.expressServerHotspot}/tmdb/tv/id?tvId=${tvId}`);
      const data = await response.json();
      // console.log('data is ', data);
      return (data);
    } catch (err) {
      console.log(err.message)
    }
  }
  
  export const getTrailer = async ({movieId, showId}) => {
  
    try {
      if (movieId) {
        const response = await fetch(`${nodeServer.expressServerHotspot}/tmdb/id/videos?movieId=${movieId}`);
        const data = await response.json();
        return data;
      } else if (showId) {
        const response = await fetch(`${nodeServer.expressServerHotspot}/tmdb/id/videos?showId=${showId}`);
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
        const response = await fetch (`${nodeServer.expressServerHotspot}/tmdb/id/credits?movieId=${movieId}`)
        const data = await response.json();
        return data;
      } else if (showId) {
        const response = await fetch (`${nodeServer.expressServerHotspot}/tmdb/id/credits?movieId=${movieId}`)
        const data = await response.json();
        return data;
      }
    } catch (err) {
      console.log('Error fetching credits', err.message)
    }
  }
  
  export const getPerson = async (castId) => {
    try {
      const response = await fetch(`${nodeServer.expressServerHotspot}/tmdb/person?id=${castId}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log('Error fetching person data', err)
    }
  }
  
  export const searchAll = async (query) => {
    
    try {
      const encodedQuery = encodeURIComponent(query)
      const response = await fetch (`${nodeServer.expressServerHotspot}/tmdb/search/all?query=${encodedQuery}`);
      const data = await response.json();
      return data
    } catch (err) {
      console.log(err)
    }
  }
  
  export const getTrending = async () => {
    try {
      const response = await fetch(`${nodeServer.expressServerHotspot}/tmdb/trending/all`);
      const data = await response.json();
      return data
    } catch (err) {
      console.log('Error fetching trending', err)
    }
  }
  
  export const getUpcoming = async () => {
    try {
      const response = await fetch(`${nodeServer.expressServerHotspot}/tmdb/movie/upcoming`);
      const data = await response.json();
      return data
    } catch (err) {
      console.log('Error fetching trending', err)
    }
  }
  
  export const getTrendingPeople = async () => {
    try {
      const response = await fetch(`${nodeServer.expressServerHotspot}/tmdb/trending/people`);
      const data = await response.json();
      return data
    } catch (err) {
      console.log('Error fetching trending people', err)
    }
  }
  
  export const getDiscoverTV = async () => {
    try {
      const response = await fetch(`${nodeServer.expressServerHotspot}/tmdb/discover/tv`);
      const data = await response.json();
      return data
    } catch (err) {
      console.log('Error fetching trending people', err)
    }
  }