import { isDevelopmentBuild } from "expo-dev-client";

const IS_DEV = process.env.NODE_ENV === 'development';
export default {
  "expo": {
    "name": IS_DEV ? "Bingeable (dev)" :  "Bingeable",
    "slug": "bingeable-app",
    "version": "1.4.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": IS_DEV ? "bingeable-dev" : "bingeable",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": false,
      "usesAppleSignIn": true,
      "associatedDomains": [
        "webcredentials:bingeable.app"
      ],
      "config": {
        "usesNonExemptEncryption": false
      },
      "bundleIdentifier": IS_DEV ? "com.bingeableapp.dev" : "com.bingeableapp",
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "This app uses the photo library to allow you to upload images.",
        "NSCameraUsageDescription": "This app uses the camera to allow you to take pictures.",
        "ITSAppUsesNonExemptEncryption": false,
        "NSFaceIDUsageDescription": "Allow $(PRODUCT_NAME) to use Face ID for secure authentication.",
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true
        },
        "NSAllowsArbitraryLoadsInWebContent": true,
       
      } 
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/icon-adaptive.png",
        "backgroundColor": "#171717"
      },
      "permissions": [
        "android.permission.RECORD_AUDIO"
      ],
      "package": "com.bingeableapp"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-apple-authentication",
      "expo-build-properties",
      [
        "react-native-share",
        {
          "ios": [
            "fb",
            "instagram",
            "twitter",
            "tiktoksharesdk",
          ],
          "android": [
            "com.facebook.katana",
            "com.instagram.android",
            "com.twitter.android",
            "com.zhiliaoapp.musically",
          ],
          "enableBase64ShareAndroid": true
        }
      ],
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash.png",
          "resizeMode": "contain",
          "imageWidth": 200,
          "backgroundColor": "#171717"
        }
      ],
      
      "expo-font",
      [
        'expo-dev-client',
        {
          addGeneratedScheme: !!IS_DEV,
        },
      ],
      "expo-video",
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow $(PRODUCT_NAME) to access your photo library to choose a picture.",
          "cameraPermission": "Allow $(PRODUCT_NAME) to use the camera to take a picture."
        }
      ],
      [
        "@sentry/react-native/expo",
        {
          "url": "https://sentry.io/",
          "project": "bingeable",
          "organization": "bingeable-as"
        }
      ],
      [
        "expo-secure-store",
        {
          "configureAndroidBackup": true,
          "faceIDPermission": "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      CLERK_PUBLISHABLE_KEY: IS_DEV
      ? process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY_DEV
      : process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY_PROD,
      "router": {
        "origin": false
      },
     
      "eas": {
        "projectId": "22b71ce8-541c-4ce9-8b6d-25e2f5e0b173"
      }
    },
    "owner": "fadestocodes"
  }
}
