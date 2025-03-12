import * as nodeServer from '../lib/ipaddresses'
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { SignOutButton, useAuth } from '@clerk/clerk-react'
import React, {useState, useCallback, useEffect, useRef} from 'react'


export const checkUsername = async ( username ) => {
    try {
        const response = await fetch(`${nodeServer.currentIP}/user/check-username?username=${username}`)
        const data = await response.json();
        return data
    }  catch (err) {
        console.log(err)
    }
}


export const checkEmail = async (email) => {
    try {
        const response = await fetch(`${nodeServer.currentIP}/user/check-email`, {
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
        const response = await fetch (`${nodeServer.currentIP}/user/add-user`, {
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
    // const queryClient = useQueryClient();

    try {



        const request = await fetch(`${nodeServer.currentIP}/user/update-user`, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify( params )
        })
        const response = await request.json();
        // queryClient.invalidateQueries(['user', email]); // This will trigger a refetch the next time the query is used
        // queryClient.refetchQueries(['user', email]);

        return response; 
    } catch (err) {
        console.log(err)
    }
}

export const updateRotation =  async ( userId, rotationItems, listItemObj  ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/current-rotation`, {
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


export const fetchUser = async ( emailOrId ) => {
    console.log('hello here', emailOrId)
    try {
        const request = await fetch(`${nodeServer.currentIP}/user`, {
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body:JSON.stringify(emailOrId)
        })
        const response = await request.json();
        console.log('respone here ', response)
        return response
    } catch (err) {
        console.log('Error fetching user from db', err)
    }
}


export const useFetchUser = (emailOrId ) => {

    // const { getToken } = useAuth();
    // const queryClient = useQueryClient(); // Get query client
    // Get all cached queries
    // Log the entire queries object
    console.log('trying to fetch user with email: ', (emailOrId))


    return useQuery({
        queryKey: ['user', emailOrId],
        queryFn: async () => {
            console.log('Executing query function...');
            const fetchedUser = await fetchUser(emailOrId);
            return fetchedUser
        },
        staleTime: 1000 * 60 * 10, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}

export const useFetchOwnerUser = (email) => {
    return useQuery({
        queryKey: ['ownerUser', email],
        queryFn: async () => {
            const fetchedUser = await fetchUser(email);
            return fetchedUser
        },
        staleTime: 1000 * 60 * 10, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refetch when app regains focus
    });
}


export const searchUsers = async ( query ) => {
    try {
        console.log('trying to serch users')
        const request = await fetch (`${nodeServer.currentIP}/user/search-all?query=${query}`)
        console.log('worked')
        const response = await request.json();
        console.log('users', response);
        return response;
    } catch (err) {
        console.log(err)
    }
}

export const followUser = async ( followData ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/follow`, {
            method : 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( followData )
        })
        const response = await request.json();
        console.log(response);
        return response
    } catch (err){
        console.log(err)
    }
}

export const unfollowUser = async ( followData ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/unfollow`, {
            method : 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( followData )
        })
        const response = await request.json();
        console.log(response);
        return response
    } catch (err){
        console.log(err)
    }
}

export const useRecentlyWatched = (userId, limit=5) => {
    const [ data, setData  ]= useState([])
    const [ cursor, setCursor ] = useState(null)
    // const cursorRef = useRef(null); 
    const [ loading, setLoading ] = useState(false)
    const [ hasMore, setHasMore ] = useState(true)
    const [ isFetchingNext ,setIsFetchingNext ] = useState(false)

    const getRecentlyWatched =  async () => {
        if ( !hasMore  ) return
        console.log('HAS MORE?', hasMore)

        setLoading(true)
        // if (cursor){
        //     set
        // }
        try {
            const response = await fetch (`${nodeServer.currentIP}/user/recently-watched?userId=${userId}&cursor=${cursor}&limit=${limit}`)
            const result = await response.json();
            console.log('next CURSOR', result.nextCursor)
            setData(prev => [...prev, ...result.items]);
            setCursor(result.nextCursor)
            // cursorRef.current = result.nextCursor;
            setHasMore( !!result.nextCursor )
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }
    
    useEffect(() => {
        getRecentlyWatched(true);
    }, [ userId]);

    const removeItem = (item) => {
        setData( prev => prev.filter( element => element.id !== item.id ) )
    }

    return { data, hasMore, loading, refetch : getRecentlyWatched , removeItem }

}


export const fetchRecentlyWatched = async ( { pageParam = null, userId } ) => {
    // const { userId, cursor, take } = data
    const request  = await fetch(`${nodeServer.currentIP}/user/recently-watched?userId=${userId}&cursor=${pageParam}&limit=5`);
    const response = await request.json();
    console.log('THE RESPONSE', response)
    return response;
};

export const useFetchRecentlyWatched = (userId) => {    
    return useInfiniteQuery({
        queryKey: ['recentlyWatched', userId],
        queryFn: ({ pageParam }) => fetchRecentlyWatched({ pageParam, userId }),
        
        getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null, // Determines next batch
    });
};



    export const useGetWatchlistItems = (userId, limit=5) => {
        const [ data, setData  ]= useState([])
        const [ cursor, setCursor ] = useState(null)
        // const cursorRef = useRef(null); 
        const [ loading, setLoading ] = useState(false)
        const [ hasMore, setHasMore ] = useState(true)
        const [ isFetchingNext ,setIsFetchingNext ] = useState(false)

        const getWatchlistItems =  async ( reset = false ) => {
            // if ( !hasMore  ) return
            if (!hasMore && !reset) return;

            console.log('HAS MORE?', hasMore)

            setLoading(true)
            // if (cursor){
            //     set
            // }
            try {
                const response = await fetch (`${nodeServer.currentIP}/user/watchlist?userId=${userId}&cursor=${cursor}&limit=${limit}`)
                const result = await response.json();
                console.log('next CURSOR', result.nextCursor)
                setData(reset ?  result.items  : prev => [...prev, ...result.items]);
                setCursor(result.nextCursor)
                // cursorRef.current = result.nextCursor;
                setHasMore( !!result.nextCursor )
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        }
        
        useEffect(() => {
            getWatchlistItems();
        }, [ ]);
        
        const refetch =  async () => {
            // console.log('triggered refetch()', new Error().stack);
            setCursor(null)
            setHasMore(true)
            await getWatchlistItems(true)
        }

        const removeItem = (item) => {
            setData( prev => prev.filter( element => element.id !== item.id ) )
        }
        return { data, hasMore, loading, refetch, fetchMore : getWatchlistItems, removeItem   }

    }

export const fetchInterested = async (userId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/interested?userId=${userId}`)
        const response = await request.json()
        return response
    } catch (Err){
        console.log(Err)
    }
}

