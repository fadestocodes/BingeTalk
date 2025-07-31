import * as nodeServer from '../lib/ipaddresses'

export const submitFeedback = async (params) => {
    try {
        const res = await fetch(`${nodeServer.currentIP}/submit-feedback`, {
            method : "POST",
            headers:{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify(params)
        })

        const data = await res.json()

        return data
    } catch (err){
        console.log(err)
        return err
    }
}