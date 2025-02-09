import { StyleSheet, Text, View, FlatList , TouchableOpacity, Image} from 'react-native'
import React from 'react'

const CastCrewHorizontal = ({param, handlePress}) => {
    const posterURL = 'https://image.tmdb.org/t/p/original';
  return (
    <FlatList
        data = {param}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) =>index}
        renderItem={({item}) => (
            <View className='flex-wrap flex justify-start  items-start ' style={{width:100}}>
                <TouchableOpacity onPress={()=>handlePress(item)}>
                    <Image
                        source={{uri : item.profile_path ?  `${posterURL}${item.profile_path}` : `${posterURL}${item.poster_path} `}}
                        style={{ width:  75, height: item.poster_path ? 120 : 75, borderRadius : item.poster_path ? 10 :  50, overflow:'hidden', marginBottom:5 }}
                    />
                    <View className='flex gap-0 items-start justify-start  '>
                        { item.poster_path && (
                            <Text className='text-xs text-mainGray font-pblack !py-0  !leading-3 text-left ' style={{ width:80, textAlign:'left', lineHeight:14}}>{item.title} </Text>
                        ) }
                        { item.name && (
                            <Text className='text-xs text-mainGray font-pblack  !py-0 text-left '  style={{ width:80, textAlign:'left', lineHeight: 14}}>{item.name}</Text>
                        ) }
                        <Text className='text-xs text-mainGray font-pregular !py-0 text-left  ' style={{ width:80, textAlign:'left', lineHeight:14}}> { item.character ? (`as ${item.character}`  ) : ( `${item.job}`) }</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )}
    >

    </FlatList>
  )
}

export default CastCrewHorizontal

const styles = StyleSheet.create({})