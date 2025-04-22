import * as nodeServer from '../lib/ipaddresses'
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { SignOutButton, useAuth, useUser } from '@clerk/clerk-react'
import React, {useState, useCallback, useEffect, useRef} from 'react'
import { node } from '@sentry/core';


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
        console.log("checkemaildata",data)
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
    } catch (err) {
        console.log(err)
    }
}


export const fetchUser = async ( emailOrId ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user`, {
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
//         }
//         setIsLoading(false)
//     }

//     useEffect(()=>{
//         fetchOwnerUser()
//     },[email])

//     return { data, isLoading, refetch:fetchOwnerUser }

// }




export const searchUsers = async ( query ) => {
    try {
        const request = await fetch (`${nodeServer.currentIP}/user/search-all?query=${query}`)
        const response = await request.json();
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
            const response = await fetch (`${nodeServer.currentIP}/user/recently-watched?userId=${userId}&cursor=${cursor}&limit=${limit}`)
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
            const response = await fetch (`${nodeServer.currentIP}/user/recently-watched?userId=${userId}&cursor=null&limit=${limit}`)
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
    const request  = await fetch(`${nodeServer.currentIP}/user/recently-watched?userId=${userId}&cursor=${pageParam}&limit=5`);
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
                const response = await fetch (`${nodeServer.currentIP}/user/watchlist?userId=${userId}&cursor=${cursor}&limit=${limit}`)
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
                const response = await fetch (`${nodeServer.currentIP}/user/watchlist?userId=${userId}&cursor=null&limit=${limit}`)
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
    const [ loading, setLoading ] = useState(true)
    const [ hasMore, setHasMore ] = useState(true)
    const [ isFetchingNext ,setIsFetchingNext ] = useState(false)

    const getRecommendationsSent =  async ( reset = false ) => {
        if ( !hasMore && !reset ) return

     
        try {
            const response = await fetch (`${nodeServer.currentIP}/user/recommendations/sent?userId=${userId}&cursor=${cursor}&limit=${limit}`)
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
            const response = await fetch (`${nodeServer.currentIP}/user/recommendations/sent?userId=${userId}&cursor=null&limit=${limit}`)
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

    const getRecommendationsReceived =  async (reset = false) => {
        if ( !hasMore && !reset  ) return

        try {
            const response = await fetch (`${nodeServer.currentIP}/user/recommendations/received?userId=${userId}&cursor=${cursor}&limit=${limit}`)
            const result = await response.json();
            // setData(reset ? result.items : prev => [...prev, ...result.items]);
            const resultFiltered = result.items.filter(i => i.movie || i.tv)
            setData(reset ? resultFiltered : prev => [...prev, ...resultFiltered]);
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
            const response = await fetch (`${nodeServer.currentIP}/user/recommendations/received?userId=${userId}&cursor=null&limit=${limit}`)
            const result = await response.json();
            // setData(reset ? result.items : prev => [...prev, ...result.items]);
            const resultFiltered = result.items.filter(i => i.movie || i.tv)
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
            const response = await fetch (`${nodeServer.currentIP}/user/interested?userId=${userId}&cursor=${cursor}&limit=${limit}`)
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
            const response = await fetch (`${nodeServer.currentIP}/user/interested?userId=${userId}&cursor=null&limit=${limit}`)
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
            const response = await fetch (`${nodeServer.currentIP}/user/currently-watching?userId=${userId}&cursor=${cursor}&limit=${limit}`)
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
            const response = await fetch (`${nodeServer.currentIP}/user/currently-watching?userId=${userId}&cursor=null&limit=${limit}`)
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
        return response
    } catch (err) {
        console.log(err)
    }
}


export const useGetFollowersListInfinite = (userId, limit) => {
    const { user:clerkUser } = useUser()
    const { data : ownerUser } = useFetchOwnerUser({email:clerkUser.emailAddresses[0].emailAddress})
    const [ data, setData ] = useState([])
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore,setHasMore ] = useState(true)
    const [ loading, setLoading ] = useState(true)
    const [ isFollowingIds, setIsFollowingIds ] = useState([])

    const getFollowersListInfinite = async () => {
        if (!hasMore) return
        try {
            const response = await fetch(`${nodeServer.currentIP}/user/followers?userId=${userId}&limit=${limit}&cursor=${cursor}`)
            
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
            const response = await fetch(`${nodeServer.currentIP}/user/followers?userId=${userId}&limit=${limit}&cursor=null`)
            
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
    const { user:clerkUser } = useUser()
    const { data : ownerUser } = useFetchOwnerUser({email:clerkUser.emailAddresses[0].emailAddress})
    const [ data, setData ] = useState([])
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore,setHasMore ] = useState(true)
    const [ loading, setLoading ] = useState(true)
    const [ isFollowingIds, setIsFollowingIds ] = useState([])

    const getFollowingListInfinite = async () => {
        if (!hasMore) return
        try {
            const response = await fetch(`${nodeServer.currentIP}/user/followings?userId=${userId}&limit=${limit}&cursor=${cursor}`)
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
            const response = await fetch(`${nodeServer.currentIP}/user/followings?userId=${userId}&limit=${limit}&cursor=null`)
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
        const response = await fetch(`${nodeServer.currentIP}/user/delete-account`, {
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
        const request = await fetch(`${nodeServer.currentIP}/user/block-user`, {
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
            const user = await fetch(`${nodeServer.currentIP}/user`, {
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