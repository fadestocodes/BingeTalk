
import * as nodeServer from '../lib/ipaddresses'
import { apiFetch } from './auth'

export const checkCriticBadgeProgress = async (reviewId, userId) => {
    if (!reviewId || !userId) return 
    try {
        const response = await apiFetch(`${nodeServer.currentIP}/badge/critic`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({reviewId, userId})
        })
        const result = await response.json()
        console.log('result', result)
        if (!response.ok){
            throw new Error("Unexpected error")
        }
        return result.data
    } catch (err){
        console.error(err)
    }
}

export const checkHistorianBadgeProgress = async (tmdbObj, type, userId) => {
    try {
        if (!tmdbObj || !userId) throw new Error ("Invalid parameters") 
        
        const response = await apiFetch(`${nodeServer.currentIP}/badge/historian`, {
            method : "POST",
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({ tmdbObj, type, userId })
        })

        if (!response.ok){
            throw new Error('Unexpected error')
        }
        const result = await response.json()
        console.log('resultfrom historain progress', result)
        return result.data

    } catch (err){
        console.error(err)

    }

}

export const checkCuratorBadge = async (likedByUserId, ownerUserId) => {
    try {
        if (!likedByUserId || !ownerUserId) throw new Error("Invalid parameters")
    } catch (err) {
        console.error(err)
    }
}

export const checkAuteurBadge = async (movieObj, userId) => {
    try {
        if (!movieObj || !userId) throw new Error("Invalid parameters")
        const response = await apiFetch(`${nodeServer.currentIP}/badge/auteur`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({movieObj, userId})
        })
        if (!response.ok) throw new Error("Unexpected error")
        const result = await response.json()
        console.log('auteur result', result.data)
        return result.data

    } catch(err){
        console.error(err)
    }
}

export const checkConversationalistBadge = async ( userId) => {
    try {
        if (!userId) throw new Error("Invalid parameters")
        const response = await apiFetch(`${nodeServer.currentIP}/badge/conversationalist`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({ userId})
        })
        if (!response.ok) throw new Error("Unexpected error")
        const result = await response.json()
        console.log('checking conversationslit badge', result?.data)
        return result.data

    } catch(err){
        console.error(err)
    }
}

export const checkTastemakerBadge = async (recommenderId) => {
    try {
        if (!recommenderId) throw new Error("Invalid recommenderId")
        const response = await apiFetch(`${nodeServer.currentIP}/badge/tastemaker`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({userId : recommenderId})
        })
        if (!response.ok) throw new Error("Unexpected error")
        const result = await response.json()
        return result.data
    } catch(err){
        console.error(err)
    }
}
