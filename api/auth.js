import * as nodeServer from '../lib/ipaddresses'

export const addUser = async ( userObj ) => {
    const {  } = userObj
    try {
        const res = await fetch (`${nodeServer.expressServer}/auth/add-user`, {
            method : 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body : 
        })
    } catch (err) {
        console.log(err);
    }

}