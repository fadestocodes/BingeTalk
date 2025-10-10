
import * as nodeServer from '../lib/ipaddresses'

export const checkCriticBadgeProgress = async (reviewId, userId) => {
    if (!reviewId || !userId) return 
    try {
        console.log('trying')
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
        console.log(err)
        console.error(err)
    }
}