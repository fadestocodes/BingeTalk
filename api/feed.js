import * as nodeServer from '../lib/ipaddresses'
import React, {useState, useEffect} from 'react'


export const useGetFeed = ( userId, limit ) => {
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ hasMore, setHasMore ] = useState(true);
    const [ cursor, setCursor ] = useState(null);

    const getFeed = async () => {
        if (!hasMore) return
        try {
            setLoading(true);
            const request = await fetch (`${nodeServer.currentIP}/feed?userId=${userId}&limit=${limit}&cursor=${cursor}`);
            const response = await request.json();
            setData( prev => [ ...prev, ...response.items ] );
            setCursor(response.nextCursor)
            setHasMore(!!response.nextCursor)

        } catch (err) {
            console.log(err)
        }
        setLoading(false);
    }

    useEffect(() => {
        getFeed()
    }, [])

    return { data, loading, hasMore, refetch : getFeed }
}



export const useGetProfileFeed = (userId, limit) => {
    const [ data, setData ] = useState([])
    const [ loading, setLoading  ] = useState(true)
    const [ isFetching, setIsFetching ] = useState(false)
    const [ hasMore, setHasMore] = useState({
        dialogue : true,
        thread : true,
        list : true
    })
    const [ cursors, setCursors ] = useState({
        dialogue : null,
        thread : null,
        list : null
    })

    const getProfileFeed = async () => {
        if (!hasMore.dialogue && !hasMore.thread && !hasMore.list) return
        if (isFetching) return 
        try {
            setIsFetching(true)
            const response = await fetch(`${nodeServer.currentIP}/feed/profile-page?id=${userId}&limit=${limit}&dialogueCursor=${cursors.dialogue}&threadCursor=${cursors.thread}&listCursor=${cursors.list}&hasMoreDialogues=${hasMore.dialogue}&hasMoreThreads=${hasMore.thread}&hasMoreLists=${hasMore.list}`)
            const results = await response.json()
            setData(prev => ([...prev, ...results.items]))
            setHasMore({
                dialogue : !!results.nextDialogueCursor,
                thread : !!results.nextThreadCursor,
                list : !!results.nextListCursor
            })
            setCursors(prev => ({
                ...prev,
                dialogue : results.nextDialogueCursor,
                thread : results.nextThreadCursor,
                list : results.nextListCursor
            }))

        } catch (err){
            console.log(err)
        } finally {
            setIsFetching(false)
            setLoading(false)
        }
    }

    useEffect(() => {
        getProfileFeed()
    }, [userId])

    const removeItem = (idToRemove, removeType) => {
        setData(prev => prev.filter( i => i.id !== Number(idToRemove) && i.feedType !== removeType  ) )
    }

    const refetch = async () => {
        if (isFetching) return
        try {
            setIsFetching(true)
            const response = await fetch(`${nodeServer.currentIP}/feed/profile-page?id=${userId}&limit=${limit}&dialogueCursor=null&threadCursor=null&listCursor=null&hasMoreDialogues=true&hasMoreThreads=true&hasMoreLists=true`)
            const results = await response.json()
            setData(results.items)
            setHasMore({
                dialogue : !!results.nextDialogueCursor,
                thread : !!results.nextThreadCursor,
                list : !!results.nextListCursor
            })
            setCursors(prev => ({
                ...prev,
                dialogue : results.nextDialogueCursor,
                thread : results.nextThreadCursor,
                list : results.nextListCursor
            }))

        } catch (err){
            console.log(err)
        } finally {
            setIsFetching(false)
            setLoading(false)

        }
    }

    return { data, loading, hasMore, cursors, refetch  , removeItem} 
}
