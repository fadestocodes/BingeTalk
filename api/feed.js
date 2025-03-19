import * as nodeServer from '../lib/ipaddresses'
import React, {useState, useEffect} from 'react'


export const useGetFeed = ( userId, limit ) => {
    console.log('params,', userId, limit)
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
            console.log('Feed response', response);
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
    // console.log("USERID", userId)
    const [ data, setData ] = useState([])
    const [ loading, setLoading  ] = useState(true)
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
        try {
            const response = await fetch(`${nodeServer.currentIP}/feed/profile-page?id=${userId}&limit=${limit}&dialogueCursor=${cursors.dialogue}&threadCursor=${cursors.thread}&listCursor=${cursors.list}&hasMoreDialogues=${hasMore.dialogue}&hasMoreThreads=${hasMore.thread}&hasMoreLists=${hasMore.list}`)
            const results = await response.json()
            // console.log('HASMORES FROM RESULTS', results.hasMoreDialoguesServer, results.hasMoreThreadsServer, results.hasMoreListsServer,)
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
            // console.log("SET HASMORES", hasMore)
            setLoading(false)
        }
    }

    useEffect(() => {
        getProfileFeed()
    }, [userId])

    return { data, loading, hasMore, cursors, refetch : getProfileFeed } 
}
