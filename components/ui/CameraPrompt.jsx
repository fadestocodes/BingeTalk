
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Linking, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions, CameraFlashMode } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Check, CircleCheck, Download, Image as ImageIcon, Info, Repeat2, X, Zap, ZapOff } from "lucide-react-native";
import { Image } from "expo-image";
import { Colors } from "../../constants/Colors";
import NotificationModal from "./NotificationModal";
import ToastMessage from "./ToastMessage";
import { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated'
import Animated, { Easing, withTiming, useSharedValue, withDelay } from 'react-native-reanimated';
import ArrowNextButton from "./ArrowNextButton";
import { pickSingleImage } from "../../lib/pickImage";
import { createSetDay } from "../../api/setDay";
import { uploadToS3 } from "../../api/aws";
import { maybeAskForReview } from "../../lib/maybeAskForReview";
import * as ImagePicker from 'expo-image-picker';


export default function CameraPrompt() {
  const [showCamera, setShowCamera] = useState(false);
  const [latestPhoto, setLatestPhoto] = useState(null);
  const [flashMode, setFlashMode] = useState('off')
  const [whichCamera, setWhichCamera] = useState('back')
  const cameraRef = useRef(null)
  const [uri, setUri] = useState('')
  const [showMediaPermissionPrompt, setShowMediaPermissionPrompt] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [stepTwo, setStepTwo] = useState(false)
  const [inputs, setInputs] = useState({
    caption : '',
    production : ''
  })
  const [uploading, setUploading] = useState(false)
  const [dynamicIcon, setDynamicIcon] = useState(null)
  const keyboard = useAnimatedKeyboard();

  const translateStyle = useAnimatedStyle(() => {
    return {
        transform: [{ translateY: -keyboard.height.value*.3}],
    };
    });

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
    if (!cameraPermission?.granted) {
      await requestCameraPermission();
    }
  
    // if (!mediaPermission?.granted) {
    //   await requestMediaPermission();
    // }


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
        // Save to gallery (optional)
        // await MediaLibrary.createAssetAsync(photo.uri);
        setUri(photo.uri);
      } catch (err) {
        console.error("Error taking picture:", err);
      }
    }
  };

  const savePhoto = async () => {
    if (!mediaPermission.granted){
        setShowMediaPermissionPrompt(true)
    }
    const res = await MediaLibrary.createAssetAsync(uri);
    if (res){
        setToastMessage("Successfully saved media")
        setDynamicIcon(<ImageIcon size={30} color={Colors.secondary} />)
    }
  }

  const handleStepTwo = () => {
    if (uri){
        setStepTwo(true)
    }
  }

  const handleInputs = (name, value) => {
    setInputs(prev => ({
        ...prev,
        [name] : value
    }))
  }

  const handleReset = () => {
    setUri('')
    setStepTwo(false)
    setInputs({
        caption  :'',
        production : ''
    })
  }

  const handlePost = async () => {
    try {
        setUploading(true)
        
        const extension = uri.split('.').pop().toLowerCase(); // e.g. "jpg", "jpeg", "png"
        const mimeTypeMap = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            heic: "image/heic",
            webp: "image/webp"
          };
          
        const mimeType = mimeTypeMap[extension] || "image/jpeg";
        const fileName = `${Date.now()}.jpg`;

        const s3res = await uploadToS3(uri,fileName, mimeType )


        if (s3res){

            const data = {
                caption : inputs.caption.trim(),
                production : inputs.production.trim(),
                image : s3res,
            }
            const res = await createSetDay(data)
            setToastMessage(res.message)
            if (res.success){
                setDynamicIcon( <CircleCheck size={30} color={Colors.secondary} /> )
            } else {
                setDynamicIcon( <Info size={30} color={Colors.secondary} /> )
            }
        }
    } catch (err){
        console.error(err)
    } finally {
        setInputs({
            caption : '',
            production : '',
        })
        setStepTwo(false)
        setUri('')
        setUploading(false)
        await maybeAskForReview()
    }
  }

  const handleLibraryPicker = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log(status)
    if (status !== 'granted') {
        setShowMediaPermissionPrompt(true)
        return
    } else {
        setShowMediaPermissionPrompt(false)
    }
  
    // Launch picker
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], 
        allowsEditing: true,
        quality: 1,
    });

    
    if (!result.canceled) {
      // result.assets = [{ uri: 'file://…' }]
      const picked = result.assets[0].uri;
      setUri(picked); // assuming you already have setImage
    }
  };

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
<ToastMessage message={toastMessage} onComplete={() => setToastMessage('')} icon={dynamicIcon} />
    { showMediaPermissionPrompt ? (
        <View className="flex-1 mb-20 relative" >
        <NotificationModal
            showLogo={true}
            title="Media permissions are required."
            description="Turn on permissions to access your Photos"
            yesText="Go To Settings"
            handleYes={()=>Linking.openSettings()}
        />
    </View>
    ) :(

    stepTwo ? (
        <Animated.View className="flex-1 pt-10 justify-start items-center gap-3 flex flex-col" style={translateStyle}>

            { uploading ? (
                <ActivityIndicator />
            ) : (

                <View className="w-full justify-center items-center relative px-14 gap-3">
                    <TouchableOpacity onPress={handleReset} className="h-[26px] w-[26px] rounded-full p-3 bg-primaryLight justify-center items-center absolute right-[160px] z-10 top-1" >
                        <X color={Colors.mainGray} className="" />
                    </TouchableOpacity>
                    <Image
                        source={uri}
                        contentFit="cover"
                        width={80}
                        height={120}
                        style={{overflow:'hidden', borderRadius:10, position:'relative'}}
                    />
                    <View className="pt-10 relative gap-3">
                        <Text className='text-mainGrayLight text-sm text-start'>* Be careful not to include any sensitive production details. When in doubt, check with Production first!</Text>
                        <TextInput 
                            value={inputs.production}
                            onChangeText={(text) => handleInputs('production', text) }
                            placeholder="Production name if allowed to share (will default to 'Undisclosed' if empty)"
                            multiline
                            placeholderTextColor={Colors.mainGrayDark}
                            maxLength={200}
                            className="bg-primaryDark relative w-[300px] max-h-[75px] px-4 py-4 rounded-xl text-mainGray  justify-start items-start "
                        />
                        <TextInput 
                            value={inputs.caption}
                            onChangeText={(text) => handleInputs('caption', text) }
                            placeholder="Caption"
                            multiline
                            placeholderTextColor={Colors.mainGrayDark}
                            maxLength={200}
                            className="bg-primaryDark relative w-[300px] min-h-[100px] max-h-[200px] px-4 py-4 rounded-xl text-mainGray  justify-start items-start "
                        />
                        <Text className="absolute bottom-3 right-3 text-mainGray">{inputs.caption.length} / 200</Text>
                    </View>
                    <View className="w-full justify-end items-end">
                        <ArrowNextButton onPress={handlePost}/>
                    </View>
                </View>
            ) }

            </Animated.View>
    ) : (

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
                <TouchableOpacity onPress={handleStepTwo} className=" bg-primary opacity-50 rounded-full p-3">
                    <Check size={30} color={Colors.mainGray} />
                </TouchableOpacity>
                </>
            ) : (
            <>
            <TouchableOpacity onPress={handleLibraryPicker} className="opacity-70">
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
    )

    )}
    </>
  );
}
