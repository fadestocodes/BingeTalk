
// import { Modal, View, Text, Pressable } from "react-native";
// import ConfettiCannon from "react-native-confetti-cannon";
// import { useEffect, useRef } from "react";

// export default function BadgeLevelUpModal({ visible, onClose, badgeType, level }) {
//   const confettiRef = useRef(null);
//   console.log('triggering hte badge modal!')
//   console.log('modal visile?', visible)

//   useEffect(() => {
//     if (visible && confettiRef.current) {
//       confettiRef.current.start();

//     }
//   }, [visible]);

//   if (!visible) return null;

//   return (
//     <>
//     {visible && (
//         <View
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0,0,0,0.6)",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 9999, // ensure it's above everything
//           }}
//         >
//           <View
//             style={{
//               width: "100%",
//               height:'100%',
//               padding: 20,
//               backgroundColor: "white",
//               borderRadius: 20,
//               alignItems: "center",
//               justifyContent:'center'
//             }}
//           >
//             <Text style={{ fontSize: 24, fontWeight: "bold" }}>🎉 Level Up!</Text>
//             <Text style={{ textAlign: "center", marginTop: 10 }}>
//               You’ve reached <Text style={{ fontWeight: "bold" }}>{level}</Text> level for your <Text style={{ fontWeight: "bold" }}>{badgeType}</Text> badge!
//             </Text>
//             <Pressable
//               onPress={onClose}
//               style={{ marginTop: 20, backgroundColor: "blue", padding: 10, borderRadius: 10 }}
//             >
//               <Text style={{ color: "white", textAlign: "center" }}>Got it!</Text>
//             </Pressable>
//           </View>
//           <ConfettiCannon
//             count={80}
//             origin={{ x: 0, y: 0 }}
//             autoStart={false}
//             ref={confettiRef}
//             fadeOut
//             />
//         </View>
//       )}
//       </>
      
//   );
// }


import { View, Text, Pressable } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { useEffect, useRef, useState } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import {Image} from 'expo-image'
import {badgeIconMap} from '../constants/BadgeIcons'
import { Colors } from "@/constants/Colors";

export default function BadgeLevelUpModal({ visible, onClose, badgeType, level }) {
  const confettiRef = useRef(null);
  const opacity = useSharedValue(0); // for fade-in/fade-out

  const [badgeImage, setBadgeImage] = useState('')

  // const badgeData = badgeIconMap.find( i => i.type === badgeType )
  // const badgeImage = badgeData.levels[level]

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.ease) });
      if (confettiRef.current) confettiRef.current.start();
    } else {
      opacity.value = withTiming(0, { duration: 1500 });
    }

    if (!badgeType || !level) return;

    const badgeData = badgeIconMap.find( i => i.type === badgeType )
    const badgeImageData = badgeData.levels[level].uri
    setBadgeImage(badgeImageData)
  }, [visible, badgeType, level]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    
  }));

  if (!visible ) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        // zIndex: 9999,
        ...animatedStyle,
      }}
    >
      <View
        style={{
          width: "100%",
          height :'100%',
          padding: 20,
          backgroundColor: Colors.primary,

          borderRadius: 20,
          alignItems: "center",
          color: Colors.mainGray,
          justifyContent: "center",
        }}
      >

        <Image
            source={ badgeImage}
            width={200}
            height={200}
            contentFit='contain'
            style={{ overflow:'hidden', zIndex:9999}}
        />
        <Text style={{ fontSize: 24, fontWeight: "bold" , color:Colors.mainGray, paddingTop:20}}>🎉 Congratulations!</Text>
        <Text style={{ textAlign: "start", marginTop: 10, color:Colors.mainGray, paddingHorizontal:10 }}>
          You’ve unlocked the <Text style={{ fontWeight: "bold" }}>{level}</Text> level for the <Text style={{ fontWeight: "bold" }}>{badgeType}</Text> badge!{level !== 'GOLD' && ' Go to your Badges page to see how to unlock the next level'}
        </Text>
        <Text className="text-mainGray px-10"></Text>
        <Pressable
          onPress={onClose}
          style={{ marginTop: 20, backgroundColor: Colors.primaryLight, padding: 10, borderRadius: 10 }}
        >
          <Text style={{ color: "white", textAlign: "center", color:Colors.mainGray }}>Got it!</Text>
        </Pressable>
      </View>
      <ConfettiCannon
        count={80}
        origin={{ x: 0, y: 0 }}
        autoStart={false}
        ref={confettiRef}
        fadeOut
      />
    </Animated.View>
  );
}
