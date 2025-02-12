

const expressServer = 'http://192.168.1.65:3000';
const expressServerHaides = 'http://192.168.0.11:3000'
const expressServerCafe = 'http://192.168.0.152:3000'
const expressServerWendys = 'http://192.168.111.7:3000'
const expressServerGratia = 'http://192.168.31.211:3000'
const expressServerTimmies = 'http://192.168.101.225:3000'
const expressServerHotspot = 'http://172.20.10.3:3000'
const expressServerStarbucks = 'http://172.16.227.74:3000'
const expressServerTemp = 'http:/172.31.255.232:3000'


export const GetNowPlaying = async () => {
  try {
    const response = await fetch(`${expressServerHaides}/tmdb/now-playing`);
    const data = await response.json();
    
    return (data);
  } catch (err) {
    console.log(err.message)
  }
}


export const GetMovieById = async (movieId) => {
  try {
    const response = await fetch (`${expressServerHaides}/tmdb/movie/id?movieId=${movieId}`);
    const data = await response.json();
    // console.log('data is ', data);
    return (data);
  } catch (err) {
    console.log(err.message)
  }
}

export const GetTVById = async (tvId) => {
  try {
    const response = await fetch (`${expressServerHaides}/tmdb/tv/id?tvId=${tvId}`);
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
      const response = await fetch(`${expressServerHaides}/tmdb/id/videos?movieId=${movieId}`);
      const data = await response.json();
      return data;
    } else if (showId) {
      const response = await fetch(`${expressServerHaides}/tmdb/id/videos?showId=${showId}`);
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
      const response = await fetch (`${expressServerHaides}/tmdb/id/credits?movieId=${movieId}`)
      const data = await response.json();
      return data;
    } else if (showId) {
      const response = await fetch (`${expressServerHaides}/tmdb/id/credits?movieId=${movieId}`)
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.log('Error fetching credits', err.message)
  }
}

export const getPerson = async (castId) => {
  try {
    const response = await fetch(`${expressServerHaides}/tmdb/person?id=${castId}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log('Error fetching person data', err)
  }
}

export const searchAll = async (query) => {
  
  try {
    const encodedQuery = encodeURIComponent(query)
    const response = await fetch (`${expressServerHaides}/tmdb/search/all?query=${encodedQuery}`);
    const data = await response.json();
    return data
  } catch (err) {
    console.log(err)
  }
}

export const getTrending = async () => {
  try {
    const response = await fetch(`${expressServerHaides}/tmdb/trending/all`);
    const data = await response.json();
    return data
  } catch (err) {
    console.log('Error fetching trending', err)
  }
}

export const getUpcoming = async () => {
  try {
    const response = await fetch(`${expressServerHaides}/tmdb/movie/upcoming`);
    const data = await response.json();
    return data
  } catch (err) {
    console.log('Error fetching trending', err)
  }
}

export const getTrendingPeople = async () => {
  try {
    const response = await fetch(`${expressServerHaides}/tmdb/trending/people`);
    const data = await response.json();
    return data
  } catch (err) {
    console.log('Error fetching trending people', err)
  }
}

export const getDiscoverTV = async () => {
  try {
    const response = await fetch(`${expressServerHaides}/tmdb/discover/tv`);
    const data = await response.json();
    return data
  } catch (err) {
    console.log('Error fetching trending people', err)
  }
}

export const uploadToS3 = async ( fileUri, fileName, fileType ) => {
  console.log('filename is ', fileName)
  console.log('filetype is ', fileType)

  try {
    const response = await fetch (`${expressServerHaides}/aws/s3-upload`, {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({fileName, fileType})
    });
    const {url, location} = await response.json();
    try {
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': fileType,
        },
        body: {
            uri: fileUri,
            type: fileType,
            name: fileName,
        },
      });
      console.log('cloudfront location is ', location)
      return location;
    } catch (err) {
      console.log('Error uploading to S3', err)
    }

  } catch(err) {
    console.log('Error getting presigned url', err)
  }
}