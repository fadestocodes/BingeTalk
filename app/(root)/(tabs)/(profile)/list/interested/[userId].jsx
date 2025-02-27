import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useFetchInterested } from '../../../../../../api/user'
import { useLocalSearchParams } from 'expo-router'
import { Colors } from '../../../../../../constants/Colors'
import { ThumbsUp, ThumbsDown, Clock9, ListChecks, BadgeHelp, Handshake } from 'lucide-react-native';


const InterestedPageFromProfile = () => {
    const {userId} = useLocalSearchParams();
    const { data:interested, refetch, isFetching } = useFetchInterested(userId);

    if (isFetching){
        return <RefreshControl tintColor={Colors.secondary}   />
    }

  return (
    <SafeAreaView className='w-full h-full bg-primary justify-start items-center' style={{  paddingTop:100, paddingHorizontal:15 }}>
        <View style={{ paddingTop:30, gap:15 }}>
            <View className='justify-center items-center'>
            <View className="flex-row justify-center items-center gap-2">
                <BadgeHelp color='white' />
                <Text className='text-white text-2xl font-pbold'>Interested</Text>
                </View>
                <Text className='text-mainGray text-center '>Films marked as interested</Text>
            </View>
            <View style={{ paddingTop:50 }}>
            { interested.listItem.length < 1 ? (
                <View>
                    <Text className='text-mainGray text-center text-xl font-pmedium' >(List is empty)</Text>
                </View>
            ) : (
                <FlatList
                    data={interested.listItem}
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

export default InterestedPageFromProfile

const styles = StyleSheet.create({})