import { ScrollView, StyleSheet, Text, View, FlatList , TouchableOpacity, TextInput, Keyboard, KeyboardAvoidingView, ActivityIndicator} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../../../../constants/Colors'
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../../../api/user'
import { fetchUsersLists, useFetchUsersLists, createList, addToList } from '../../../../api/list'
import { BackIcon, ForwardIcon } from '../../../../assets/icons/icons'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, useAnimatedKeyboard } from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router'
import { fetchTVFromDB } from '../../../../api/tv'
import { GetTVById } from '../../../../api/tmdb'


const addToListModal = () => {
    const { user :clerkUser } = useUser()
    const {tmdbId, DBtvId} = useLocalSearchParams();
    const [ tvObj, setTvObj ] = useState(null)

    const useGetTVById = async () => {
        const tvObj = await GetTVById(Number(tmdbId))
        setTvObj(tvObj)
    }
    useEffect(()=>{
        useGetTVById();
    }, [])


    console.log('TVOBJ',tvObj)
    const { data : ownerUser, refetch } = useFetchOwnerUser({ email : clerkUser.emailAddresses[0].emailAddress })
    const [ isCreatingList, setIsCreatingList ] = useState(false)
    const [ isDescription, setIsDescription ] = useState(false)
    const [ uploadingNewList, setUploadingNewList ] = useState(false)
    const [ inputs, setInputs ] = useState({
        title : '',
        description : ''
    })
        const keyboard = useAnimatedKeyboard(); // Auto tracks keyboard height
        const translateStyle = useAnimatedStyle(() => {
            return {
              transform: [{ translateY: -keyboard.height.value }],
            };
          });



    // const userLists = fetchUsersLists(ownerUser.id)
    const { data : userLists, refetch: refetchUserLists } = useFetchUsersLists(ownerUser.id)
    console.log("USER LISTS", userLists)
    const handleChange = (name, text) => {
        setInputs( prev => ({
            ...prev,
            [name] : text
        }) )
    }


    const handleCreate = async () => {
        setUploadingNewList(true)
        tvObj.media_type = 'tv';
        const formattedTvObj = {}
        formattedTvObj.item = tvObj 
        const listData = {
            title : inputs.title,
            caption : inputs.description,
            userId :ownerUser.id ,
            listItems : [formattedTvObj]
        }
        console.log('list data', listData)
        const response = await createList(listData)
        setUploadingNewList(false)
        console.log('response', response)
        setInputs({
            title:'',
            description:''
        }),
        setIsCreatingList(false)
        setIsDescription(false)
        refetchUserLists();


    }

    const handleSelectList = async (item) => {

        const data = {
            listIdType : 'tvId',
            listId : item.id ,
            mediaIdType : 'tv',
            mediaId : Number(DBtvId)
        }
        console.log('DATA', data)
        try {
            const updatedList = await addToList(data)
            console.log('updated list', updatedList)
        } catch (err) {
            console.log(err)
        }
    }


  return (
    <ScrollView className='w-full h-full bg-primary  relative' style={{borderRadius:30}}>
         <Animated.View style={translateStyle}>
        <View className='h-full w-full justify-center items-center relative gap-5'  style={{paddingTop:60, paddingBottom:120, paddingHorizontal:30, width:'100%'}} >
        <View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:20 }} />


          
                <>
                    <Text className='text-secondary font-pbold text-2xl mb-3' >Select a List to add to</Text>
                    <FlatList
                        scrollEnabled={false}
                        data={userLists}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ gap:15, width:320}}
                        renderItem={({item}) => {
                            console.log('ITEM',item)
                        return (
                            <TouchableOpacity onPress={()=>handleSelectList(item)}  style={{height:'auto', width:'100%',backgroundColor:Colors.mainGrayDark, borderRadius:15, paddingHorizontal:30, paddingVertical:15, gap:10}} >
                                    <View className=' gap-0 justify-center items-start' >
                                        <Text className='text-white font-pbold text-lg' >{ item.title }</Text>
                                        <Text className='text-white text-sm '>{`(${item.listItem.length} ${item.listItem.length > 1 ? `items` : 'item'})`}</Text>
                                    </View>
                                    <Text className='text-mainGray text-sm font-pregular' numberOfLines={2}>{ item.caption }</Text>
                            </TouchableOpacity>
                        )}}
                        ListFooterComponent={


                             isCreatingList && !isDescription ? (
                                <View  className='w-full my-3'>
                                    <TextInput
                                        value={ inputs.title }
                                        onChangeText={ (text) => handleChange('title', text) }
                                        placeholder='Enter List title'
                                        maxLength={100}
                                        multiline={true}
                                        placeholderTextColor={Colors.lightBlack}
                                        style = {{ width:300, maxHeight:75, padding:10, color:'white', fontFamily:'Geist-Bold', fontSize:18,  }}
                                    />
                                    <View className=' flex-row justify-between  mt-5'>
                                        <TouchableOpacity onPress={()=>setIsCreatingList(false)} >
                                            <BackIcon size={18} color={Colors.mainGray} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>setIsDescription(true)} >
                                            <ForwardIcon size={18} color={Colors.mainGray} />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            ) :  isCreatingList && isDescription ? (
                                <View  className='w-full'>
                                    <TextInput
                                        value={ inputs.description }
                                        onChangeText={ (text) => handleChange('description', text) }
                                        placeholder='List description (optional)'
                                        maxLength={250}
                                        multiline={true}
                                        placeholderTextColor={Colors.lightBlack}
                                        style = {{ width:300, maxHeight:75, padding:10, color:'white', fontFamily:'Geist-Regular', fontSize:15,  }}
                                    />
                                    <View className=' flex-row justify-between  mt-5'>
                                        <TouchableOpacity onPress={()=>setIsDescription(false)} >
                                            <BackIcon size={18} color={Colors.mainGray} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleCreate} >
                                            <ForwardIcon size={18} color={Colors.mainGray} />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            ) : uploadingNewList ? (
                                <ActivityIndicator />
                            ) : (

                                <>
                                    <TouchableOpacity onPress={()=>setIsCreatingList(true)}  className='justify-center  my-3 w-36 self-center items-center rounded-3xl py-1 border-white bg-white border-[2px] '>
                                        <Text className='text-primary  text-sm font-psemibold text-center'>Create a new list</Text>
                                    </TouchableOpacity>
                                </>

                            )
                        }
                    />
                </>
                
         
            

        </View>
        </Animated.View>
    </ScrollView>
  )
}

export default addToListModal

const styles = StyleSheet.create({})