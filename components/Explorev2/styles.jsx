import {StyleSheet} from 'react-native';

export const Explorev2StyleSheet = StyleSheet.create({
  wrapper: {
    height:800,
    justifyContent:'center',
    alignItems:'center',
    
  },
  choiceContainer: {
    position: 'absolute',
    top: -100,
  },
  likeContainer: {
    left: 0,
    transform: [{rotate: '-30deg'}],
  },
  nopeContainer: {
    right: 0,
    transform: [{rotate: '30deg'}],
  },
});