import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text , TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ActivityIndicator} from "react-native";
import { Image } from "expo-image";
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
import { MessageIcon, SwipeIcon } from "../../assets/icons/icons";
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { BackIcon } from "../../assets/icons/icons";
import { createComment } from "../../api/comments";
import { listInteraction } from "../../api/list";



const TinderSwipeCard = ( { listItems, creator, listId, listObj} ) => {
  const [list, setList] = useState(null);

  const [currentItem, setCurrentItem] = useState(null)
  const router = useRouter();

  const [ message, setMessage ] = useState(null)
  const [ comment, setComment ] = useState('')

  const [ swipeMessage, setSwipeMessage  ] = useState(null)
  const [toastIcon, setToastIcon] = useState(<SwipeIcon color={Colors.secondary} size={30}/>);
  const { user : clerkUser } = useUser()
  const { data : ownerUser } = useFetchOwnerUser({email : clerkUser.emailAddresses[0].emailAddress})

  const keyboard = useAnimatedKeyboard();
  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -keyboard.height.value }],
    };
  });

  const [savedItem, setSavedItem] = useState(null);

  useEffect(() => {
    setList(listItems); // Persist the list when the component mounts
  }, [listItems]); // Only update when listItems changes


  const restoreSavedItem = () => {
    if (savedItem) {
      setList((prevStack) => [savedItem, ...prevStack]);
      setSavedItem(null);
    }
  };


  useEffect(() => {
    setMessage('Swipe left to skip.\n\nSwipe right to mark as Interested.\n\nSwipe up to see details.')
    setList(listItems)
   
  }, []);

  useEffect(() => {
    if (savedItem) {
      setList((prevStack) => [savedItem, ...prevStack]);
      setSavedItem(null);
    }
  }, [router]); // 

  
