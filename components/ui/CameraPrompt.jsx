// import React, { useState } from "react";
// import { View, Button } from "react-native";
// import { Image } from "expo-image";
// import * as ImagePicker from "expo-image-picker";

// export default function CameraPrompt() {
//   const [image, setImage] = useState(null);

//   const openCamera = async () => {
//     // Request permission
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== "granted") {
//       alert("Camera permission is required!");
//       return;
//     }

//     // Open camera
//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: 'images',
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Button title="Open Camera" onPress={openCamera} />
//       {image && (
//         <Image
//           source={{ uri: image }}
//           width={200}
//           height={200}
//           style={{ marginTop: 20 }}
//         />
//       )}
//     </View>
//   );
// }


// import React, { useState } from "react";
// import { View, Button, Alert, ActivityIndicator } from "react-native";
// import { Image } from "expo-image";
// import * as ImagePicker from "expo-image-picker";
// import Constants from "expo-constants";

// export default function CameraPrompt() {
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const openCamera = async () => {
//     console.log("Checking camera permissions...");
//     try {
//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
//       console.log("Current camera permission status:", status);

//       if (status !== "granted") {
//         Alert.alert("Permission Required", "Camera permission is required!");
//         return;
//       }

//       console.log("Permission granted, opening camera...");
//       setLoading(true);

//       let result;
//       const isDevBuild =
//         Constants.appOwnership === "expo" || Constants.appOwnership === "standalone-dev";

//       try {
//         if (isDevBuild) {
//           console.log("Dev build detected: opening photo library instead of camera");
//           result = await ImagePicker.launchImageLibraryAsync({
//             quality: 1,
//           });
//         } else {
//           result = await ImagePicker.launchCameraAsync({
//             quality: 1,
//           });
//         }
//         console.log("Picker result:", result);
//       } catch (pickerError) {
//         console.warn("Picker failed, trying library as fallback:", pickerError);
//         result = await ImagePicker.launchImageLibraryAsync({
//           quality: 1,
//         });
//         console.log("Library fallback result:", result);
//       }

//       if (!result.canceled) {
//         setImage(result.assets[0].uri);
//         console.log("Selected image URI:", result.assets[0].uri);
//       } else {
//         console.log("User cancelled image selection.");
//       }
//     } catch (err) {
//       console.error("Unexpected error opening camera or library:", err);
//       Alert.alert("Error", "Unable to open camera or photo library.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Button title="Open Camera" onPress={openCamera} disabled={loading} />
//       {loading && (
//         <ActivityIndicator size="large" color="#4ade80" style={{ marginTop: 20 }} />
//       )}
//       {image && !loading && (
//         <Image
//           source={{ uri: image }}
//           width={200}
//           height={200}
//           style={{ marginTop: 20 }}
//         />
//       )}
//     </View>
//   );
// }


// import PhotoPreviewSection from '@/components/ui/PhotoPreviewSection';
// import { AntDesign } from '@expo/vector-icons';
// import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
// import { useRef, useState } from 'react';
// import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function Camera() {
//   const [facing, setFacing] = useState('back');
//   const [permission, requestPermission] = useCameraPermissions();
//   const [photo, setPhoto] = useState(null);
//   const cameraRef = useRef(null);

//   if (!permission) {
//     // Camera permissions are still loading.
//     return <View />;
//   }

//   if (!permission.granted) {
//     // Camera permissions are not granted yet.
//     return (
//       <View style={styles.container}>
//         <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
//         <Button onPress={requestPermission} title="grant permission" />
//       </View>
//     );
//   }

//   function toggleCameraFacing() {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   }

//   const handleTakePhoto =  async () => {
//     if (cameraRef.current) {
//         const options = {
//             quality: 1,
//             base64: true,
//             exif: false,
//         };
//         const takedPhoto = await cameraRef.current.takePictureAsync(options);

//         setPhoto(takedPhoto);
//     }
//   }; 

//   const handleRetakePhoto = () => setPhoto(null);

//   if (photo) return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto} />

//   return (
//     <View style={styles.container}>
//       <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//             <AntDesign name='retweet' size={44} color='black' />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
//             <AntDesign name='camera' size={44} color='black' />
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: 'transparent',
//     margin: 64,
//   },
//   button: {
//     flex: 1,
//     alignSelf: 'flex-end',
//     alignItems: 'center',
//     marginHorizontal: 10,
//     backgroundColor: 'gray',
//     borderRadius: 10,
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//   },
// });


import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Linking, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions, CameraFlashMode } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Check, Download, Image as ImageIcon, Repeat2, X, Zap, ZapOff } from "lucide-react-native";
import { Image } from "expo-image";
import { Colors } from "../../constants/Colors";
import NotificationModal from "./NotificationModal";
import ToastMessage from "./ToastMessage";

