import * as nodeServer from '../lib/ipaddresses'

export const uploadToS3 = async ( fileUri, fileName, fileType ) => {
    // console.log('filename is ', fileName)
    // console.log('filetype is ', fileType)
  
    try {
      const response = await fetch (`${nodeServer.expressServer}/aws/s3-upload`, {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({fileName, fileType})
      });
      const {url, location} = await response.json();
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