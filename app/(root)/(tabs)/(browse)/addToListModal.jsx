import { ScrollView, StyleSheet, Text, View, FlatList , TouchableOpacity, TextInput, Keyboard, KeyboardAvoidingView, ActivityIndicator} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Colors } from '../../../../constants/Colors'
import { useFetchOwnerUser } from '../../../../api/user'
import { fetchUsersLists, useFetchUsersLists, createList, addToList } from '../../../../api/list'
import { BackIcon, ForwardIcon } from '../../../../assets/icons/icons'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, useAnimatedKeyboard } from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router'
import { fetchTVFromDB } from '../../../../api/tv'
import { GetTVById, GetMovieById } from '../../../../api/tmdb'
import { useGetUser, useGetUserFull } from '../../../../api/auth'


const addToListModal = () => {

    const {user} = useGetUser()
    const {userFull:ownerUser} = useGetUserFull(user?.id)
    
    const { data : userLists, refetch: refetchUserLists, isFetching } = useFetchUsersLists(ownerUser?.id)

    const {tmdbId, DBtvId, DBMovieId} = useLocalSearchParams();
    const [ tvObj, setTvObj ] = useState(null)
    const [ movieObj, setMovieObj ] = useState(null)
    const [inputHeight, setInputHeight] = useState(0)
    const inputRef = useRef(null);




    const useGetTitle = async () => {
        if (DBtvId){
            const tvObj = await GetTVById(Number(tmdbId))
            setTvObj(tvObj)
        } else if (DBMovieId){
            const movieObj = await GetMovieById(Number(tmdbId))
            setMovieObj(movieObj)
        }
    }
    useEffect(()=>{
        useGetTitle();
    }, [])


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
            transform: [{ translateY: inputHeight < 480 ? 0 : -keyboard.height.value }],
        }
        });
    const handleChange = (name, text) => {
        setInputs( prev => ({
            ...prev,
            [name] : text
        }) )
    }


    const handleCreate = async () => {
        setUploadingNewList(true)
        let formattedTitle = {}
        if (DBtvId){
            tvObj.media_type = 'tv';
            formattedTitle.item = {
              id : tvObj.id,
              name : tvObj.name,
              release_date :tvObj.first_air_date ,
              poster_path :tvObj.poster_path ,
              backdrop_path: tvObj.backdrop_path,
              media_type : tvObj.media_type,
            }
          
        } else if (DBMovieId){
            movieObj.media_type = 'movie';
            formattedTitle.item = {
              id : movieObj.id,
              title : movieObj.title,
              release_date :movieObj.release_date ,
              poster_path :movieObj.poster_path ,
              backdrop_path: movieObj.backdrop_path,
              media_type : movieObj.media_type,
            } 
        }
        
        const listData = {
            title : inputs.title,
            caption : inputs.description,
            userId :ownerUser?.id ,
            listItems : [formattedTitle]
        }
        const response = await createList(listData)
        setUploadingNewList(false)
        setInputs({
            title:'',
            description:''
        }),
        setIsCreatingList(false)
        setIsDescription(false)
        refetchUserLists();


    }

    const handleSelectList = async (item) => {

        let listIdType, mediaIdType, mediaId
        if (DBtvId){
            listIdType = 'tvId';
            mediaIdType = 'tv';
            mediaId = Number(DBtvId)
        } else if (DBMovieId){
            listIdType = 'movieId';
            mediaIdType = 'movie';
            mediaId = Number(DBMovieId)
        }

        const data = {
            listIdType ,
            listId : item.id,
            mediaIdType ,
            mediaId
        }
        try {
            const updatedList = await addToList(data)
        } catch (err) {
            console.log(err)
        } finally {
            refetchUserLists();
        }
    }

    const handleInputLayout = (event) => {
       

            inputRef.current.measureInWindow((x, y, width, height) => {
              setInputHeight(y + height); // Set the height as the combined value of y and height

            });
    }

    if (!userLists || !ownerUser){
        return (
            <View className='w-full h-full bg-primary justify-center items-center'>
                <ActivityIndicator/>
            </View>
        )
    }



  return (
    
    <ScrollView className='w-full h-full bg-primary  relative flex-1' style={{borderRadius:30}}>
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
                            const alreadyIncluded = item.listItem.some( item => item.movieId === Number(DBMovieId) || item.tvId === Number(DBtvId) )
                            return (
                                <TouchableOpacity onPress={()=>handleSelectList(item)} disabled={ alreadyIncluded }  style={{  opacity: alreadyIncluded ? 0.5 : 1, height:'auto', width:'100%',backgroundColor:Colors.mainGrayDark, borderRadius:15, paddingHorizontal:30, paddingVertical:15, gap:10}} >
                                        <View className=' gap-0 justify-center items-start' >
                                            <Text className='text-white font-pbold text-lg' >{ item.title }</Text>
                                            <Text className='text-white text-sm '>{`(${item.listItem.length} ${item.listItem.length > 1 ? `items` : 'item'})`}</Text>
                                        </View>
                                        <Text className='text-mainGray text-sm font-pregular' numberOfLines={2}>{ item.caption }</Text>
                                        { alreadyIncluded && <Text className='text-secondary text-sm text-center '>*Already included in this list!</Text>}
                                </TouchableOpacity>
                            )}}
                        ListFooterComponent={


                             isCreatingList && !isDescription ? (
                                <View  className='w-full my-3'>
                                    <TextInput
                                        // onLayout={handleInputLayout}
                                        ref={inputRef} 
                                        onLayout={handleInputLayout}

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
