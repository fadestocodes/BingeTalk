import * as nodeServer from '../lib/ipaddresses'
import { apiFetch } from './auth'

export const getLinkPreview = async (url) => {
    try {
        const response = await apiFetch(`${nodeServer.currentIP}/link-preview?url=${url}`)
        const data = await response.json()

        return data
    } catch (err){
        console.log(err)
    }
}