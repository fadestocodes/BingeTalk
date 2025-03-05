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