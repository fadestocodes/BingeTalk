import React from 'react'
import YoutubePlayer from "react-native-youtube-iframe";
import { Dimensions, View } from 'react-native';
import { Text } from 'react-native';



const YoutubeCard = ({ item, index, currentIndex, isScrolling, videosInView }) => {

    const isPlaying = index === currentIndex && !isScrolling && videosInView;
    console.log('isplaying?', isPlaying, index)

  return (
    <View className='flex  gap-3 items-start justify-center '>
      <Text numberOfLines={1} style={{ width: Dimensions.get("window").width - 45}} className="font-pbold text-mainGray ">{item.snippet.title}</Text>
    <View pointerEvents='none' className='flex  gap-3 w-full ' style={{ width: Dimensions.get("window").width - 45, overflow:'hidden', height:180, borderRadius:25}}>
      <YoutubePlayer
        mute={true}
        height={300}
        width={350}
        play={isPlaying}
        initialPlayerParams={{controls:1, autoplay:1}}
        videoId={item.id.videoId}
        onChangeState={(event) => console.log(event)}
        viewContainerStyle={{borderRadius:25, overflow:'hidden'}}
        
        
      />
    </View>
    </View>
  )
}

export default YoutubeCard