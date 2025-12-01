import * as nodeServer from '../lib/ipaddresses'


export const reportPost = async (data) => {
    try {
        const response = await apiFetch(`${nodeServer.currentIP}/report`, {
            method:'POST',
            headers:{
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        return result
    } catch (err) {
        console.log(err)
    }
}