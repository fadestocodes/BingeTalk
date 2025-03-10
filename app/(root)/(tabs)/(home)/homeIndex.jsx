import { StyleSheet, Text, View, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { feed } from '../../../../lib/fakeData'
import { RepostIcon, UpIcon, DownIcon } from '../../../../assets/icons/icons'
import { Colors } from '../../../../constants/Colors'
import { useRouter } from 'expo-router'



const HomePage = () => {

  const router = useRouter();

  const handlePress = (item) => {
    if (item.movieId) {
      router.push(`/(home)/movie/${item.movieId}`)
    } else if (item.tvId){
      router.push(`/(home)/tv/${item.tvId}`)
    }
  }

  return (
    <SafeAreaView className='flex flex-1 justify-center items-center w-full h-full bg-primary pt-16 pb-24' >

            <FlatList
              data={feed}
              keyExtractor={ (item) => item.id }
              renderItem={({item}) => (
                <View className='px-6'>
                  <View className='flex justify-center items-start gap-2 mt-4 mb-1 w-full '>
                    <View className='flex-row justify-center items-center gap-4'>
                      <Image
                        source = {require( "../../../../assets/images/drewcamera.jpg")}
                        style = {{ width:30, height: 30, borderRadius:50 }}
                        resizeMethod='cover'
                      />
                      <Text className='text-mainGray   font-pregular text-wrap flex-wrap flex-1'>{ item.notification } </Text>

                    </View>
                    { item.parentComment && (

                      <View className='my-2 justify-center items-center w-full'>
                        <Text className='text-secondary font-pcourier uppercase text-lg ' >{item.parentAuthor}</Text>

                          <Text className='text-third font-pcourier text-lg leading-5 px-6' numberOfLines={3}> { item.parentComment } </Text>
                        </View>
                    ) }
                    { item.dialogue && (
                      <View className='my-2 justify-center items-center w-full'>
                        <Text className='text-secondary font-pbold  text-lg ' >{item.user}</Text>

                          <Text className='text-third font-pregular text-lg leading-6 '> { item.dialogue } </Text>
                        </View>
                    )  }

                      { item.poster ? (
                      <View className='w-full items-center'>
                        <TouchableOpacity onPress={()=>handlePress(item)}>
                          <Image
                            
                            source={{uri:item.poster}}
                            style={{ width:300, height:200, borderRadius:10 }}
                            resizeMethod='contain'
                            />
                        </TouchableOpacity>
                      </View>
                      ) : (
                        <View></View>
                      )}
                    <View className=' flex-row items-end justify-between  w-full my-2'>
                      <View className='flex-row gap-8 items-center justify-center'>
                          <TouchableOpacity >
                            <View className='flex-row gap-2 justify-center items-center'>
                              <UpIcon className=' ' size='20' color={Colors.lightBlack} />
                              { item.upVotes && item.upVotes > 0 && (
                                <Text className='text-base font-pbold text-lightBlack  '>{item.upVotes}</Text>
                              )  }
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity >
                            <View className='flex-row gap-2 justify-center items-center'>
                              <DownIcon className='' size='20' color={Colors.lightBlack} />
                              { item.downVotes && item.downVotes > 0 && (
                                <Text className='text-base font-pbold text-lightBlack  '>{item.downVotes}</Text>
                              )  }
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity >
                            <View className='flex-row gap-2 justify-center items-center'>
                              <RepostIcon className='' size='20' color={Colors.lightBlack} />
                              { item.reposts && item.reposts > 0 && (
                                <Text className='text-base font-pbold text-lightBlack  '>{item.reposts}</Text>
                              )  }
                            </View>
                          </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View className='w-full border-t-[.5px] border-lightBlack items-center self-center shadow-md shadow-black-200'/>
              </View>
              ) }
              >



            </FlatList>


  </SafeAreaView>
  )
}

export default HomePage
