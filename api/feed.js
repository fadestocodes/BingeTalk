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