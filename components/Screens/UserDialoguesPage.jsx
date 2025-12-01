import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native'
import React from 'react'
import DialogueCard from '../DialogueCard'
import { MessageSquare } from 'lucide-react-native'
import { BackIcon } from '../../assets/icons/icons'
import { Colors } from '../../constants/Colors'
import { useRouter } from 'expo-router'

const UserDialoguesPage = ({dialogues, refetchDialogues, fetchMoreDialogues, hasMore, loading}) => {
    const router = useRouter()

    const handlePress = (item) => {
        router.push(`/dialogue/${item.id}`)
    }

    if (!dialogues) {
        return <ActivityIndicator/>
    }
  return (
    <SafeAreaView edges={['top']} className='bg-primary flex-1 h-full w-full px-4'>
            <TouchableOpacity className='self-start px-4' onPress={()=>router.back()}>
              <BackIcon size={26} color={Colors.mainGray}/>
            </TouchableOpacity>
        <View className='flex-1 justify-center items-center w-full gap-3 pt-4'>
            <View className='flex-row gap-2 justify-start items-center self-start px-4'>
                <MessageSquare size={30} color='white' />
                <Text className='text-white font-pbold text-3xl'>Dialogues</Text>
            </View>


            <FlatList
                refreshControl={
                    <RefreshControl 
                        refreshing={loading}
                        onRefresh={refetchDialogues}
                    />
                }
                data={dialogues}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={{gap:15, paddingHorizontal:15,paddingTop:20, paddingBottom:100}}
                renderItem={({item})=> (
                    <TouchableOpacity onPress={()=>handlePress(item)}>
                        <DialogueCard dialogue={item} isBackground={true} />
                    </TouchableOpacity>
                )}
                onEndReached={ () => {
                    if (!hasMore) return
                    fetchMoreDialogues()
                }}

            />
        </View>
    </SafeAreaView>
  )
}

export default UserDialoguesPage

const styles = StyleSheet.create({})