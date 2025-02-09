import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import SwipeCard from "./SwipeCard";
import { getTrending } from "../../lib/TMDB";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const TinderSwipeCard = () => {
  const [movies, setMovies] = useState([]);
  const [currentItem, setCurrentItem] = useState(null)
  const router = useRouter();



  

  useEffect(() => {
    const fetchTrending = async () => {
      const res = await getTrending();
      if (res) {
        setMovies(res.results);
      }
    };
    fetchTrending();
  }, []);
  

  const [savedItem, setSavedItem] = useState(null);

  const handleSwipeUp = (item) => {
    setSavedItem(item); // Save the swiped item
    // setMovies((prevStack) => prevStack.slice(1)); // Remove it from stack
    if (item.media_type === "movie") {
      router.push(`/movie/${item.id}`);
    } else if (item.media_type === "tv") {
      router.push(`/tv/${item.id}`);
    }
  };

  const restoreSavedItem = () => {
    if (savedItem) {
      setMovies((prevStack) => [savedItem, ...prevStack]);
      setSavedItem(null);
    }
  };

  useEffect(() => {
    restoreSavedItem(); // Automatically restore when component re-mounts
  }, [router]); // Runs only once, can be adjusted for specific cases


  const handleLike = () => {
    console.log("Liked:", movies[0].title);
  };

  const handleReject = () => {
    console.log("Rejected:", movies[0].title);
  };

  const handleAnimationEnd = () => {
    // Wait for animation to finish before adding the next card
    setMovies((prevMovies) => prevMovies.slice(1)); // Remove the first item
    setCurrentItem(null)
  };

  return (
    <View style={styles.container}>
      {movies.length > 0 ? (
        <View>
        <View className="z-1">
            <SwipeCard
              key={movies[0].id}  // Ensure the correct movie transition
              item={ currentItem || movies[0]}
              setItem={setCurrentItem}
              onLike={handleLike}
              onReject={handleReject}
              onSwipeUp = {handleSwipeUp}
              onAnimationEnd={handleAnimationEnd}
            />
        </View>
        
        <View className='z-0'>
            <SwipeCard
              key={movies[0].id}  // Ensure the correct movie transition
              item={movies[0]}
              onLike={handleLike}
              onReject={handleReject}
              onAnimationEnd={handleAnimationEnd}
            />
        </View>
        </View>

      ) : (
        <Text>List curated by: Andrew</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
});

export default TinderSwipeCard;
