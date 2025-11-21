// import { View, Text, StyleSheet } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withRepeat,
//   withTiming,
// } from "react-native-reanimated";
// import { useEffect } from "react";
// import { Colors } from "../../constants/Colors";

// const metallicColors = {
//   BRONZE: ["#7a4b23", "#c08a4c", "#7a4b23"],
//   SILVER: ["#6e6e6e", "#e7e7e7", "#6e6e6e"],
//   GOLD: ["#b8860b", "#ffd700", "#b8860b"],
// };

// export default function BadgePill({ level = "GOLD" }) {
//   const colors = metallicColors[level] || metallicColors.SILVER;

//   // Shine animation progress
//   const shineX = useSharedValue(-150);

//   useEffect(() => {
//     shineX.value = withRepeat(
//       withTiming(200, { duration: 7000 }),
//       -1, // infinite loop
//       false
//     );
//   }, []);

//   const shineStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: shineX.value }],
//   }));

//   return (
//     <View style={styles.container}>
//       {/* Main metallic gradient */}
//       <LinearGradient colors={colors} style={styles.pill}>
//         <Text style={styles.text}>{level}</Text>

//         {/* Animated shine swipe */}
//         <Animated.View style={[styles.shineWrapper, shineStyle]}>
//           <LinearGradient
//             colors={["transparent", metallicColors[level][0], "transparent"]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.shine}
//           />
//         </Animated.View>
//       </LinearGradient>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignSelf: "flex-start",
//   },
//   pill: {
//     paddingHorizontal: 8,
//     paddingVertical: 5,
//     borderRadius: 999,
//     overflow: "hidden", // needed for shine clipping
//   },
//   text: {
//     color: 'white',
//     fontWeight: "bold",
//     fontSize: 10,
//   },
//   shineWrapper: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     width: 80, // width of shine beam
//   },
//   shine: {
//     flex: 1,
//   },
// });

import { View, Text, Animated, StyleSheet, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";

const LEVEL_COLORS = {
  BRONZE: ["#b87333", "#cd7f32"],
  SILVER: ["#C0C0C0", "#E0E0E0"],
  GOLD: ["#D4AF37", "#FFD700"],
};

export default function BadgePill({ level = "GOLD", paddingHorizontal = 10, paddingVertical = 3 }) {
  const shineAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Continuous horizontal shine
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 5000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    ).start();

    // Pulsating shimmer
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 0.7,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300], // move far enough to cover any text width
  });

  const shineOpacity = shimmerAnim;

  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal, paddingVertical, borderRadius: 999 },
      ]}
    >
      {/* Base metallic gradient */}
      <LinearGradient
        colors={LEVEL_COLORS[level]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Diagonal animated shine */}
      <Animated.View
        style={{
          position: "absolute",
          width: "50%",
          height: "150%",
          transform: [{ translateX }, { rotate: "25deg" }],
          opacity: shineOpacity,
        }}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.35)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>

      {/* Text */}
      <Text style={styles.text}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 10,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)", // subtle black shadow
  textShadowOffset: { width: 0, height: 1 }, // slight vertical offset
  textShadowRadius: 1, // small blur radius
  },
});


// import { View, Text, Animated, StyleSheet, Easing } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRef, useEffect } from "react";

// const LEVEL_COLORS = {
//   BRONZE: ["#b87333", "#cd7f32"],
//   SILVER: ["#C0C0C0", "#E0E0E0"],
//   GOLD: ["#D4AF37", "#FFD700"],
// };

// export default function BadgePill({ level = "GOLD" }) {
//   const glowAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(glowAnim, {
//           toValue: 1,
//           duration: 2000,
//           easing: Easing.inOut(Easing.sin),
//           useNativeDriver: false,
//         }),
//         Animated.timing(glowAnim, {
//           toValue: 0,
//           duration: 2000,
//           easing: Easing.inOut(Easing.sin),
//           useNativeDriver: false,
//         }),
//       ])
//     ).start();
//   }, []);

//   const glowInterpolation = glowAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 20], // blur/shadow radius
//   });

//   const glowOpacity = glowAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.3, 0.8], // subtle to strong glow
//   });

//   return (
//     <View style={styles.container}>
//       {/* Glow behind pill */}
//       <Animated.View
//         style={{
//           position: "absolute",
//           top: -5,
//           left: -5,
//           right: -5,
//           bottom: -5,
//           borderRadius: 50,
//           opacity: glowOpacity,
//           backgroundColor: LEVEL_COLORS[level][1],
//           shadowColor: LEVEL_COLORS[level][1],
//           shadowOffset: { width: 0, height: 0 },
//           shadowRadius: glowInterpolation,
//           shadowOpacity: 1,
//         }}
//       />

//       {/* Main gradient pill */}
//       <LinearGradient
//         colors={LEVEL_COLORS[level]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.pill}
//       >
//         <Text style={styles.text}>{level}</Text>
//       </LinearGradient>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignSelf: "flex-start",
//   },
//   pill: {
//     borderRadius: 50,
//     paddingHorizontal: 5,
//     paddingVertical: 1,
//     overflow: "hidden",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   text: {
//     color: "white",
//     fontWeight: "bold",
//     textTransform: "uppercase",
//   },
// });
