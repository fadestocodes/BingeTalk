import * as nodeServer from '../lib/ipaddresses'
import { useState, useEffect } from 'react';
import { apiFetch } from './auth';

export const findOrCreateEntity = async (type, movieData, castData) => {
    let entity;

    if (type === 'movie') {
       
        try {
            entity = await apiFetch (`${nodeServer.currentIP}/movie/find-or-create`, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body:JSON.stringify({movieData})
            })
            const response = await entity.json();
            console.log("CREATINGMOVIEENTITY", response)
            return response
        } catch (err) {
            console.log(err)
        }
    } else if (type === 'tv') {
        try {
            entity = await apiFetch (`${nodeServer.currentIP}/tv/find-or-create`, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body:JSON.stringify({tvData : movieData})
            })
            const response = await entity.json();
            return response
        } catch (err) {
            console.log(err)
        }
    } else if (type === 'person') {
        try {
            entity = await apiFetch (`${nodeServer.currentIP}/person/find-or-create`, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body:JSON.stringify({castData})
            })
            const response = await entity.json();
            return response
        } catch (err) {
            console.log(err)
        }
    }

};

export const useGetMovieOrTvFromDB = (params) => {
    const [ isLoading, setIsLoading ]  = useState(true)
    const [ movie, setMovie ] = useState(null)
    const [ tv, setTv] = useState(null)
    const { DBmovieId, DBtvId } = params

    const getMovieOrTvFromDB = async () => {

        try {
            if (DBmovieId){
                const res = await apiFetch(`${nodeServer.currentIP}/movie?DBmovieId=${DBmovieId}`)
                const data = await res.json()
                setMovie(data)
                setTv(null)
            } else if (DBtvId){
                const res = await apiFetch(`${nodeServer.currentIP}/tv?DBmovieId=${DBmovieId}`)
                const data = await res.json()
                setTv(data)
                setMovie(null)
            }
        } catch(err){
            console.log(err)
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(()=> {
        getMovieOrTvFromDB()
    }, [DBmovieId, DBtvId])

    return { isLoading, movie, tv }
}
