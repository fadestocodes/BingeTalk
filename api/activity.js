import * as nodeServer from '../lib/ipaddresses'

export const addActivity = async ( activityData ) => {
    try {
        const request = await fetch (`${nodeServer.expressServerHotspot}/activity/create`, {
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