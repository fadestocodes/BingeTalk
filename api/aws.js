import * as nodeServer from '../lib/ipaddresses'
import { apiFetch } from './auth';

export const uploadToS3 = async ( fileUri, fileName, fileType ) => {
  
    try {
      const response = await apiFetch (`${nodeServer.currentIP}/aws/s3-upload`, {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({fileName, fileType})
      });
      const {url, location} = await response.json();
      console.log('res from uploadtos3', url, location)
      try {
        const uploadResponse = await fetch(url, {
          method: 'PUT',
          headers: {
              'Content-Type': fileType,
          },
          body: {
              uri: fileUri,
              type: fileType,
              name: fileName,
          },
        });
        return location;
      } catch (err) {
        console.log('Error uploading to S3', err)
      }
  
    } catch(err) {
      console.log('Error getting presigned url', err)
    }
  }