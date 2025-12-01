import { Linking, Platform } from "react-native";
import Share from "react-native-share";



// export const shareToInstagramStory = async (uri) => {
//     const instagramURL = "instagram-stories://share";
  
//     const canOpen = await Linking.canOpenURL(instagramURL);
//     if (!canOpen) {
//       alert("Instagram is not installed");
//       return;
//     }
  
//     if (Platform.OS === "ios") {
//       await Linking.openURL(
//         instagramURL +
//           `?backgroundImage=${encodeURIComponent(uri)}`
//       );
//     } 
    
//     // else {
//     //   // Android uses Intent
//     //   await IntentLauncher.startActivityAsync("com.instagram.share.ADD_TO_STORY", {
//     //     data: uri,
//     //     flags: 1,
//     //     type: "image/png",
//     //   });
//     // }
//   };
export const shareToInstagramStory = async (data, hasInstagramInstalled) => {

    try {
        // Capture the screenshot of the element and store it into the uri variable
      
    
        if (hasInstagramInstalled === true) {
          await Share.shareSingle(data);
        } else {
          // If instagram is not installed in user's device then just share using the usual device specific bottomsheet (https://react-native-share.github.io/react-native-share/docs/share-open)
          await Share.open({ url: uri });
        }
      } catch (error) {
        console.error(error);
      }
}