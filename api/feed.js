import * as nodeServer from '../lib/ipaddresses'
import React, {useState, useEffect} from 'react'
import { apiFetch } from './auth';


export const useGetFeed = ( userId, limit ) => {
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ hasMore, setHasMore ] = useState(true);
    const [ cursor, setCursor ] = useState(null);

    const getFeed = async () => {
        if (!hasMore) return
        try {
            setLoading(true);
            const request = await apiFetch (`${nodeServer.currentIP}/feed?userId=${userId}&limit=${limit}&cursor=${cursor}`);
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
        review : true,
        list : true
    })
    const [ cursors, setCursors ] = useState({
        dialogue : null,
        review : null,
        list : null
    })

    const getProfileFeed = async () => {
        if (!hasMore.dialogue && !hasMore.thread && !hasMore.list) return
        try {
            setLoading(true)
            const response = await apiFetch(`${nodeServer.currentIP}/feed/profile-page?id=${userId}&limit=${limit}&dialogueCursor=${cursors.dialogue}&reviewCursor=${cursors.review}&listCursor=${cursors.list}&hasMoreDialogues=${hasMore.dialogue}&hasMoreReviews=${hasMore.review}&hasMoreLists=${hasMore.list}`)
            const results = await response.json()
            setData(prev => ([...prev, ...results.items]))
            setHasMore({
                dialogue : !!results.nextDialogueCursor,
                review : !!results.nextReviewCursor,
                list : !!results.nextListCursor
            })
            setCursors(prev => ({
                ...prev,
                dialogue : results.nextDialogueCursor,
                review : results.nextReviewCursor,
                list : results.nextListCursor
            }))

        } catch (err){
            console.log(err)
        } finally {
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
        try {
            setLoading(true)

            const response = await apiFetch(`${nodeServer.currentIP}/feed/profile-page?id=${userId}&limit=${limit}&dialogueCursor=null&reviewCursor=null&listCursor=null&hasMoreDialogues=true&hasMoreReviews=true&hasMoreLists=true`)
            const results = await response.json()
            setData(results.items)
            setHasMore({
                dialogue : !!results.nextDialogueCursor,
                review : !!results.nextReviewCursor,
                list : !!results.nextListCursor
            })
            setCursors({
                dialogue : results.nextDialogueCursor,
                review : results.nextReviewCursor,
                list : results.nextListCursor
            })

        } catch (err){
            console.log(err)
        } finally {
            setLoading(false)

        }
    }

    return { data, loading, hasMore, cursors, refetch ,fetchMore:getProfileFeed , removeItem} 
}
