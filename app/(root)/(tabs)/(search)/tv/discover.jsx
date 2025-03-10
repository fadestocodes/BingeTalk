import { SafeAreaView, StyleSheet, Text, View , FlatList, TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import { FilmIcon, TVIcon } from '../../../../../assets/icons/icons'
import { movieCategories } from '../../../../../lib/CategoryOptions'
import { Colors } from '../../../../../constants/Colors'

const MovieIndex = () => {
  const [ selected, setSelected ] = useState('Trending')


  return (
    <SafeAreaView className='w-full h-full bg-primary'>
      <View className='w-full  pt-10 px-6 gap-5'>
        <View className="gap-3">
            <View className='flex-row gap-2 justify-start items-center'>

              <TVIcon size={30} color='white' />
              <Text className='text-white font-pbold text-3xl'>TV</Text>
            </View>
            <Text className='text-mainGray font-pmedium'>Check out the most bingeable shows right now.</Text>
        </View>

        <View className='w-full my-3'>
        <FlatList
          horizontal
          data={movieCategories}
          keyExtractor={(item,index) => index}
          contentContainerStyle={{ gap:10 }}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=>{setSelected(item); setCreateType(item); setContent(''); setSearchQuery(''); setListItems([]) }} style={{ borderRadius:15, backgroundColor:selected===item ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
              <Text className=' font-pmedium' style={{ color : selected===item ? Colors.primary : 'white' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      </View>
    </SafeAreaView>
  )
}

export default MovieIndex

const styles = StyleSheet.create({})