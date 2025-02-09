import { StyleSheet, Image, Platform, View, Text } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context'
     


export default function TabTwoScreen() {
  return (
    <SafeAreaView className='flex flex-1 justify-center items-center w-full h-full bg-primary' >
      <View className='flex justify-center items-center'>
          <Text className='text-secondary font-pblack text-3xl'>Rooms</Text>
          <Text className='text-third font-pmedium leading-8'>Enter and chat.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
