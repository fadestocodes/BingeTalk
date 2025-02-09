import React, { Fragment, useCallback, useState, useEffect } from 'react';
import { Animated, View, Text } from 'react-native';
import { Explorev2StyleSheet } from './styles';
import { SwipeCard } from '../ui/SwipeCard/SwipeCard';
import Choice from './Choice/Choice';
import UserActions from './UserActions/UserActions';
import SwipeCardChildren from './SwipeCardChildren/SwipeCardChildren';
import { getTrending } from '../../lib/TMDB';

export const Explorev2 = ({ movies, setMovies, refetch }) => {
  const [watchlist, setWatchlist] = useState([]);

  // Fetch trending movies
  // useEffect(() => {
  //   const fetchTrending = async () => {
  //     const res = await getTrending();
  //     if (res) {
  //       setMovies(res.results);
  //     }
  //   };
  //   fetchTrending();
  // }, []);

  useEffect(()=>{
    setMovies(movies)
  }, [movies])





  const likeOpacity = swipe =>
    swipe.x.interpolate({
      inputRange: [25, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

  const nopeOpacity = swipe =>
    swipe.x.interpolate({
      inputRange: [-100, -25],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

  const renderChoice = useCallback(
    swipe => (
      <Fragment>
        <Animated.View
          style={[
            Explorev2StyleSheet.choiceContainer,
            Explorev2StyleSheet.likeContainer,
            { opacity: likeOpacity(swipe) },
          ]}
        >
          <Choice type="like" />
        </Animated.View>
        <Animated.View
          style={[
            Explorev2StyleSheet.choiceContainer,
            Explorev2StyleSheet.nopeContainer,
            { opacity: nopeOpacity(swipe) },
          ]}
        >
          <Choice type="nope" />
        </Animated.View>
      </Fragment>
    ),
    []
  );

  // Handle swipe actions
  const handleSwipeMovieAction = (swipe, prevState) => {
    const isLike = Number(JSON.stringify(swipe.x)) > 0; // Check if swipe is towards the right (like)
    const movieId = prevState?.[0]?.id;

    if (isLike) {
      addToWatchlist(movieId); // If liked, add to the watchlist
    }
    swipe.setValue({ x: 0, y: 0 });

  };

  // Add movie to watchlist
  const addToWatchlist = (movieId) => {
    const movie = movies.find(movie => movie.id === movieId);
    setWatchlist(prev => [...prev, movie]);  // Add movie to the watchlist state
  };

  // Remove top card after swipe
  // const removeTopCard = useCallback(() => {
  //   setMovies(prevState => prevState.slice(1));  // Remove the top movie
  // }, []);


  // handleChoice function that will be passed into UserActions (like and reject actions)
  const handleChoice = (value) => {
    // Add custom action based on like (-1) or reject (1)
    if (value === 1) {
      console.log("Movie liked!");
      // you can put your action here, e.g., adding it to the watchlist
    } else if (value === -1) {
      console.log("Movie rejected!");
      // handle rejection here
    }
  };

  

  return (
    <SwipeCard
      onSwipeUser={handleSwipeMovieAction}
      items={movies}
      setItems={setMovies}
      renderActionBar={handleChoice => (
        <UserActions
          onLike={() => handleChoice(1)}   // onLike is passed handleChoice with 1 (like)
          onReject={() => handleChoice(-1)}  // onReject is passed handleChoice with -1 (reject)
        />
      )}
    >
      {(item, swipe, isFirst) => (
        <SwipeCardChildren
          item={item}
          swipe={swipe}
          isFirst={isFirst}
          renderChoice={renderChoice}
        />
      )}
    </SwipeCard>
  );
};
