import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import SwipeCard from "./SwipeCard";
import { getTrending } from "../../api/tmdb";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import ToastMessage from "../ui/ToastMessage";
import { ListChecks, FastForward } from "lucide-react-native";
import { Colors } from "../../constants/Colors";
import { swipeMovieInterested } from "../../api/movie";
import { swipeTVInterested } from "../../api/tv";
import { useUser } from "@clerk/clerk-expo";
import { useFetchOwnerUser } from "../../api/user";
import { SwipeIcon } from "../../assets/icons/icons";


const TinderSwipeCard = (  ) => {
  const [movies, setMovies] = useState([]);
  const [currentItem, setCurrentItem] = useState(null)
  const router = useRouter();

  const [ message, setMessage ] = useState(null)

  const [ swipeMessage, setSwipeMessage  ] = useState(null)
  const [toastIcon, setToastIcon] = useState(null);
  const { user : clerkUser } = useUser()
  const { data : ownerUser } = useFetchOwnerUser({email : clerkUser.emailAddresses[0].emailAddress})



  useEffect(() => {
    setMessage('Swipe left to skip.\n\nSwipe right to mark as Interested.\n\nSwipe up to see details.')
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
    console.log("Current path:", router.pathname);
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


  const handleLike = async () => {
    
    console.log('swiped right', movies[0].title)
    const item = movies[0]
    if (item.media_type === 'movie'){
      console.log('hello from item.media_type = movie')
      data = {
        tmdbObj : {
          id : item.id,
          title  : item.title,
          release_date : item.release_date,
          poster_path : item.poster_path,
          backdrop_path : item.backdrop_path
        },
        userId : ownerUser.id,
        fromTMDBList : true
      } 
      console.log('data', data)
      await swipeMovieInterested(data)

    } else if ( item.movieId){
      console.log('hello from item.movieId')
      data = {
        userId : ownerUser.id,
        movieId : item.movieId
      }
      console.log('data', data)

      await swipeMovieInterested(data)

    } else if (item.media_type === 'tv'){
      console.log('hello from item.media_type = tv')
      console.log('tv obj ', item)
      data = {
        tmdbObj : {
          id : item.id,
          title  : item.name,
          release_date : item.first_air_date,
          poster_path : item.poster_path,
          backdrop_path : item.backdrop_path
        },
        userId : ownerUser.id,
        fromTMDBList : true
      } 
      console.log('data', data)

      await swipeTVInterested(data)
    } else if (item.tvId){
      console.log('hello from item.tvId')
      data = {
        userId : ownerUser.id,
        tvId : item.tvId
      }
      console.log('data', data)

      await swipeTVInterested(data)

    }
    setSwipeMessage("Added to Watchlist");
    setToastIcon(<ListChecks size={30} color={Colors.secondary} />); 
    console.log("Liked:", movies[0].title);
  };

  const handleReject = () => {
    setSwipeMessage("Next");
    setToastIcon(<FastForward size={30} color={Colors.secondary} />); 
    console.log("Rejected:", movies[0].title);
  };

  const handleAnimationEnd = () => {
    // Wait for animation to finish before adding the next card
    setMovies((prevMovies) => prevMovies.slice(1)); // Remove the first item
    setCurrentItem(null)
  };

  return (
    <View style={styles.container}>
      <ToastMessage durationMultiple={Number(1.4)} message={message} onComplete={() => setMessage('')} icon={<SwipeIcon color={Colors.secondary} size={30} />}  />


      {movies.length > 0 ? (
        <View className="w-full">
        <View className="z-1 w-full">
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
    width:'100%'
  },
});

export default TinderSwipeCard;
