import * as nodeServer from '../lib/ipaddresses'

export const newRecommendation = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/user/recommend-to-friend`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        const response = await request.json();
        return response
    } catch (err){
        console.log(err)
    }
}

export const mySentRecommendations = async (userId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/`)
    } catch (err){
        console.log(err)
        
    }
}

export const deleteRecommendation = async (data) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/recommendation/delete`, {
            method : 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body:JSON.stringify(data)
        })
        const response = await request.json()
        console.log(response)
        return response
    } catch (Err) {
        console.log(Err)
    }
}