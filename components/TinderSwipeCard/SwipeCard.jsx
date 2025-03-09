import React, { useRef , useCallback, useState} from "react";
import { View, Animated, PanResponder, Text, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import ToastMessage from "../ui/ToastMessage";
import { ListChecks, FastForward , BadgeHelp} from "lucide-react-native";
import { markMovieInterested, swipeMovieInterested } from "../../api/movie";
import { markTVInterested, swipeTVInterested } from "../../api/tv";
import { useFetchOwnerUser } from "../../api/user";
import { useUser } from "@clerk/clerk-expo";


const SwipeCard = ({ item, setItem, onLike, onReject, onSwipeUp, onAnimationEnd, nextItem }) => {
  const swipe = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const titlSign = useRef(new Animated.Value(1)).current;
  const { height } = Dimensions.get('screen');
  const router = useRouter()
  const [ loading, setLoading ] = useState(true)
  const [ message, setMessage  ] = useState(null)
  const [toastIcon, setToastIcon] = useState(null);
  


  const posterURLlow = "https://image.tmdb.org/t/p/w500";
  const posterURL = "https://image.tmdb.org/t/p/original";

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: swipe.x,
            dy: swipe.y,
          },
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease:  (_, { dx, dy }) => {
        if (dx > 120) {
          
          
         
          setMessage("Marked as Interested");
          setToastIcon(<BadgeHelp size={30} color={Colors.secondary} />); // Example icon

          // Swiped Right
          Animated.timing(swipe, {
            toValue: { x: 500, y: 0 },
            duration: 500,
            useNativeDriver: false,
          }).start(() => {
            onLike(item);  // Call after animation completes
            opacity.setValue(0); // Fade out current card
            swipe.setValue({ x: 0, y: 0 });
            onAnimationEnd(); // Notify TinderSwipeCard to set the new movie after animation is complete
          });
        } else if (dx < -120) {
          setMessage("Next");
          setToastIcon(<FastForward size={30} color={Colors.secondary} />); 
          // Swiped Left
          Animated.timing(swipe, {
            toValue: { x: -500, y: 0 },
            duration: 500,
            useNativeDriver: false,
          }).start(() => {
            onReject(item);  // Call after animation completes
            swipe.setValue({ x: 0, y: 0 });
            opacity.setValue(0); // Fade out current card
            onAnimationEnd(); // Notify TinderSwipeCard to set the new movie after animation is complete
          });
        } else if (dy < -120) {
         // Example icon
            Animated.timing(swipe, {
                toValue: { x: 0, y: -1100 },
                duration: 600,
                useNativeDriver: false,
              }).start(() => {

                opacity.setValue(0); // Fade out current card
                onSwipeUp(item)
                // setItem(item);
                swipe.setValue({ x: 0, y: 0 });
                // if (item.media_type === 'movie') {
                //     router.push(`/movie/${item.id}`)
                // } else if (item.media_type === 'tv') {
                //     router.push(`/tv/${item.id}`)
                // }
                // onAnimationEnd(); // Notify TinderSwipeCard to set the new movie after animation is complete
              });
        } else if (dy > 120 ){
            Animated.timing(swipe, {
              toValue: { x: 0, y: 1100 },
              duration: 600,
              useNativeDriver: false,
            }).start(() => {

              // onSwipeUp(item)
              router.back()
              // setItem(item);
              swipe.setValue({ x: 0, y: 0 });
              opacity.setValue(0); // Fade out current card
              // if (item.media_type === 'movie') {
              //     router.push(`/movie/${item.id}`)
              // } else if (item.media_type === 'tv') {
              //     router.push(`/tv/${item.id}`)
              // }
              // onAnimationEnd(); // Notify TinderSwipeCard to set the new movie after animation is complete
            });
        } else {
            // Reset Position
            Animated.spring(swipe, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }).start();

        }
      },
    })
  ).current;

  // Opacity on swipe direction
  const likeOpacity = swipe.x.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const rejectOpacity = swipe.x.interpolate({
    inputRange: [-50, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const rotate = Animated.multiply(swipe.x, titlSign).interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ['8deg', '0deg', '-8deg'],
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), { rotate }],
  };


  return (
  <View className="w-full h-full">
      <ToastMessage message={message} icon={toastIcon}  onComplete={()=>setMessage(null)} durationMultiple={0.7} />
    <View className='h-full w-full'>

        <Animated.View
        style={[
            styles.card,
            {
            transform: swipe.getTranslateTransform(),
            opacity, // Apply opacity transition for smooth fade
            },
        ]}
        {...panResponder.panHandlers}
        >
        <View style={styles.choiceContainer}>

            {/* Swipe Feedback
            <Animated.Text style={[styles.interested, animatedCardStyle, { opacity: likeOpacity }]}>
            ADD TO WATCHLIST
            </Animated.Text>
            <Animated.Text style={[styles.notInterested, animatedCardStyle, { opacity: rejectOpacity }]}>
            NOT INTERESTED
            </Animated.Text> */}
        </View>

        {/* Poster Image */}
        {/* { loading && <ActivityIndicator color={Colors.secondary} /> } */}
        <Image
            source={{ uri: `${posterURL}${item.movie ? item.movie.posterPath : item.tv ? item.tv.posterPath : item.poster_path}` }}
            placeholder={{ uri: `${posterURLlow}${item.movie ? item.movie.posterPath : item.tv ? item.tv.posterPath : item.poster_path}` }}
            placeholderContentFit="cover"
            style={styles.poster}
            contentFit='cover'
            // onLoad={()=>setLoading(false)}
        />

        {/* <Text style={styles.text}>
            {item.media_type === "movie" ? item.title : item.name}
        </Text> */}
     
        </Animated.View>

    </View>
    </View>
  );
};

export default SwipeCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    // shadowColor: "#000",
    // shadowOpacity: 0.3,
    // shadowOffset: { width: 0, height: 5 },
    // shadowRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 0, // No padding
    position:'relative'
  },
  choiceContainer: {
    position: "relative",

    zIndex: 30,
    justifyContent : 'center',
    alignItems : 'center',
    borderRadius : 2,
    borderWidth : 0,

    
  },
  interested: {
    fontSize: 32,
    color:'green',
    fontWeight: "bold",
    textAlign: "center",
    borderWidth:2,
    borderColor:'green',
    paddingVertical:5,
    paddingHorizontal:10,
    borderRadius:10,
    left: 0,
    transform: [{rotate: '-30deg'}],
  },
  notInterested: {
    fontSize: 32,
    color:'red',
    fontWeight: "bold",
    textAlign: "center",
    borderWidth:2,
    borderColor:'red',
    paddingVertical:5,
    paddingHorizontal:10,
    borderRadius:10,
    right: 0,
    position:'absolute',
    transform: [{rotate: '30deg'}],
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    // color:Colors.secondary
  },
  poster: {
    borderRadius: 50,
    width: 400,
    height: 800,
    // resizeMode: "cover",
    marginBottom: 0,
    position:'absolute',
    top: 420,

  },
});
