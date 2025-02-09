import {  Text, View, ScrollView, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { Image } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { showcaseStills } from '../lib/fakeData'
import { RepostIcon } from '../assets/icons/icons'
import { Colors } from '../constants/Colors'

const dailiesList = [
  {
    id: 1,
    name : 'Watched Films & Shows',
    contents : [
      {
        title : '',
        caption : '',

      },
      {

      }
    ]

  },
  {
    id : 2,
    name : 'Set Days',
    contents : [
      {
        // coverPhoto
      },
      {

      },
    ]
  }
]

const ShowcasePage = ( ) => {
  return (
    <FlatList
  data={showcaseStills}
  keyExtractor={(item, index) => index.toString()}
  ListHeaderComponent={(
    <View className="flex gap-4 w-full my-6 px-6">
      <View className="flex-row">
        <Text className="uppercase font-pcourier text-third">Andrew's Showcase</Text>
      </View>
      <Text className="font-pcourier text-third">
        This is the SHOWCASE. If you work in the film industry you can display your work here. If not, highlight another user's work and support them!
      </Text>
    </View>
  )}
  numColumns={3}
  columnWrapperStyle={{
    justifyContent: 'flex-start', // Distribute items evenly
    width:'100%',
    gap:10,
    alignItems:'center'

  }}
  renderItem={({ item }) => {
    const screenWidth = Dimensions.get('window').width;
    const imageWidth = screenWidth / 3 - 10; // Adjust for spacing
    return (
      <TouchableOpacity style={{ marginBottom: 10 }}>
        <View style={{ position: 'relative' }}>
          {item.isReposted && (
            <View style={{ position: 'absolute', top: 8, left: 8, zIndex: 10 }}>
              <RepostIcon color={Colors.lightGray} size={14} />
            </View>
          )}
          <Image
            source={item.image}
            style={{
              width: imageWidth,
              height: imageWidth,
              borderRadius: 10,
            }}
            resizeMethod="cover"
          />
        </View>
      </TouchableOpacity>
    );
  }}
  contentContainerStyle={{
    paddingHorizontal: 0,
    width:'auto',
    flex:1,
    // alignItems: 'stretch', // Ensure each row takes full width
  }}
/>

  )
}

export default ShowcasePage

