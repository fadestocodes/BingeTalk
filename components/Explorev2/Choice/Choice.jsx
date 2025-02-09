import { View, Text } from 'react-native';
import React from 'react';
import { ChoiceStyleSheet } from './styles';

const COLORS = {
  like: '#00eda6',
  nope: '#ff006f',
};

const Choice = ({ type }) => {
  const color = COLORS[type];

  return (
    <View
      style={[
        {
          borderColor: color,
        },
        ChoiceStyleSheet.wrapper,
      ]}
    >
      <Text
        style={[
          {
            color: color,
          },
          ChoiceStyleSheet.container,
        ]}
      >
        {type}
      </Text>
    </View>
  );
};

export default Choice;