useEffect(() => {
 
  restoreSavedItem(); // Make sure the saved item is restored when component remounts
}, [list]);


  const handleSwipeUp = (item) => {
    console.log('item ', item)
    setSavedItem(item); // Save the swiped item
   
    setList((prevStack) => prevStack.slice(1)); // Remove it from stack
    if (item.media_type === "movie") {
      router.push(`/movie/${item.id}`);
    } else if (item.movieId) {
      router.push(`/movie/${item.movie.tmdbId}`);
    } else if (item.media_type === "tv") {
      router.push(`/tv/${item.id}`);
    } else if (item.tvId){
      router.push(`/movie/${item.tv.tmdbId}`)
    }
  };



  const alreadyUpvoted = listObj.listInteractions.some( i => i.interactionType === 'UPVOTE' && i.userId === ownerUser.id )
  const alreadyDownvoted = listObj.listInteractions.some( i => i.interactionType === 'DOWNVOTE'  && i.userId === ownerUser.id )
  const alreadyReposted = listObj.listInteractions.some( i => i.interactionType === 'REPOST'  && i.userId === ownerUser.id )

  const [ already, setAlready ] = useState({
      upvoted : alreadyUpvoted,
      downvoted : alreadyDownvoted,
      reposted : alreadyReposted
  })

  const [ interactionCounts, setInteractionCounts ] = useState({
      upvotes : listObj.upvotes ,
      downvotes : listObj.downvotes ,
      reposts : listObj.reposts
  })


  const handleLike = async () => {
    
    console.log('swiped right', list[0].title)
    const item = list[0]
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
    console.log("Liked:", list[0].title);
  };

  const handleReject = () => {
    setSwipeMessage("Next");
    setToastIcon(<FastForward size={30} color={Colors.secondary} />); 
    console.log("Rejected:", list[0]?.movie?.title || list[0]?.tv?.title || list[0]?.title || list[0]?.name);
  };

  const handleAnimationEnd = () => {
    // Wait for animation to finish before adding the next card
    setList((prevMovies) => prevMovies.slice(1)); // Remove the first item
    setCurrentItem(null)
  };

  const handleInput = (text) => {
    setComment(text)
  }

  const handleUserPress = (item) => {
    router.push(`/user/${item.id}`)
  }

  const handlePostComment = async () => {
    const data = {
      userId : ownerUser.id,
      listId : Number(listId) ,
      content : comment
    }
    console.log('data for comment', data)
    const newComment = await createComment(data)
    console.log('new comment', newComment);
    setToastIcon(<MessageIcon size={30} color={Colors.secondary} />)
    setMessage('Posted new comment')
    setComment('')
    setTimeout(() => {
      router.back()
    }, 1700)


  }

  const handleInteraction =  async (type, listObj) => {
    console.log('type', type)
    if (type === 'upvotes'){
        setAlready(prev => ({...prev, upvoted : !prev.upvoted}))
        if (already.upvoted){
            setInteractionCounts(prev => ({...prev, upvotes : prev.upvotes - 1}))
        } else {
            setInteractionCounts(prev => ({...prev, upvotes : prev.upvotes + 1}))
        }
    } else if (type === 'downvotes'){
        setAlready(prev => ({...prev, downvoted : !prev.downvoted}))
        if (already.downvoted){
            setInteractionCounts(prev => ({...prev, downvotes : prev.downvotes - 1}))
        } else {
            setInteractionCounts(prev => ({...prev, downvotes : prev.downvotes + 1}))
        }
    
    let description
    if ( type === 'upvotes' ){
        description = `upvoted your list "${listObj.title}"`
        
    } else if (type === 'downvotes'){
        description = `downvoted your list "${listObj.title}"`
       
    
    const data = {
        type,
        listId : Number(listObj.id),
        userId : ownerUser.id,
        description,
        recipientId :creator.id
    }
    console.log('data', data)
      const updatedList = await listInteraction(data)
      console.log('updated list', updatedList)
      }
    }
  }


  return (
    <View style={styles.container}>
      <ToastMessage durationMultiple={Number(1.4)} message={message} onComplete={() => {setMessage(''); setToastIcon(null)}} icon={toastIcon }  />

        {!list ? (
          <View className="h-full bg-primary">
          <ActivityIndicator />
          </View>
        ):(
          <>
                {list.length >  0   ? (
                  <View className="w-full">
                  <View className="z-1 w-full">
                      <SwipeCard
                        key={list[0].id}  // Ensure the correct movie transition
                        item={ currentItem || list[0]}
                        setItem={setCurrentItem}
                        onLike={handleLike}
                        onReject={handleReject}
                        onSwipeUp = {handleSwipeUp}
                        onAnimationEnd={handleAnimationEnd}
                        setSavedItem={setSavedItem}
                      />
                  </View>
                  
                  <View className='z-0 w-full'>
                      <SwipeCard
                        key={list[0].id}  // Ensure the correct movie transition
                        item={list[0]}
                        onLike={handleLike}
                        onReject={handleReject}
                        onAnimationEnd={handleAnimationEnd}
                      />
                  </View>
                  </View>
          
                ) : (
                  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          
                  <Animated.View className="justify-center items-center gap-5 flex-1" style={translateStyle}>
                    <TouchableOpacity onPress={()=>{ router.back() }} style={{ position:'absolute', top:70, left: 10 }} >
                      <BackIcon size={20} color={Colors.mainGray}  />
                    </TouchableOpacity>
                    
                      <View className="justify-center items-center gap-3 mb-8">
                        <Text className="text-white font-pbold text-2xl">Did you like this list?</Text>
                        <View className="flex-row gap-10">
                          <TouchableOpacity onPress={()=> handleInteraction('upvotes',listObj) }>
                            <ThumbsUp color={ already.upvoted ? Colors.secondary :  Colors.mainGray} size={30}/>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=> handleInteraction('downvotes',listObj) }>
                            <ThumbsDown color={already.downvoted ? Colors.secondary :  Colors.mainGray} size={30}/>
                          </TouchableOpacity>
          
                        </View>
                      </View>
                    <TouchableOpacity onPress={()=>handleUserPress(creator)} className="justify-center items-center gap-3 mb-5">
                      <Image
                        source={{ uri : creator.profilePic }}
                        contentFit = 'cover'
                        style ={{ width:100, height:100, borderRadius:50 }}
                      />
                      <Text className="text-mainGray">@{creator.username}</Text>
                      <Text className="text-white  font-pbold">List curated by {creator.firstName}</Text>
                    </TouchableOpacity>
          
                    <View className="gap-0">
                      <TextInput
                        placeholder="Leave a comment for this list"
                        value={comment}
                        onChangeText={handleInput}
                        placeholderTextColor={Colors.mainGray}
                        multiline={true}
                        style={{ color:'white', textAlignVertical:"top",width:350, maxHeight:200, minHeight:150, borderWidth:1, borderColor:Colors.mainGray, fontFamily:'Geist', borderRadius:15, padding:20 }}
          
                      />
                    </View>
                      <TouchableOpacity onPress={handlePostComment} style={{ backgroundColor:Colors.secondary, borderRadius:10, padding:10 }}>
                        <Text className="text-primary font-pbold">Post comment</Text>
                      </TouchableOpacity>
                  
                  </Animated.View>
                    </TouchableWithoutFeedback>
          
                )}
        </>
        )
        }

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    width:'100%',
    height:'100%',
    backgroundColor: Colors.primary
  },
});

export default TinderSwipeCard;
