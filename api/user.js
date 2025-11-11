import * as nodeServer from '../lib/ipaddresses'
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import React, {useState, useCallback, useEffect, useRef} from 'react'
import { node } from '@sentry/core';
import { useBadgeContext } from '@/lib/BadgeModalContext';
import {apiFetch, useGetUser,useGetUserFull} from '../api/auth'

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
        const response = await apiFetch (`${nodeServer.currentIP}/user/add-user`, {
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



        const request = await apiFetch(`${nodeServer.currentIP}/user/update-user`, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify( params )
        })
        const response = await request.json();

        return response; 
    } catch (err) {
        console.log(err)
    }
}

export const updateRotation =  async ( userId, rotationItems, listItemObj  ) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/user/current-rotation`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(  {userId, rotationItems, listItemObj} )
        })
        const response = await request.json();
    } catch (err) {
        console.log(err)
    }
}


export const fetchUser = async ( emailOrId ) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/user`, {
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body:JSON.stringify(emailOrId)
        })
        const response = await request.json();

        if (!response) {
            throw new Error('User not found or invalid response');
        }
        return response
    } catch (err) {
        console.log('Error fetching user from db', err)
    }
}


export const useFetchUser = (emailOrId ) => {


    return useQuery({
        queryKey: ['user', emailOrId],
        queryFn: async () => {

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

// export const useFetchOwnerUser = (email) => {
//     const [ data, setData ]  = useState(null)
//     const [ isLoading, setIsLoading ]  = useState(true)

//     const fetchOwnerUser = async () => {
//         try {
//             setIsLoading(true)
//             console.log('fetching user...')
//             const request = await fetch(`${nodeServer.currentIP}/user`, {
//                 method:'POST',
//                 headers:{
//                     'Content-type' : 'application/json'
//                 },
//                 body:JSON.stringify(email)
//             })
//             const response = await request.json();
//             setData(response)
//         } catch (err) {
//             console.log('Error fetching user from db', err)
//         } finally {
//             setIsLoading(false)

//         }
//     }

//     useEffect(()=>{
//         fetchOwnerUser()
//     },[email])

//     return { data, isLoading, refetch:fetchOwnerUser }

// }




export const searchUsers = async ( query ) => {
    try {
        const request = await apiFetch (`${nodeServer.currentIP}/user/search-all?query=${query}`)
        const response = await request.json();
        return response;
    } catch (err) {
        console.log(err)
    }
}

export const followUser = async ( followData ) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/user/follow`, {
            method : 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( followData )
        })
        const response = await request.json();
        return response
    } catch (err){
        console.log(err)
    }
}

export const unfollowUser = async ( followData ) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/user/unfollow`, {
            method : 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( followData )
        })
        const response = await request.json();
        return response
    } catch (err){
        console.log(err)
    }
}

export const useRecentlyWatched = (userId, limit=5) => {
    const [ data, setData  ]= useState([])
    const [ cursor, setCursor ] = useState(null)
    // const cursorRef = useRef(null); 
    const [ loading, setLoading ] = useState(true)
    const [ hasMore, setHasMore ] = useState(true)
    const [ isFetchingNext ,setIsFetchingNext ] = useState(false)

    const getRecentlyWatched =  async () => {
        if ( !hasMore  ) return

        setLoading(true)
        try {
            const response = await apiFetch (`${nodeServer.currentIP}/user/recently-watched?userId=${userId}&cursor=${cursor}&limit=${limit}`)
            const result = await response.json();
            setData(prev => [...prev, ...result.items]);
            setCursor(result.nextCursor)
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

    const refetch = async () => {
        try {
            const response = await apiFetch (`${nodeServer.currentIP}/user/recently-watched?userId=${userId}&cursor=null&limit=${limit}`)
            const result = await response.json();
            setData(result.items);
            setCursor(result.nextCursor)
            setHasMore( !!result.nextCursor )
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    return { data, hasMore, loading, refetch, fetchMore : getRecentlyWatched , removeItem }

}


export const fetchRecentlyWatched = async ( { pageParam = null, userId } ) => {
    // const { userId, cursor, take } = data
    const request  = await apiFetch(`${nodeServer.currentIP}/user/recently-watched?userId=${userId}&cursor=${pageParam}&limit=5`);
    const response = await request.json();
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
        const [ loading, setLoading ] = useState(true)
        const [ hasMore, setHasMore ] = useState(true)
        const [ isFetchingNext ,setIsFetchingNext ] = useState(false)

        const getWatchlistItems =  async (  ) => {
            // if ( !hasMore  ) return
            if (!hasMore) return;


            try {
                const response = await apiFetch (`${nodeServer.currentIP}/user/watchlist?userId=${userId}&cursor=${cursor}&limit=${limit}`)
                const result = await response.json();
                setData(prev => [...prev, ...result.items]);
                setCursor(result.nextCursor)
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
            try {
                const response = await apiFetch (`${nodeServer.currentIP}/user/watchlist?userId=${userId}&cursor=null&limit=${limit}`)
                const result = await response.json();
                setData(result.items);
                setCursor(result.nextCursor)
                setHasMore( !!result.nextCursor )
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
        }

        const removeItem = (item) => {
            setData( prev => prev.filter( element => element.id !== item.id ) )
        }
        return { data, hasMore, loading, refetch, fetchMore : getWatchlistItems, removeItem   }

    }

export const fetchInterested = async (userId) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/user/interested?userId=${userId}`)
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
        const request = await apiFetch(`${nodeServer.currentIP}/user/recommended?userId=${userId}`)
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
    const [ loading, setLoading ] = useState(true)
    const [ hasMore, setHasMore ] = useState(true)
    const [ isFetchingNext ,setIsFetchingNext ] = useState(false)

    const getRecommendationsSent =  async ( reset = false ) => {
        if ( !hasMore && !reset ) return

     
        try {
            const response = await apiFetch (`${nodeServer.currentIP}/user/recommendations/sent?userId=${userId}&cursor=${cursor}&limit=${limit}`)
            const result = await response.json();
            const resultFiltered = result.items.filter(i => i.movie || i.tv)
            setData(reset ? resultFiltered : prev => [...prev, ...resultFiltered]);
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
        try {
            const response = await apiFetch (`${nodeServer.currentIP}/user/recommendations/sent?userId=${userId}&cursor=null&limit=${limit}`)
            const result = await response.json();
            const resultFiltered = result.items.filter(i => i.movie || i.tv)
            setData( resultFiltered );
            setCursor(result.nextCursor)
            // cursorRef.current = result.nextCursor;
            setHasMore( !!result.nextCursor )
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
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
    const [ loading, setLoading ] = useState(true)
    const [ hasMore, setHasMore ] = useState(true)
    const [ isFetchingNext ,setIsFetchingNext ] = useState(false)

    const getRecommendationsReceived =  async () => {
        if ( !hasMore && !reset  ) return

        try {
            setLoading(true)
            
            const response = await apiFetch (`${nodeServer.currentIP}/user/recommendations/received?userId=${userId}&cursor=${cursor}&limit=${limit}`)
            const result = await response.json();
            // setData(reset ? result.items : prev => [...prev, ...result.items]);
            const resultFiltered = result.items.filter(i => (i.movie || i.tv) && i.status === 'PENDING')
            setData( prev => [...prev, ...resultFiltered]);
            setCursor(result.nextCursor)
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
        try {
            setLoading(true)
            const response = await apiFetch (`${nodeServer.currentIP}/user/recommendations/received?userId=${userId}&cursor=null&limit=${limit}`)
            const result = await response.json();
            // setData(reset ? result.items : prev => [...prev, ...result.items]);
            const resultFiltered = result.items.filter(i => (i.movie || i.tv) && i.status === 'PENDING')
            setData(resultFiltered );
            setCursor(result.nextCursor)
            setHasMore( !!result.nextCursor )
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
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
    const [ loading, setLoading ] = useState(true)
    const [ hasMore, setHasMore ] = useState(true)
    const [ isFetchingNext ,setIsFetchingNext ] = useState(false)

    const getInterestedItems =  async () => {
        if ( !hasMore  ) return

        try {
            const response = await apiFetch (`${nodeServer.currentIP}/user/interested?userId=${userId}&cursor=${cursor}&limit=${limit}`)
            const result = await response.json();
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

    const refetch = async () => {
        try {
            const response = await apiFetch (`${nodeServer.currentIP}/user/interested?userId=${userId}&cursor=null&limit=${limit}`)
            const result = await response.json();
            setData(result.items);
            setCursor(result.nextCursor)
            setHasMore( !!result.nextCursor )
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    return { data, hasMore, loading, refetch, fetchMore:getInterestedItems, removeItem }

}

export const useGetCurrentlyWatchingItems = (userId, limit=5) => {
    const [ data, setData  ]= useState([])
    const [ cursor, setCursor ] = useState(null)
    // const cursorRef = useRef(null); 
    const [ loading, setLoading ] = useState(true)
    const [ hasMore, setHasMore ] = useState(true)
    const [ isFetchingNext ,setIsFetchingNext ] = useState(false)

    const getCurrentlyWatchingItems =  async () => {
        if ( !hasMore  ) return

      
        try {
            const response = await apiFetch (`${nodeServer.currentIP}/user/currently-watching?userId=${userId}&cursor=${cursor}&limit=${limit}`)
            const result = await response.json();
            setData(prev => [...prev, ...result.items]);
            setCursor(result.nextCursor)

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

    const refetch = async () => {
        try {
            const response = await apiFetch (`${nodeServer.currentIP}/user/currently-watching?userId=${userId}&cursor=null&limit=${limit}`)
            const result = await response.json();
            setData(result.items);
            setCursor(result.nextCursor)

            setHasMore( !!result.nextCursor )
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    return { data, hasMore, loading, refetch ,fetchMore : getCurrentlyWatchingItems, removeItem }

}




export const checkMutual = async (data) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/user/check-mutual`, {
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
        const request = await apiFetch(`${nodeServer.currentIP}/user/all-mutuals?userId=${userId}`)
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}

export const deleteWatchedItem = async (data) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/user/recently-watched/delete`, {
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json()
        return response
    } catch (err){
        console.log(err)
    }
}   

export const deleteCurrentlyWatching = async (data) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/user/currently-watching/delete`, {
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json()
        return response
    } catch (err){
        console.log(err)
    }
}   

export const deleteInterested = async (data ) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/user/interested/delete`, {
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json()
        return response
    } catch (err) {
        console.log(err)
    }
}


export const useGetFollowersListInfinite = (userId, limit) => {
 
    const {user} = useGetUser()
    const {userFull:ownerUser}= useGetUserFull(user?.id)

    const [ data, setData ] = useState([])
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore,setHasMore ] = useState(true)
    const [ loading, setLoading ] = useState(true)
    const [ isFollowingIds, setIsFollowingIds ] = useState([])

    const getFollowersListInfinite = async () => {
        if (!hasMore) return
        try {
            const response = await apiFetch(`${nodeServer.currentIP}/user/followers?userId=${userId}&limit=${limit}&cursor=${cursor}`)
            
            const results = await response.json()
            
            const isFollowingId = results.items.filter( notif => ownerUser.following.some( f =>  f.followerId === notif.following.id ) ).map( element => element.following.id );
            setIsFollowingIds(prev=> [...prev, ...isFollowingId])
            const checkFollowResults = results.items.map( i => ({
                ...i,
                alreadyFollowing : isFollowingId.includes( i?.follower?.id ) 
            }) )
          
            setData(prev => [...prev, ...checkFollowResults])
            setCursor(results.nextCursor)
            setHasMore(!!results.nextCursor)
          

        } catch (Err){
            console.log(Err)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        getFollowersListInfinite()
    },[])

    const refetch = async () => {
        try {
            const response = await apiFetch(`${nodeServer.currentIP}/user/followers?userId=${userId}&limit=${limit}&cursor=null`)
            
            const results = await response.json()
          
            setData(results.items)
            setCursor(results.nextCursor)
            setHasMore(!!results.nextCursor)
          
            const isFollowingId = results.items.filter( notif => ownerUser.following.some( f =>  f.followerId === notif.following.id ) ).map( element => element.following.id );
            setIsFollowingIds(prev=> [...prev, ...isFollowingId])

        } catch (Err){
            console.log(Err)
        } finally {
            setLoading(false)
        }
    }

    return { data, loading, hasMore, refetch , isFollowingIds, setIsFollowingIds, fetchMore : getFollowersListInfinite }
}

export const useGetFollowingListInfinite = (userId, limit) => {
  

    const {user} = useGetUser()
    const {userFull:ownerUser}= useGetUserFull(user?.id)
    const [ data, setData ] = useState([])
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore,setHasMore ] = useState(true)
    const [ loading, setLoading ] = useState(true)
    const [ isFollowingIds, setIsFollowingIds ] = useState([])

    const getFollowingListInfinite = async () => {
        if (!hasMore) return
        try {
            const response = await apiFetch(`${nodeServer.currentIP}/user/followings?userId=${userId}&limit=${limit}&cursor=${cursor}`)
            const results = await response.json()
            const isFollowingId = results.items.filter( notif => ownerUser.following.some( f =>  f.followerId === notif.follower.id ) ).map( element => element.follower.id );
            setIsFollowingIds(isFollowingId)
            const checkFollowResults = results.items.map( i => ({
                ...i,
                alreadyFollowing : isFollowingId.includes( i?.follower?.id ) 
            }) )
            setData(prev => [...prev,...checkFollowResults])
            setCursor(results.nextCursor)
            setHasMore(!!results.nextCursor)
            console.log('has more?', !!results.nextCursor)
           

        } catch (Err){
            console.log(Err)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        getFollowingListInfinite()
    },[userId])

    const refetch = async () => {
        try {
            const response = await apiFetch(`${nodeServer.currentIP}/user/followings?userId=${userId}&limit=${limit}&cursor=null`)
            const results = await response.json()
          
            setData(prev,results.items)
            setCursor(results.nextCursor)
            setHasMore(!!results.nextCursor)
          
            const isFollowingId = results.items.filter( notif => ownerUser.following.some( f =>  f.followerId === notif.follower.id ) ).map( element => element.follower.id );
            setIsFollowingIds(prev=> [...prev, ...isFollowingId])

        } catch (Err){
            console.log(Err)
        } finally {
            setLoading(false)
        }
    }

    return { data, loading, hasMore, refetch , isFollowingIds, setIsFollowingIds, fetchMore : getFollowingListInfinite }
}

export const deleteUser = async (data) => {
    try {
        const response = await apiFetch(`${nodeServer.currentIP}/user/delete-account`, {
            method : 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
    } catch (err){
        console.log(err)
    }
}

export const blockUser = async (data) => {
    try {
        const request = await apiFetch(`${nodeServer.currentIP}/user/block-user`, {
            method : "POST",
            headers: {
                'Content-type' : 'application/json'
            },
            body:JSON.stringify(data)
        })
        const response = await request.json()
        return response
    } catch (err){
        console.log(err)
    }
}

export const useCheckBlock = (params) => {
    const [ data , setData ] = useState([])
    const [ loading, setLoading ] = useState(true)


    const checkBlock = async () => {
        try {
            const user = await apiFetch(`${nodeServer.currentIP}/user`, {
                method:'POST',
                headers:{
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(params)
            })

        } catch (err){
            console.log(err)
        }
    }
}

export const useGetUserRatings = (userId, limit) => {
    const [ data, setData ] = useState([])
    const [loading, setLoading] = useState(true)
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore, setHasMore ] = useState(true)

    const getUserRatings = async () => {
        if (!hasMore) return
        try {
            const request = await apiFetch(`${nodeServer.currentIP}/user/ratings?userId=${userId}&cursor=${cursor}&limit=${limit}`)
            const response = await request.json()
            console.log('responsehere', response)
            setData(prev => [...prev, ...response.items])
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)
        } catch (Err){
            console.log(Err)
        }
        setLoading(false)
    }

    useEffect(() => {
        getUserRatings()
    }, [userId])

    const refetch = async () => {
        try {
            const request = await apiFetch(`${nodeServer.currentIP}/user/ratings?userId=${userId}&cursor=null&limit=${limit}`)
            const response = await request.json()
            setData(response.items)
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)
        } catch (Err){
            console.log(Err)
        }
        setLoading(false)
    }

    return { data, loading, hasMore, refetch , getMore : getUserRatings }

}


export const findUniqueRotations = async () => {
    try {
        const res = await apiFetch(`${nodeServer.currentIP}/user/unique-rotations`)
        const data = await res.json()
        console.log("UNIQUROTATIONS", data)
        return data
    } catch(err){
        console.log(err)
        return err
    }
}

export const useGetBadges = (userId) => {

    const [badgeList, setBadgeList] = useState([])
    const [criticProgression, setCriticProgression] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')


    const getBadges = async () => {
        if (!userId) return
        try {
            setIsLoading(true)
            setError('')

            const response = await apiFetch(`${nodeServer.currentIP}/user/${userId}/badges`)
            const result = await response.json()
            if (!response.ok){
                throw new Error(result.message || "Unexpected error.")
            }
            const badgeData = result.data
            setBadgeList(badgeData)
        } catch (err){
            console.error(err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getBadges()
    }, [userId])

    return { badgeList, isLoading, refetch: getBadges, error, criticProgression }
}

export const useGetCriticProgression = (userId) => {
    const [criticProgression, setCriticProgression] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [hasLeveledUp, setHasLeveledUp] = useState(false)
    const [error, setError] = useState('')
    
    const getCriticProgression = async () => {
        if (!userId) return
        try {
            setIsLoading(true)
            setError('')
            const criticResponse = await apiFetch(`${nodeServer.currentIP}/user/${userId}/critic-badge-progression`)
            const criticResult = await criticResponse.json()

            if (!criticResponse.ok){
                throw new Error(criticResult.message || "Error fetching progression data for Critic badge")
            }
            const criticProgressionData = criticResult.data
            // console.log('criticprogresion', criticProgressionData)
            console.log(`Critic (${criticProgressionData.nextLevel}) progression: ${criticProgressionData?.untilNextLevel.currentlyAt} / ${criticProgressionData?.untilNextLevel.toNextLevel} `)
            setCriticProgression(criticProgressionData)

    
        } catch (err){
            console.error(err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        getCriticProgression()
    }, [userId])

    return {criticProgression, isLoading, error}
}

export const useGetHistorianProgression = (userId) => {
    const [historianProgression, setHistorianProgression] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    
    const getHistorianProgression = async () => {
        if (!userId) return
        try {
            setIsLoading(true)
            setError('')
            const historianResponse = await apiFetch(`${nodeServer.currentIP}/user/${userId}/historian-badge-progression`)
            const historianResult = await historianResponse.json()

            if (!historianResponse.ok){
                throw new Error(historianResult.message || "Error fetching progression data for Critic badge")
            }
            const historianProgressionData = historianResult.data
            // console.log('historianprogresion', historianProgressionData)
            console.log(`Historian (${historianProgressionData.nextLevel}) progression: ${historianProgressionData?.untilNextLevel.currentlyAt} / ${historianProgressionData?.untilNextLevel.toNextLevel} `)
            setHistorianProgression(historianProgressionData)

    
        } catch (err){
            console.error(err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        getHistorianProgression()
    }, [userId])

    return {historianProgression, isLoading, error}
}


export const useGetCuratorProgression = (userId) => {
    const [curatorProgression, setCuratorProgression] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    
    const getCuratorProgression = async () => {
        if (!userId) return
        try {
            setIsLoading(true)
            setError('')
            const curatorResponse = await apiFetch(`${nodeServer.currentIP}/user/${userId}/curator-badge-progression`)
            const curatorResult = await curatorResponse.json()

            if (!curatorResponse.ok){
                throw new Error(curatorResult.message || "Error fetching progression data for Critic badge")
            }
            const curatorProgressionData = curatorResult.data
            // console.log('historianprogresion', curatorProgressionData)
            console.log(`Curator (${curatorProgressionData.nextLevel}) progression: ${curatorProgressionData?.untilNextLevel.currentlyAt} / ${curatorProgressionData?.untilNextLevel.toNextLevel} `)
            setCuratorProgression(curatorProgressionData)

    
        } catch (err){
            console.error(err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        getCuratorProgression()
    }, [userId])

    return {curatorProgression, isLoading, error}
}

export const useGetAuteurProgression = (userId) => {
    const [auteurProgression, setAuteurProgression] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    
    const getAuteurProgression = async () => {
        if (!userId) return
        try {
            setIsLoading(true)
            setError('')
            const auteurResponse = await apiFetch(`${nodeServer.currentIP}/user/${userId}/auteur-badge-progression`)
            const auteurResult = await auteurResponse.json()

            if (!auteurResponse.ok){
                throw new Error(auteurResult.message || "Error fetching progression data for Auteur badge")
            }
            const auteurProgressionData = auteurResult.data
            // console.log('historianprogresion', auteurProgressionData)
            console.log(`Auteur (${auteurProgressionData.nextLevel}) progression: ${auteurProgressionData?.untilNextLevel.currentlyAt} / ${auteurProgressionData?.untilNextLevel.toNextLevel} `)
            setAuteurProgression(auteurProgressionData)

    
        } catch (err){
            console.error(err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        getAuteurProgression()
    }, [userId])

    return {auteurProgression, isLoading, error}
}

export const useGetConversationalistProgression = (userId) => {
    const [conversationalistProgression, setConversationalistProgression] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    
    const getConversationalistProgression = async () => {
        if (!userId) return
        try {
            setIsLoading(true)
            setError('')
            const conversationalistResponse = await apiFetch(`${nodeServer.currentIP}/user/${userId}/conversationalist-badge-progression`)
            const conversationalistResult = await conversationalistResponse.json()

            if (!conversationalistResponse.ok){
                throw new Error(conversationalistResult.message || "Error fetching progression data for conversationalist badge")
            }
            const conversationalistProgressionData = conversationalistResult.data
            // console.log('historianprogresion', conversationalistProgressionData)
            console.log(`Conversationalist (${conversationalistProgressionData?.nextLevel}) progression: ${conversationalistProgressionData?.untilNextLevel.currentlyAt.comments} / ${conversationalistProgressionData?.untilNextLevel.toNextLevel.comments} 
                & ${conversationalistProgressionData?.untilNextLevel.currentlyAt.reposts} / ${conversationalistProgressionData?.untilNextLevel.toNextLevel.reposts}  `)
            setConversationalistProgression(conversationalistProgressionData)

    
        } catch (err){
            console.error(err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        getConversationalistProgression()
    }, [userId])

    return {conversationalistProgression, isLoading, error}
}

export const useGetPeoplesChoiceProgression = (userId) => {
    const [peoplesChoiceProgression, setPeoplesChoiceProgression] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    
    const getPeoplesChoiceProgression = async () => {
        if (!userId) return
        try {
            setIsLoading(true)
            setError('')
            const peoplesChoiceResponse = await apiFetch(`${nodeServer.currentIP}/user/${userId}/peoples-choice-badge-progression`)
            const peoplesChoiceResult = await peoplesChoiceResponse.json()

            if (!peoplesChoiceResponse.ok){
                throw new Error(peoplesChoiceResult.message || "Error fetching progression data for peoplesChoice badge")
            }
            const peoplesChoiceProgressionData = peoplesChoiceResult.data
            // console.log('historianprogresion', peoplesChoiceProgressionData)
            console.log(`peoplesChoice (${peoplesChoiceProgressionData?.nextLevel}) progression: ${peoplesChoiceProgressionData?.untilNextLevel.currentlyAt} / ${peoplesChoiceProgressionData?.untilNextLevel.toNextLevel}`)
            setPeoplesChoiceProgression(peoplesChoiceProgressionData)

    
        } catch (err){
            console.error(err)
            setError(err.message)
        } finally {
            setIsLoading(false) 
        }

    }

    useEffect(() => {
        getPeoplesChoiceProgression()
    }, [userId])

    return {peoplesChoiceProgression, isLoading, error}
}

export const useCheckBadgeNotifications = (userId) => {
    const [ badgeNotifications, setBadgeNotifications ] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const { showBadgeModal } = useBadgeContext()


    const checkBadgeNotifications = async () => {
        try {
            setLoading(true)
            setError("")
            if (!userId) return
            const response = await apiFetch(`${nodeServer.currentIP}/user/${userId}/badge-notification`)
            if (!response.ok) throw new Error("Unexpected error")
            const result = await response.json()
            const notifs = result.data.badgeNotifications
            console.log(result.message)
            setBadgeNotifications(notifs)
            if (notifs.length > 0) {
                // Push each notification into the modal queue

                notifs.forEach(n => {
                    console.log('notif in queue', n)
                    console.log('userId for badge queue', userId)
                    showBadgeModal(n.badgeType, n.badgeLevel, n.id, userId)
                });
            }
        } catch (err){
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
   
    

    useEffect(() => {
        checkBadgeNotifications()
    },[userId])

    return { badgeNotifications, loading, error, refetchBadgeNotifications : checkBadgeNotifications }
}

export const markBadgeNotificationSeen = async ( badgeId) => {


    try {
        console.log(`userid: ${userId}, badgeId: ${badgeId}`)
        if (!userId || !badgeId) throw new Error("Invalid parameters")
        const response = await apiFetch(`${nodeServer.currentIP}/user/${userId}/badge-notification/${badgeId}`, {
            method : "PATCH",
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({userId, badgeId})
        })
        if (!response.ok) throw new Error("Unexpected error")
            console.log('marked badge notif as seen')
        
    } catch(err){
        console.error(err)
    }
}

export const updateWatchedBatch = async (data) => {
    try {
        const res = await apiFetch(`${nodeServer.currentIP}/user/update-hasWatched/batch`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        if (!res.ok) {
            return false
        }
        const resData = await res.json()
        console.log('resdata...',resData)
        return true
    } catch(err){
        console.error(err)
        return false
    }
}