export default function CameraPrompt() {
  const [showCamera, setShowCamera] = useState(false);
  const [latestPhoto, setLatestPhoto] = useState(null);
  const [flashMode, setFlashMode] = useState('off')
  const [whichCamera, setWhichCamera] = useState('back')
  const cameraRef = useRef(null)
  const [uri, setUri] = useState('')
  const [showMediaPermissionPrompt, setShowMediaPermissionPrompt] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  // Permission hook
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  

  useEffect(() => {
    (async () => {
      
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status==='granted') {
        const assets = await MediaLibrary.getAssetsAsync({
          first: 1,
          sortBy: [["creationTime", false]], // newest first
          mediaType: ["photo"]
        });
  
        if (assets.assets.length > 0) {
          setLatestPhoto(assets.assets[0].uri);
        }
      }


    })();
  }, []);

  const handleFlashToggle = () => {
    const flashModes = ['off', 'on', 'auto']
    const currIndex = flashModes.indexOf(flashMode)
    const nextIndex = (currIndex + 1) % flashModes.length
    setFlashMode( flashModes[nextIndex] )
  }

  const handleCameraToggle = () => {
    if (whichCamera === 'back') {
        setWhichCamera('front')
    } else {
        setWhichCamera('back')
    }
  }

  // ✅ Take picture function
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        // if (!cameraPermission?.granted) return;
        // if (!mediaPermission?.granted) return;
        const photo = await cameraRef.current.takePictureAsync();
        console.log("Photo captured:", photo.uri);
        // Save to gallery (optional)
        // await MediaLibrary.createAssetAsync(photo.uri);
        setUri(photo.uri);
      } catch (err) {
        console.error("Error taking picture:", err);
      }
    }
  };

  const savePhoto = async () => {
    console.log('mediapermission', mediaPermission)
    if (!mediaPermission.granted){
        console.log('here')
        setShowMediaPermissionPrompt(true)
    }
    const res = await MediaLibrary.createAssetAsync(uri);
    console.log('res...',res)
    if (res){
        setToastMessage("Successfully saved media")
    }
  }

  // Loading permission state
  if (!cameraPermission) {
    return <Text>Loading...</Text>;
  }

  if (!cameraPermission?.granted) {
    return (
    //   <View style={{ padding: 20 }}>
    //     <Text style={{ marginBottom: 10 }}>
    //       Camera permission is required.
    //     </Text>

    //     <Button title="Try Again" />

    //     <Button title="Open Settings" onPress={() => Linking.openSettings()} />
    //   </View>
        <View className="flex-1 mb-20 relative" >
            <NotificationModal
                showLogo={true}
                title="Camera permission is required."
                description=""
                yesText="Go To Settings"
                handleYes={()=>Linking.openSettings()}
            />
        </View>
    );
  }

  // Step 3 → Permission granted → show the camera
  return (
<>
<ToastMessage message={toastMessage} onComplete={() => setToastMessage('')} icon={<ImageIcon size={30} color={Colors.secondary} />} />
    { showMediaPermissionPrompt ? (
        <View className="flex-1 mb-20 relative" >
        <NotificationModal
            showLogo={true}
            title="Media permission is required."
            description="Turn on permissions to access your Photos"
            yesText="Go To Settings"
            handleYes={()=>Linking.openSettings()}
        />
    </View>
    ) :(

    <CameraView
      style={{ flex: 1, position:"relative", justifyContent:'center ', alignItems:'center', borderRadius:30, overflow:'hidden', marginHorizontal:15, marginBottom:15}}
      facing={whichCamera}
      flash = {flashMode}
      ref={cameraRef}
    >
       

       {uri && (
        <View className="flex-1 w-full h-full">
            <Image
                source={uri}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                contentFit="cover"
            />
            
        </View>
        
        )}

        { !uri && (
        <TouchableOpacity onPress={handleCameraToggle} className="absolute  top-5 rounded-full p-2 opacity-50 justify-center items-center flex bg-mainGray">
            <Repeat2 size={30} color={Colors.primary} />
        </TouchableOpacity>
        )}
        <View className="justify-between items-center flex flex-row absolute bottom-5 w-full px-8 z-10">

            { uri ? (
                <>
                <TouchableOpacity onPress={()=>setUri('')} className=" bg-primary opacity-50 rounded-full p-3">
                    <X size={30} color={Colors.mainGray} />
                </TouchableOpacity>
                <TouchableOpacity onPress={savePhoto} className=" bg-primary opacity-50 rounded-full p-3">
                    <Download size={30} color={Colors.mainGray} />
                </TouchableOpacity>
                <TouchableOpacity className=" bg-primary opacity-50 rounded-full p-3">
                    <Check size={30} color={Colors.mainGray} />
                </TouchableOpacity>
                </>
            ) : (
            <>
            <TouchableOpacity className="opacity-70">
                { latestPhoto ? (
                    <Image 
                        source={latestPhoto}
                        width={50}
                        height={50}
                        contentFit="cover"
                        style={{borderRadius:10, overflow:'hidden'}}
                    />
                ) : (

                    <ImageIcon size={30} color={Colors.mainGray} />
                ) }
            </TouchableOpacity>
            <View className=" bottom-5 h-[85px] w-[85px] rounded-full border-4 border-white justify-center items-center">
                <TouchableOpacity onPress={takePicture} className="h-[65px] w-[65px] rounded-full bg-white opacity-50"/>
            </View>
            <TouchableOpacity onPress={handleFlashToggle} className=" opacity-70">
                { flashMode === 'off' ? (
                    <ZapOff size={30} color={Colors.mainGray}  />
                ) : 
                flashMode === 'auto' ? (
                    <View className="relative">
                        <Zap size={30} color={Colors.mainGray} />
                        <Text className="font-black text-mainGray text-xl -right-4 top-0 absolute">A</Text>
                    </View>
                ) : 
                flashMode === 'on' && (
                    <Zap size={30} color={Colors.mainGray} />
                )
                }
            </TouchableOpacity>
            </>
            ) }
        </View>
            
    </CameraView>
    )}
    </>
  );
}
