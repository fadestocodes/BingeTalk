import * as nodeServer from '../lib/ipaddresses'

export const createComment = async ( commentData ) => {
    console.log('commentData',commentData)
    try {
        console.log('trting to create comment')
        const request = await fetch(`${nodeServer.expressServerHotspot}/comment/create`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify( commentData )
        })

        const newComment = await request.json();
        console.log('newcomment', newComment)
        return newComment;
    } catch (err) {
        console.log(err)
    }
}