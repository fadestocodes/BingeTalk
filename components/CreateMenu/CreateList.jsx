import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Image } from 'react-native'
import React, {useState, useEffect} from 'react'
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DraggableGrid } from 'react-native-draggable-grid';
import { createList } from '../../api/list';

import { Colors } from '../../constants/Colors'
import { SlateIcon, PeopleIcon, ThreadsIcon, CloseIcon } from '../../assets/icons/icons'

const CreateList = ( {handleChange, content, userId, setResults, setResultsOpen, searchQuery, setSearchQuery,listItems, setListItems, renderItem, handleRemoveListItem } ) => {

    const posterURL = 'https://image.tmdb.org/t/p/original';
    // console.log('listItems from child component', listItems);
    // useEffect(() => {
    //     console.log('Updated listItems in child:', listItems); // This will log when the state updates
    //   }, [listItems]);  //  


    const [ inputs, setInputs ] = useState({
        title : '',
        description : ''
    })

    const handleInput = (name, value) => {
        setInputs( prev => ({
            ...prev,
            [name] : value
        }) )
    }

    const handlePost = async () => {
        console.log('listtitle', inputs.title)
        const postData = {
            title : inputs.title ,
            caption : inputs.description,
            userId,
            listItems
        }
        console.log('POST DATA', postData);
        const newList = await createList(postData)
        console.log('NEW CREATED LIST', newList)
        setInputs({
            title : '',
            description : ''
        })
        setSearchQuery('')
        setListItems([])
    }


    
     


  return (
    <View className='w-full px-6 relative items-center justify-center gap-5'>
        <View className='thread-topic w-full relative '>
                <TextInput
                    placeholder='Search for a movie, show, or person'
                    placeholderTextColor={Colors.mainGray}
                    multiline
                    autoCorrect={false}
                    onChangeText={(text)=> { setSearchQuery(text);  handleSearch(text)  }}
                    className='w-full text-white rounded-3xl '
                    style={{ minHeight:50, backgroundColor:Colors.mainGrayDark, paddingHorizontal:25, paddingTop:15, textAlignVertical:'center' }}
                    value={searchQuery}
                    onFocus={()=>setResultsOpen(true)}
                />
                <TouchableOpacity onPress={()=> { setSearchQuery('') ; setResults([]); setResultsOpen(false)}}  style={{ position:'absolute', right:20, top:15 }}>
                    <CloseIcon color={Colors.mainGray} size={24} className=' ' />
                </TouchableOpacity>
            </View>
            <View className='relative w-full'>
                <TextInput
                        onChangeText={(text) => handleInput('title', text)}
                        value={inputs.title}
                        multiline
                        maxLength={100}
                        placeholder='List title'
                        placeholderTextColor={Colors.mainGray}
                        style={{paddingTop:20, paddingHorizontal:25,backgroundColor:Colors.mainGrayDark, paddingBottom:50, minHeight:50}}
                        className='w-full relative min-h-50 bg-white rounded-3xl  items-start justify-start font-pbold text-lg text-white'
                />
               
                <View className=' items-center z-10 gap-3 w-full bg-white  '  style={{ backgroundColor:Colors.mainGrayDark,position:'absolute', bottom:0, borderBottomRightRadius: 24, borderBottomLeftRadius:24 , height : 40 ,  paddingHorizontal:25, paddingBottom:20, justifyContent:'start'}}>
                 
                    <View className='border-t-[1px] border-mainGrayLight w-full' style={{ borderTopWidth:1, borderColor:Colors.mainGray }}
                    />
                    <View className='flex-row justify-end items-center  gap-3' style={{width:'100%',  justifyContent:'flex-end'}}>
                       
                        <Text className='text-mainGray text-right '>{inputs.title.length}/100</Text>
                    </View>
                </View>



            </View>

            
            <View className='relative w-full'  style={{marginBottom:30}}>
                <TextInput
                        onChangeText={(text) => handleInput('description', text)}
                        value={inputs.description}
                        multiline
                        maxLength={250}
                        placeholder='Description of your list'
                        placeholderTextColor={Colors.mainGray}
                        style={{paddingTop:20, paddingHorizontal:25, backgroundColor:Colors.mainGrayDark,paddingBottom:70, minHeight:150}}
                        className='w-full relative min-h-50 bg-white rounded-3xl  items-start justify-start font-pregular text-white'
                />
                <View className='justify-center items-center z-10 gap-3 w-full text-white  '  style={{ backgroundColor:Colors.mainGrayDark, position:'absolute', bottom:0, borderBottomRightRadius: 24, borderBottomLeftRadius:24 , height : 70 }}>
                 
                     <View className='w-full justify-center items-center gap-3 text-white' style={{ backgroundColor:Colors.mainGrayDark, width:'100%', position:'absolute',bottom:0, borderBottomRightRadius: 24, borderBottomLeftRadius:24 , paddingHorizontal:25, paddingBottom:10}}>
                    
                        <View className='border-t-[1px] border-slate-300 w-full' style={{ borderTopWidth:1, borderColor:Colors.mainGray }}
                        />
                        <View className='flex-row justify-end items-center  gap-3' style={{width:'100%',  justifyContent:'flex-end'}}>
                        
                            <Text className='text-mainGray text-right '>{inputs.title.length}/250</Text>
                        </View>
                    </View>
                    
                </View>
                
            </View>
            <TouchableOpacity className=' bg-secondary rounded-xl justify-center items-center' onPress={handlePost} style={{paddingVertical:8, width:200, height:45, paddingHorizontal:20, marginBottom:50 }}>
                    <Text className='font-pbold text-center ' style={{}} >Post</Text>
            </TouchableOpacity>
            <View className=" w-full " style={{paddingBottom:120}}>
                <DraggableGrid
                            numColumns={4}
                            renderItem={renderItem}
                            data={listItems}
                            itemHeight={140}
                            onDragRelease={(data) => {
                               setListItems(data);// need reset the props data sort after drag release
                            }}
                />
            </View>
            {/*  */}
             
    </View>
  )
}

export default CreateList

const styles = StyleSheet.create({})