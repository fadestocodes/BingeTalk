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

export const addUser =  async ( { firstName, lastName, email, username } ) => {
    try {
        const response = await fetch (`${nodeServer.expressServer}/user/add-user`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify( { firstName, lastName, email, username } )
        })
        const data = await response.json();
        return data
    } catch(err) {
        console.log(err)
    }
}

export const updateUser = async ( params ) => {
    try {
        const request = await fetch(`${nodeServer.expressServer}/user/update-user`, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify( params )
        })
        const response = await request.json();
        console.log('response from updateUser ', response)
        return response; 
    } catch (err) {
        console.log(err)
    }
}

export const updateRotation =  async ( userId, rotationItems, listItemObj  ) => {
    try {
        const request = await fetch(`${nodeServer.expressServer}/user/current-rotation`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(  {userId, rotationItems, listItemObj} )
        })
        const response = await request.json();
        console.log('resposne from updateRotation', response)
    } catch (err) {
        console.log(err)
    }
}


export const fetchUser = async ( email ) => {
    try {
        const request = await fetch(`${nodeServer.expressServer}/user`, {
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body:JSON.stringify({email})
        })
        const response = await request.json();
        return response
    } catch (err) {
        console.log('Error fetching user from db', err)
    }
}