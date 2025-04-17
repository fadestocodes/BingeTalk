import * as nodeServer from '../lib/ipaddresses'

export const findOrCreateEntity = async (type, movieData, castData) => {
    let entity;

    if (type === 'movie') {
       
        try {
            entity = await fetch (`${nodeServer.currentIP}/movie/find-or-create`, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body:JSON.stringify({movieData})
            })
            const response = await entity.json();
            console.log("CREATINGMOVIEENTITY", response)
            return response
        } catch (err) {
            console.log(err)
        }
    } else if (type === 'tv') {
        try {
            entity = await fetch (`${nodeServer.currentIP}/tv/find-or-create`, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body:JSON.stringify({tvData : movieData})
            })
            const response = await entity.json();
            return response
        } catch (err) {
            console.log(err)
        }
    } else if (type === 'person') {
        try {
            entity = await fetch (`${nodeServer.currentIP}/person/find-or-create`, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body:JSON.stringify({castData})
            })
            const response = await entity.json();
            return response
        } catch (err) {
            console.log(err)
        }
    }

};
