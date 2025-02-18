import * as nodeServer from '../lib/ipaddresses'

export const createDialogue = async ( postData ) => {

    try {
        console.log('trying to createDialogue')
        const request = await fetch (`${nodeServer.expressServer}/dialogue/create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( postData )
        })
        const response = await request.json();
        console.log('response', response)
        return response
    } catch (err) {
        console.log(err)
    }
}