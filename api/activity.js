import * as nodeServer from '../lib/ipaddresses'

export const addActivity = async ( activityData ) => {
    try {
        const request = await fetch (`${nodeServer.currentIP}/activity/create`, {
            method : 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(activityData)
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log(err)
    }
}

export const likeActivity = async (data) => {
    try {
        const request = await fetch (`${nodeServer.currentIP}/activity/interact`, {
            method : 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body: JSON.stringify(data)
        })
        const response = await request.json();
        console.log('response', response)
        return response
    } catch (err){
        console.log(err)
        
    }
}