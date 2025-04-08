import * as nodeServer from '../lib/ipaddresses'

export const getLinkPreview = async (url) => {
    try {
        const response = await fetch(`${nodeServer.currentIP}/link-preview?url=${url}`)
        const data = await response.json()

        return data
    } catch (err){
        console.log(err)
    }
}