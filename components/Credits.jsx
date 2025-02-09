import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { credits } from '../lib/fakeData'
import { SafeAreaView } from 'react-native-safe-area-context'

const Credits = () => {
  return (
    <SafeAreaView className='h-full'>
        <FlatList
            data={credits}
            keyExtractor={(item,index) => index}
            ListHeaderComponent={(
                <View className='px-8 gap-2 items-center' style={{marginBottom:40, marginTop:20}}>
                    <Text className='text-secondary text-2xl font-pbold'>Credits</Text>
                    <Text className='text-mainGray  font-pregular mb-3'>This is a collection of all the people that's given you credits</Text>
                </View>
            )}
            renderItem={({item}) => (
                <TouchableOpacity>
                    <View className='flex w-full items-center ' style={{  }}>
                        <View className='flex-row w-full justify-center px-8  flex-1 '>
                            <Text style={{marginBottom:15, width:220}} className='text-third font-pmedium  ' >{item.post}</Text>
                            {/* <View className='flex-1'></View> */}
                            <Text className='text-third text-right mb-3 flex-1 font-pbold  ' style={{textAlign:'right'}} >{item.creditor}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        
        >

        </FlatList>
    </SafeAreaView>
  )
}

export default Credits

const styles = StyleSheet.create({})