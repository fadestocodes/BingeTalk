import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useFetchRecommended } from '../../../../../../api/user'
import { useLocalSearchParams } from 'expo-router'
import { Colors } from '../../../../../../constants/Colors'
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake } from 'lucide-react-native';


const RecommendedFromProfile = () => {
    const {userId} = useLocalSearchParams();
    const { data:recommended, refetch, isFetching } = useFetchRecommended(userId);
    console.log('recommended', recommended)

    if (isFetching){
        return <RefreshControl tintColor={Colors.secondary}   />
    }

  return (
    <SafeAreaView className='w-full h-full bg-primary justify-start items-center' style={{  paddingTop:100, paddingHorizontal:15 }}>
       <View style={{ paddingTop:30, gap:15 }}>
            <View className='justify-center items-center'>
                <View className="flex-row justify-center items-center gap-2">
                    <Handshake color='white' />
                    <Text className='text-white text-2xl font-pbold'>Recommended</Text>
                </View>
                <Text className='text-mainGray text-center '>Titles recommended by friends</Text>
            </View>
            <View style={{ paddingTop:50 }}>
            { recommended.recommendations.length < 1 ? (
                <View>
                    <Text className='text-mainGray text-center text-xl font-pmedium' >(List is empty)</Text>
                </View>
            ) : (
                <FlatList
                    data={recommended.recommendations}
                    keyExtractor={item => item.id}
                    renderItem={({item})=>(
                        <View>
                            
                        </View>
                    )}
                />
            )  }
                </View>
        </View>
    </SafeAreaView>
  )
}

export default RecommendedFromProfile

const styles = StyleSheet.create({})