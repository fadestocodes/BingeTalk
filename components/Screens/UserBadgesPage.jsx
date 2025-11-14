import { View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity} from 'react-native'
import React from 'react'
import { badges } from '../../constants/BadgeIcons'
import { Image } from 'expo-image'

const UserBadgesPage = () => {

  const fakeBadges = [
    {
      name : 'The Critic',
      unlockedLevel : "NONE",
      progressCompleted : 3,
      progressNeeded  :10,
      currentLevel: 'BRONZE',
      icon : badges.criticGold
    },
    {
      name : 'The Tastemaker',
      unlockedLevel : "NONE",
      progressCompleted : 1,
      progressNeeded  :20,
      currentLevel: 'NONE',
      icon : badges.tastemakerBronze

    }, {
      name : 'The Historian',
      unlockedLevel : "NONE",
      progressCompleted : 19,
      progressNeeded  :25,
      currentLevel: 'BRONZE',
      icon : ''

    }, 
    {
      name : "The People's Choice",
      unlockedLevel : "NONE",
      progressCompleted : 13,
      progressNeeded  :25,
      currentLevel: 'GOLD',
      icon : ''

    },
    {
      name : 'The Conversationalist',
      unlockedLevel : "NONE",
      progressCompleted : 15,
      progressNeeded  :18,
      currentLevel: 'BRONZE',
      icon : badges.conversationalistSilver

    },
    {
      name : 'The Auteur',
      unlockedLevel : "NONE",
      progressCompleted : 12,
      progressNeeded  :21,
      currentLevel: 'NONE',
      icon : ''
    },
    {
      name : "The People's Choice",
      unlockedLevel : "NONE",
      progressCompleted : 13,
      progressNeeded  :25,
      currentLevel: 'NONE',
      icon : ''
      
    },
    

  ]
  return (
    <SafeAreaView className='bg-primary w-full h-full'>
        <ScrollView showsVerticalScrollIndicator={false} >
            <View className='items-center justify-center w-full'>
              <Text className='text-white text-3xl font-pbold'>UserBadgesPage</Text>
              <FlatList
                data={fakeBadges}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item,index) => index}
                contentContainerStyle ={{flexWrap:'wrap', display:'flex', flexDirection:'row',width:'100%', gap:15, justifyContent:'start', alignItems:'center', paddingBottom:100, paddingTop:100}}
                renderItem={({item}) => {
                  const percentage = Math.floor((item.progressCompleted/item.progressNeeded)*100)
                  return (
                  <TouchableOpacity className={`bg-primaryLight w-[160px] h-[230px] px-4 rounded-2xl justify-center items-center gap-3 relative ${item.currentLevel === 'NONE' ? 'opacity-20' : ''} `}>
                    { item.currentLevel !== 'NONE' && (
                      <Text className='bg-secondary rounded-full px-2 py-1 text-primary text-xs absolute left-3 top-3'>{item.currentLevel}</Text>
                    )}
                    { item?.icon ? ( 
                      <Image
                          source={item.icon}
                          width={60}
                          height={60}
                          contentFit='contain'
                      
                          style={{ overflow:'hidden'}}
                      />

                    ) : ( 

                      <View className={`w-[60px] h-[60px] rounded-full bg-primary ${item.currentLevel === 'NONE' ? 'opacity-40' : ''}`} />
                    )}
                    <View className='gap-3'>
                      <Text className='text-mainGray font-bold'>{item.name}</Text>
                      <Text className='text-mainGray text-sm '>{item.progressCompleted}/{item.progressNeeded} until next level</Text>
                      <View style={{}} className='w-[110px] rounded-full bg-primary h-[10px] relative'>
                        <View style={{width:`${percentage}%`}} className='bg-newLightGray rounded-full h-[10px] absolute ' />
                      </View>
                    </View>
              
                  </TouchableOpacity>
                )}
                }
                  
              
              />
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default UserBadgesPage