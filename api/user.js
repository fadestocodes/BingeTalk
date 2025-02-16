import * as nodeServer from '../lib/ipaddresses'

// export const addUser = async ( userObj ) => {
//     const {  } = userObj
//     try {
//         const res = await fetch (`${nodeServer.expressServer}/auth/add-user`, {
//             method : 'POST',
//             headers: {
//                 'Content-Type' : 'application/json'
//             },
//             body : 
//         })
//     } catch (err) {
//         console.log(err);
//     }

// }


export const checkUsername = async ( username ) => {
    try {
        const response = await fetch(`${nodeServer.expressServer}/user/check-username?username=${username}`)
        const data = await response.json();
        return data
    }  catch (err) {
        console.log(err)
    }
}


export const checkEmail = async (email) => {
    try {
        const response = await fetch(`${nodeServer.expressServer}/user/check-email`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({ email })
        })
        const data = await response.json()
        return data
    } catch (err) {
        console.log(err)
    }
}