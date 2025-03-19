import * as nodeServer from '../lib/ipaddresses'


export const reportPost = async (data) => {
    try {
        console.log('datahere', data)
        const response = await fetch(`${nodeServer.currentIP}/report`, {
            method:'POST',
            headers:{
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        console.log('report result' ,result)
        return result
    } catch (err) {
        console.log(err)
    }
}