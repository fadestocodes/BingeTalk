import * as nodeServer from '../lib/ipaddresses'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '@clerk/clerk-expo'
import { useState, useEffect } from 'react'
import { useFetchOwnerUser } from './user'


export const createList = async (postData) => {
    
    try { 
        const request = await fetch (`${nodeServer.currentIP}/list/create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(postData)
        })
        const response = await request.json();
        return response;
    } catch (err) {
        console.log(err)
    }
}

export const addToList = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/list/add-to-list`, {
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
        return err
    }
}

export const fetchUsersLists = async ( userId ) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/list/user?userId=${userId}`)
        const response = await request.json()
        // console.log('Fetched users lists', response)
        return response
    } catch (err) {
        console.log(err)
    }
}



export const useFetchUsersLists = ( userId ) => {
    return useQuery({
        queryKey : ['lists', userId],
        queryFn : async () => {
            return fetchUsersLists(userId)
        },
        staleTime : 1000 * 60 * 30,
        refetchOnWindowFocus : true,
        refetchOnMount: true, 

    })
}

export const useFetchUsersListsInfinite = (userId, limit) => {
    const [ data, setData ] = useState([]);
    const [ cursor, setCursor ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ hasMore, setHasMore ] = useState(true)

    const fetchUsersListsInfinite = async () => {
        if(!hasMore) return
        try {
            const response = await fetch(`${nodeServer.currentIP}/list/infinite?userId=${userId}&limit=${limit}&cursor=${cursor}`)
            const results = await response.json()
            setData(prev => [...prev, ...results.items])
            setCursor(results.nextCursor)
            setHasMore(!!results.nextCursor)
        } catch (err){
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsersListsInfinite()
    }, [])

    const refetch = async () => {
        try {
            const response = await fetch(`${nodeServer.currentIP}/list/infinite?userId=${userId}&limit=${limit}&cursor=null`)
            const results = await response.json()
            setData(results.items)
            setCursor(results.nextCursor)
            setHasMore(!!results.nextCursor)
        } catch (err){
            console.log(err)
        }
    }
    
    const removeItem = (item) => {
        setData(prev => prev.filter( i => i.id !== item.id ))
    }

    return { data, loading, hasMore, refetch, removeItem, fetchMore:fetchUsersListsInfinite }
 }


export const listInteraction = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/list/interact`, {
            method : 'POST',
            headers : {
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

export const fetchSpecificList = async (listId) => {
    try {
        const request = await fetch (`${nodeServer.currentIP}/list?listId=${listId}`)
        const response = await request.json();
        console.log('fetched list ', response)
        return response
    } catch (err) {
        console.log(err)
    }
}

export const useFetchSpecificList = ( listId ) => {
    return useQuery({
        queryKey : ['lists', listId],
        queryFn : async () => {
            return fetchSpecificList(listId)
        },
        staleTime : 1000 * 60 * 30,
        refetchOnWindowFocus : true,
        refetchOnMount: true, 

    })
}

export const getTrendingLists = async (limit) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/list/trending?limit=${limit}`)
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}

export const useGetTrendingLists = (limit) => {
    const [ trendingList, setTrendingList ] = useState([])
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore, setHasMore ] = useState(true)
    const [ loading, setLoading ] = useState(true)
    const getTrendingLists = async (limit) => {
        if (!hasMore) return 
        try {
            const request = await fetch(`${nodeServer.currentIP}/list/trending?cursor=${cursor}&limit=${limit}`)
            const response = await request.json();
            setTrendingList(prev => [...prev, ...response.items]);
            setCursor(response.nextCursor)
            setHasMore( !!response.nextCursor )
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTrendingLists(limit)
    },[])

    const refetch = async () => {
        try {
            const request = await fetch(`${nodeServer.currentIP}/list/trending?cursor=null&limit=${limit}`)
            const response = await request.json();
            setTrendingList(response.items)
            setCursor(response.nextCursor)
            setHasMore( !!response.nextCursor )
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
       
    }
    
    return { trendingList, loading, refetch , hasMore, fetchMore:getTrendingLists }
}

export const useGetRecentLists = (limit) => {
    const [ recentLists, setRecentLists ] = useState([])
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore, setHasMore ] = useState(true)
    const [ loading, setLoading ] = useState(true)

    const getRecentLists = async (limit) => {
        if (!hasMore) return
        try {
            const request = await fetch(`${nodeServer.currentIP}/list/most-recent?cursor=${cursor}&limit=${limit}`)
            const response = await request.json();
            setRecentLists(prev => [...prev, ...response.items]);
            setCursor(response.nextCursor)
            setHasMore( !!response.nextCursor )
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getRecentLists(limit)
    },[])

    const refetch = async () => {
        try {
            const request = await fetch(`${nodeServer.currentIP}/list/most-recent?cursor=null&limit=${limit}`)
            const response = await request.json();
            setRecentLists(response.items);
            setCursor(response.nextCursor)
            setHasMore( !!response.nextCursor )
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
       
    }
    
    return { recentLists, loading, refetch, hasMore, fetchMore : getRecentLists  }
}


export const deleteList = async (data) => {
    try {
        const response = await fetch(`${nodeServer.currentIP}/list/delete`, {
            method:'POST',
            headers:{
                'Content-type': 'application/json'
            },
            body:JSON.stringify(data)
        })
        const result = await response.json()
        return result
    } catch(err){
        console.log(err)
    }
}




export const useCustomFetchSingleList = ( listId, replyCommentId ) => {
    const [ list, setList ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setEror ] = useState(null)
    const { user : clerkUser }  = useUser()
    const { data : ownerUser } = useFetchOwnerUser({email:clerkUser.emailAddresses[0].emailAddress})
    const [ interactedComments, setInteractedComments ] = useState({
        upvotes : [],
        downvotes : []
    })
    const [ commentsData, setCommentsData ] = useState([])
    const [ interactedCount, setInteractedCount ] = useState(null)


    const fetchList = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${nodeServer.currentIP}/list?listId=${listId}`);
            const fetchedList = await response.json();
            const upvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedList.comments.some( j => j.id === i.commentId && i.interactionType === 'UPVOTE' )
            } )
            const downvotedComments = ownerUser.commentInteractions.filter( i => {
                return fetchedList.comments.some( j => j.id === i.commentId && i.interactionType === 'DOWNVOTE' )
            } )
            setInteractedComments(prev => ({
                ...prev,
                upvotes : upvotedComments,
                downvotes : downvotedComments
            }))

            setList(fetchedList)

            if (replyCommentId){
                const request = await fetch(`${nodeServer.currentIP}/comment?id=${replyCommentId}`)
                const replyCommentFromNotif = await request.json();

                const reorderedCommentsData = [
                    ...fetchedList?.comments.filter( comment => comment.id === replyCommentFromNotif?.parentId) ,
                    ...fetchedList?.comments.filter( comment => comment.id !== replyCommentFromNotif?.parentId) 
                ]
                setCommentsData(reorderedCommentsData)
            }else {
                setCommentsData(fetchedList.comments)
            }
          
        } catch (err) {
            console.log(err)
            setEror(err)
        } finally {
            setIsLoading(false)
        }
    } 

    useEffect(()=>{
       
            fetchList();
    }, [])

    return { list, isLoading, error, commentsData, setCommentsData, interactedComments, setInteractedComments, refetch: fetchList}
}
