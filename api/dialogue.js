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

export const fetchDialogues = async ( token ) => {
    try {
        console.log('trying to fetch');
        console.log('token', token)
        const request = await fetch (`${nodeServer.expressServer}/dialogue/fetch-all`, {
            method : 'GET',
            headers : {
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        });
        const response = await request.json();
        // console.log('resposne ', response.dialogues)
        return response.dialogues
    } catch (err) {
        console.log(err)
    }
}