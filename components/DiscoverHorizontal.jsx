import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors';

const DiscoverHorizontal = ({ data, handlePress }) => {

    const posterURL = 'https://image.tmdb.org/t/p/original';


  return (
    <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        contentContainerStyle={{ height:100}}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
            <View className='flex-wrap flex justify-start  items-start' style={{width:95}}>
            <TouchableOpacity onPress={()=>handlePress(item)}>
                <Image
                    source={{uri : item.profile_path ?  `${posterURL}${item.profile_path}` : `${posterURL}${item.poster_path} `}}
                    style={{ width:  75, height:  120, borderRadius : 10, overflow:'hidden', marginBottom:5 }}
                />
                <View className='flex gap-0 items-start justify-start'>
                    { item.poster_path && (
                        <Text className='text-xs text-mainGray font-pblack !py-0  !leading-3 text-left ' style={{ width:80, textAlign:'left'}}>{ item.poster_path ? item.title || item.name : item.profile_path ? item.name : item.name} </Text>
                    ) }
                    <Text className='text-xs text-mainGray font-pblack  !py-0 text-left !leading-3 ' style={{ width:80, textAlign:'left', lineHeight: item.poster_path ? 1 : 0}}>{  item.type === 'person' ? item.name : ''} </Text>
                    <Text className='text-xs text-mainGray font-pregular !py-0 text-left  !leading-3' style={{ width:80, textAlign:'left'}}>{ item.media_type !== 'person' ? ''  : item.character ? (`as ${item.character}`  ) : item.job ? ( `${item.job}`) : '' }</Text>
                </View>
            </TouchableOpacity>
        </View>
        )}
    >
    </FlatList>
  )
}

export default DiscoverHorizontal

const styles = StyleSheet.create({})