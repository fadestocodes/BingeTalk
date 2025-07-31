import React from 'react'
import YoutubePlayer from "react-native-youtube-iframe";
import { Dimensions, View } from 'react-native';



const YoutubeCard = ({ item, index, currentIndex, isScrolling, videosInView }) => {

    const isPlaying = index === currentIndex && !isScrolling && videosInView;
    // console.log('INDEXINVIEW', index)

  return (
    <View style={{ width: Dimensions.get("window").width - 45, overflow:'hidden', height:200, borderRadius:25}}>
      <YoutubePlayer
        height={300}
        width={350}
        play={isPlaying}
        initialPlayerParams={{controls:1}}
        mute
        
        videoId={item.id.videoId}
        onChangeState={(event) => console.log(event)}
        viewContainerStyle={{borderRadius:25, overflow:'hidden'}}
        
      />
    </View>
  )
}

export default YoutubeCard