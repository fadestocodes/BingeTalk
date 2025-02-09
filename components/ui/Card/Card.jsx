import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { CardStyles } from './styles';

// Description Component
export const Description = ({ children }) => {
  return <Text style={[CardStyles.description]}>{children}</Text>;
};

// Title Component
export const Title = ({ children }) => {
  return <Text style={[CardStyles.title]}>{children}</Text>;
};

// Info Component
export const Info = ({ children, style }) => {
  return <View style={[CardStyles.info, style]}>{children}</View>;
};

// Card Component
export const Card = ({
  children,
  profileImg,
  minHeight = 100,
  maxHeight,
  minWidth,
}) => {
  const cardStyles = {
    minHeight,
    maxHeight,
    minWidth,
  };

  console.log('profileimg', profileImg)
  return (
    <View style={[CardStyles.card, cardStyles]}>
      <ImageBackground
        style={[CardStyles.cover]}
        source={{ uri: profileImg }}
        resizeMode="cover"
      >
        <View style={[CardStyles.coverContainer]}>{children}</View>
      </ImageBackground>
    </View>
  );
};

// Add nested components to Card
Card.Title = Title;
Card.Description = Description;
Card.Info = Info;
