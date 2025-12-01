import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { uploadToS3 } from "../api/aws";


export const pickSingleImage = async (setImage, setLoadingImage) => {

    // const [image, setImage] = useState(null)

      // No permissions request is necessary for launching the image library

      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        
        setLoadingImage(true);
    if (!result.canceled) {
        const fileName = `${Date.now()}.jpg`;
        const fileUri = result.assets[0].uri; // Path to the image
        const fileType = result.assets[0].type; // Image type (e.g., "image/jpeg")
        try {
            const location = await uploadToS3(fileUri, fileName, fileType);
            console.log('image url', location)
            setImage(location)
        } catch (err) {
            console.log(err)
        }
        // return location
    }
    setLoadingImage(false)
};
export const pickMultipleImages = async (setImage, setLoadingImage) => {

    setLoadingImage(true);

    // Launch image picker to select multiple images
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Allow only images (if you want videos too, use the correct options)
      allowsMultipleSelection: true, // Multiple selection enabled (works only on iOS)
      selectionLimit: 10, // Maximum of 10 images
      aspect: [4, 3], // Aspect ratio for the image picker
      quality: 1, // Max quality
    });
  
    // Check if the user selected images
    if (!result.canceled) {
      const locations = []; // To hold the URLs for each image
  
      // Loop over each selected image
      for (const r of result.assets) {
        const fileName = `${Date.now()}.jpg`; // Naming each file uniquely
        const fileUri = r.uri; // Path to the image
        const fileType = r.type; // Type of image (e.g., image/jpeg)
  
        // Upload the image to S3 and get the location
        const location = await uploadToS3(fileUri, fileName, fileType);
  
        // Add the location to our locations array
        locations.push(location);
      }
  
      // Once all images are uploaded, update the image state
      setImage((prev) => [...prev, ...locations]);
    }
  
    // Set loading to false after the process is complete
    setLoadingImage(false);
};