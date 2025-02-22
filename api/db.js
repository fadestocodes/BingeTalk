import * as nodeServer from '../lib/ipaddresses'

export const findOrCreateEntity = async (type, movieData, personData) => {
    let entity;

    if (type === 'movie') {
       
        try {
            entity = await fetch (`${nodeServer.expressServerHotspot}/movie/find-or-create`, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body:JSON.stringify({movieData})
            })
            const response = await entity.json();
            console.log('response', response);
            return response
        } catch (err) {
            console.log(err)
        }
    } else if (type === 'tv') {
        try {
            entity = await fetch (`${nodeServer.expressServerHotspot}/tv/find-or-create`, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body:JSON.stringify({movieData})
            })
            const response = await entity.json();
            console.log('response', response);
            return response
        } catch (err) {
            console.log(err)
        }
    } else if (type === 'person') {
        try {
            entity = await fetch (`${nodeServer.expressServerHotspot}/person/find-or-create`, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body:JSON.stringify({personData})
            })
            const response = await entity.json();
            console.log('response', response);
            return response
        } catch (err) {
            console.log(err)
        }
    }

};
