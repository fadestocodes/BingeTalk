/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Animated, View } from 'react-native';
// import { Explorev2StyleSheet } from '../../../screens/Discover/styles';
import { Explorev2StyleSheet } from '../styles';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';

const SwipeCardChildren = ({ item, swipe, isFirst, renderChoice }) => {
    // console.log('item from children', item)
    const posterURL = 'https://image.tmdb.org/t/p/original';

  return (
    <Card
      profileImg={`${posterURL}${item.poster_path}`}
      // minWidth={400}
      // maxHeight={400}
      // minHeight={400}
    >
      <Card.Info >
        {isFirst && renderChoice(swipe)}
        <View>
        
        </View>
       
      </Card.Info>
    </Card>
  );
};

export default SwipeCardChildren;
