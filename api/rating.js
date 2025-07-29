import { useUser } from '@clerk/clerk-expo'
import * as nodeServer from '../lib/ipaddresses'
import { useState, useEffect } from 'react'
import { useFetchOwnerUser } from './user'
import { findDirector } from './tmdb'

export const createRating = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/rating/create`, {
            method : 'POST',
            headers : {
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

export const deleteRating = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/rating/delete`, {
            method : "POST",
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

export const useGetTitleRatings = (data) => {
    const [ratings, setRatings] = useState([])
    const [ cursor, setCursor ] = useState(null)
    const [ hasMore, setHasMore ] = useState(true)
    const [ isLoading, setIsLoading ] = useState(false)
    const { user : clerkUser } = useUser()
    const { data : ownerUser, refetch : refetchOwner } = useFetchOwnerUser({email:clerkUser?.emailAddresses[0]?.emailAddress})
    const { ratingsId, limit} = data
    let { type } = data
    const [ friendsRatings, setFriendsRatings ] = useState([])
    const [ director, setDirector ] = useState('')
    
    const getTitleRatings = async () => {
        if (!hasMore) return 
        setIsLoading(true)
        try {
            const response = await fetch(`${nodeServer.currentIP}/rating/?DBratingsId=${ratingsId}&type=${type}&cursor=${cursor}&take=${limit}`)
            const ratingsData = await response.json()
            console.log("RATINGSSSDATA", ratingsData.data)
            setRatings( prev => [...prev, ...ratingsData.data] )
            setRatings(ratingsData.data)
            setCursor(ratingsData.nextCursor)
            setHasMore(!!ratingsData.hasMore)

            const followingIds =  ownerUser.following.map( i => i.followerId ) 
            const filteredData = ratingsData.data.filter( i => followingIds.includes(i.user.id))

            setFriendsRatings(prev => [...prev, ...filteredData])

            if (!director){
                if( type === 'movie'){
                    type = 'MOVIE'
                } else if (type === 'tv'){
                    type = 'TV'
                }
                
                const tmdbId = type === 'MOVIE' ? ratingsData.data[0].movie.tmdbId : type === 'TV' ? ratingsData.data[0].tv.tmdbId : null
                console.log('TMDBIDDDD', tmdbId)
                const directorParams = {
                    type,
                    tmdbId 
                }
                const foundDirector = await findDirector(directorParams)
                console.log("FOUNDDIRECTORRR", foundDirector)
                setDirector(foundDirector)
            }



        } catch (err){
            console.log(err)
        } finally {
            setIsLoading(false)
        }

    }



    useEffect(() => {
        getTitleRatings()
    }, [ownerUser, ratingsId])

    const refetch = async () => {
        await refetchOwner()
        setIsLoading(true)
        try {
            const response = await fetch(`${nodeServer.currentIP}/rating/?DBratingsId=${ratingsId}&type=${type}&cursor=null&take=${limit}`)
            const ratingsData = await response.json()

            setRatings(ratingsData.data )
            setRatings(ratingsData.data)
            const followingIds =  ownerUser.following.map( i => i.followerId ) 
            const filteredData = ratingsData.data.filter( i => followingIds.includes(i.user.id))

            setFriendsRatings([...filteredData])

            setCursor(ratingsData.nextCursor)
            setHasMore(ratingsData.hasMore)


        } catch (err){
            console.log(err)
        } finally {
            setIsLoading(false)
        }

    }




    return { ratings, isLoading, ownerUser, refetch , fetchMore : getTitleRatings, hasMore, friendsRatings, director}

}