export const useFetchInterested = (userId) => {
    return useQuery({
        queryKey : ['interested', userId],
        queryFn: async () => {
            const recentlyWatched = await fetchInterested(userId)
            return recentlyWatched
        },
        staleTime: 1000 * 60 * 10, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refet
    })
}

export const fetchRecommended = async (userId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/recommended?userId=${userId}`)
        const response = await request.json()
        return response
    } catch (Err){
        console.log(Err)
    }
}

export const useFetchRecommended = (userId) => {
    return useQuery({
        queryKey : ['recommended', userId],
        queryFn: async () => {
            const recommended = await fetchRecommended(userId)
            return recommended
        },
        staleTime: 1000 * 60 * 10, // Cache for 5 minutes
        enabled: true, // Ensures query runs when component mounts
        refetchOnWindowFocus: true, // Auto refet
    })
}

export const useGetRecommendationsSent = (userId, limit=5) => {
    const [ data, setData  ]= useState([])
    const [ cursor, setCursor ] = useState(null)
    // const cursorRef = useRef(null); 
    const [ loading, setLoading ] = useState(false)
    const [ hasMore, setHasMore ] = useState(true)
    const [ isFetchingNext ,setIsFetchingNext ] = useState(false)

    const getRecommendationsSent =  async ( reset = false ) => {
        if ( !hasMore && !reset ) return
        console.log('HAS MORE?', hasMore)

        setLoading(true)
     
        try {
            const response = await fetch (`${nodeServer.currentIP}/user/recommendations/sent?userId=${userId}&cursor=${cursor}&limit=${limit}`)
            const result = await response.json();
            console.log('next CURSOR', result.nextCursor)
            setData(reset ? result.items : prev => [...prev, ...result.items]);
            setCursor(result.nextCursor)
            // cursorRef.current = result.nextCursor;
            setHasMore( !!result.nextCursor )
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }
    
    useEffect(() => {
        getRecommendationsSent();
    }, [ userId]);

    const refetch =  async () => {
        // console.log('triggered refetch()', new Error().stack);
        setCursor(null)
        setHasMore(true)
        await getRecommendationsSent(true)
    }

    const removeSentItems = (item) => {
        setData( prev => prev.filter( element => element.id !== item.id ) )
    }

    return { data, hasMore, loading, refetch , fetchMore : getRecommendationsSent, removeSentItems }

}

export const useGetRecommendationsReceived = (userId, limit=5) => {
    const [ data, setData  ]= useState([])
    const [ cursor, setCursor ] = useState(null)
    // const cursorRef = useRef(null); 
    const [ loading, setLoading ] = useState(false)
    const [ hasMore, setHasMore ] = useState(true)
    const [ isFetchingNext ,setIsFetchingNext ] = useState(false)

    const getRecommendationsReceived =  async (reset = false) => {
        if ( !hasMore && !reset  ) return
        console.log('HAS MORE?', hasMore)

        setLoading(true)
        // if (cursor){
        //     set
        // }
        try {
            const response = await fetch (`${nodeServer.currentIP}/user/recommendations/received?userId=${userId}&cursor=${cursor}&limit=${limit}`)
            const result = await response.json();
            console.log('next CURSOR', result.nextCursor)
            setData(reset ? result.items : prev => [...prev, ...result.items]);
            setCursor(result.nextCursor)
            // cursorRef.current = result.nextCursor;
            setHasMore( !!result.nextCursor )
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }
    
    useEffect(() => {
        getRecommendationsReceived();
    }, [ userId]);


    const refetchReceived =  async () => {
        // console.log('triggered refetchReceived()', new Error().stack);
        setCursor(null)
        setHasMore(true)
        await getRecommendationsSent(true)
    }

    const removeReceivedItems = (item) => {
        setData( prev => prev.filter( element => element.id !== item.id ) )
    }
    return { data, hasMore, loading, refetchReceived  , fetchMoreReceived: getRecommendationsReceived, removeReceivedItems    }

}

export const useGetInterestedItems = (userId, limit=5) => {
    const [ data, setData  ]= useState([])
    const [ cursor, setCursor ] = useState(null)
    // const cursorRef = useRef(null); 
    const [ loading, setLoading ] = useState(false)
    const [ hasMore, setHasMore ] = useState(true)
    const [ isFetchingNext ,setIsFetchingNext ] = useState(false)

    const getInterestedItems =  async () => {
        if ( !hasMore  ) return
        console.log('HAS MORE?', hasMore)

        setLoading(true)
        // if (cursor){
        //     set
        // }
        try {
            const response = await fetch (`${nodeServer.currentIP}/user/interested?userId=${userId}&cursor=${cursor}&limit=${limit}`)
            const result = await response.json();
            console.log('next CURSOR', result.nextCursor)
            setData(prev => [...prev, ...result.items]);
            setCursor(result.nextCursor)
            // cursorRef.current = result.nextCursor;
            setHasMore( !!result.nextCursor )
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }
    
    useEffect(() => {
        getInterestedItems(true);
    }, [ userId]);

    const removeItem = (item) => {
        setData(prev => prev.filter( element => element.id !== item.id ))
    }

    return { data, hasMore, loading, refetch : getInterestedItems, removeItem }

}

export const useGetCurrentlyWatchingItems = (userId, limit=5) => {
    const [ data, setData  ]= useState([])
    const [ cursor, setCursor ] = useState(null)
    // const cursorRef = useRef(null); 
    const [ loading, setLoading ] = useState(false)
    const [ hasMore, setHasMore ] = useState(true)
    const [ isFetchingNext ,setIsFetchingNext ] = useState(false)

    const getCurrentlyWatchingItems =  async () => {
        if ( !hasMore  ) return
        console.log('HAS MORE?', hasMore)

        setLoading(true)
        // if (cursor){
        //     set
        // }
        try {
            const response = await fetch (`${nodeServer.currentIP}/user/currently-watching?userId=${userId}&cursor=${cursor}&limit=${limit}`)
            const result = await response.json();
            console.log("CURRENTWATCH RESULt", result)
            console.log('next CURSOR', result.nextCursor)
            setData(prev => [...prev, ...result.items]);
            setCursor(result.nextCursor)
            // cursorRef.current = result.nextCursor;
            setHasMore( !!result.nextCursor )
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }
    
    useEffect(() => {
        getCurrentlyWatchingItems(true);
    }, [ userId]);

    const removeItem = (item) => {
        setData(prev => prev.filter( element => element.id !== item.id ))
    }
    return { data, hasMore, loading, refetch : getCurrentlyWatchingItems, removeItem }

}




export const checkMutual = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/check-mutual`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json();
        return response
    } catch (err){
        console.log(err)
    }
}

export const getAllMutuals = async (userId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/all-mutuals?userId=${userId}`)
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}

export const deleteWatchedItem = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/recently-watched/delete`, {
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json()
        console.log('response',response)
        return response
    } catch (err){
        console.log(err)
    }
}   

export const deleteCurrentlyWatching = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/currently-watching/delete`, {
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json()
        console.log('response',response)
        return response
    } catch (err){
        console.log(err)
    }
}   

export const deleteInterested = async (data ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/interested/delete`, {
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json()
        console.log(response)
        return response
    } catch (err) {
        console.log(err)
    }
}
