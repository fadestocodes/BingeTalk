
import * as nodeServer from '../lib/ipaddresses'

export const checkCriticBadgeProgress = async (reviewId, userId) => {
    if (!reviewId || !userId) return 
    try {
        const response = await fetch(`${nodeServer.currentIP}/badge/critic`, {
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
        
        const response = await fetch(`${nodeServer.currentIP}/badge/historian`, {
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