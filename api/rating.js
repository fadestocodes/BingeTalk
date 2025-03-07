import * as nodeServer from '../lib/ipaddresses'

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
