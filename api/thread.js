import * as nodeServer from '../lib/ipaddresses'

export const createThread = async ( threadData ) => {
    console.log('threadData', threadData)
    try {
        const request = await fetch(`${nodeServer.currentIP}/thread/create`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify( threadData )
        })
        const response = await request.json()
        return response
    } catch (err) {
        console.log(err)
    }
}

export const fetchSingleThread = async (threadId) => {
    try {
        const request = await fetch(`${nodeServer.currentIP}/thread?threadId=${threadId}`)
        const response = await request.json()
        return request
    } catch (err) {
        console.log(err)
    }
}