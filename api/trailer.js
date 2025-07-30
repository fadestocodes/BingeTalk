import * as nodeServer from '../lib/ipaddresses'
import { useEffect, useState } from 'react'

export const useFetchTrailers =  () => {

    const [ trailers, setTrailers ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)



    const fetchTrailers = async () => {
        console.log("FETCHING TRAILERS!")
        
        try {
            const res = await fetch (`${nodeServer.currentIP}/trailers`)
            const data = await res.json()
            setTrailers(data)

        } catch (err){
            console.log(err)
        }

    }

    useEffect(() => {
        fetchTrailers()
    }, [])

    return { trailers, isLoading }

}