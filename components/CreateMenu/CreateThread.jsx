    import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, Image, ActivityIndicator } from 'react-native'
    import React, {useState, useEffect} from 'react'
    import { Colors } from '../../constants/Colors'
    import { SlateIcon, PeopleIcon, ThreadsIcon, CloseIcon, FilmIcon, PersonIcon, TVIcon , UploadPictureIcon} from '../../assets/icons/icons'
    import { searchAll } from '../../lib/TMDB'
    import debounce from 'lodash.debounce';
    import { getYear } from '../../lib/formatDate'
    import { pickSingleImage } from '../../lib/pickImage'    



    const CreateThread = ( {handleChange, content, setContent, handleSearch, results, setResults, resultsOpen, setResultsOpen, searchQuery, setSearchQuery} ) => {

        const [ inputs, setInputs ] = useState({
            // query : '',
            title : '',
            caption : ''
        })
        const [ image, setImage ] = useState(null); 
        const [ loadingImage, setLoadingImage ]  = useState(false);
        const [contentHeight, setContentHeight] = useState(0); 
        const posterURL = 'https://image.tmdb.org/t/p/original';

       

      

        // const toPascalCase = (str) => {
        //     return str
        //         .replace(/[^a-zA-Z0-9 ]/g, '') // Remove non-alphanumeric characters except spaces
        //         .split(' ') // Split words
        //         .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
        //         .join(''); // Join words without spaces
        // };
        
        // const handlePress = (item) => {
        //     setInputs(prev => ({
        //         ...prev,
        //         query: `/${toPascalCase(item.name || item.title)}` // Convert to PascalCase
        //     }));
        //     setResultsOpen(false);
        // };
        

    return (
      
        <View  className='w-full px-6  items-center justify-center gap-5' style={{paddingBottom:200}}>

            <View className='thread-topic w-full relative justify-center items-center '>
                <TextInput
                    placeholder='Thread topic (film, show, person)'
                    placeholderTextColor={Colors.mainGray}
                    multiline
                    autoCorrect={false}
                    onChangeText={(text)=> { setSearchQuery(text);  handleSearch(text)  }}
                    className='w-full bg-white rounded-3xl  font-pregular '
                    style={{ minHeight:50, paddingHorizontal:25, paddingTop:15, justifyContent:'center', alignItems:'center', textAlignVertical:'center', backgroundColor:Colors.mainGrayDark, color:'white' }}
                    value={searchQuery}
                    onFocus={()=>setResultsOpen(true)}
                />
                <TouchableOpacity onPress={()=> { setSearchQuery('') ; setResults([]); setResultsOpen(false)}}  style={{ position:'absolute', right:20, top:15 }}>
                    <CloseIcon color={Colors.mainGray} size={24} className=' ' />
                </TouchableOpacity>
            </View>

            

            <View className='thread-title w-full relative flex-1 '>
                <View className='w-full relative items-center justify-between ' style={{marginBottom:20}}>
                    <TextInput
                        placeholder='Thread title'
                        placeholderTextColor={Colors.mainGray}
                        className='w-full bg-white  text-lg font-pbold text-white'
                        onChangeText={(text)=> setInputs(prev => ({ ...prev, title : text }))}
                        maxLength={150}
                        multiline
                        value={inputs.title}
                        style={{ minHeight: 100, backgroundColor:Colors.mainGrayDark, paddingHorizontal:25, paddingTop:20, paddingBottom:40 , borderTopLeftRadius: 24, borderTopRightRadius:24}}
                        
                    />
                {   loadingImage ? (
                    <View className='bg-white justify-center items-center' style={{ width:'100%', height : 200 }}>
                        <ActivityIndicator></ActivityIndicator>
                    </View>
                ) 
                
                : image && (
                    <View className=' justify-center items-center ' style={{  width:'100%', paddingBottom:50, backgroundColor:Colors.mainGrayDark}}>
                            <View className="relative" style={{backgroundColor:Colors.mainGrayDark}}>
                                <Image
                                    source={{ uri: image }}
                                    style={{ width:300, height:200 , zIndex:30, borderRadius:15, overflow:'hidden'}}
                                    resizeMode='cover'
                                />
                                <TouchableOpacity onPress={()=> setImage(null)} className='rounded-full bg-primary border-[1px] border-mainGray' style={{  position:'absolute', zIndex:30, top:6, right:10 }}>
                                    <CloseIcon color={Colors.mainGray} size={22} className='' style={{  }} />
                                </TouchableOpacity>
                            </View>
                    </View>
                    ) }
                    </View>
                <View className='w-full justify-center items-center gap-3 bg-white' style={{width:'100%',backgroundColor:Colors.mainGrayDark, position:'absolute',bottom:0, borderBottomRightRadius: 24, borderBottomLeftRadius:24 , paddingHorizontal:25, paddingBottom:15}}>
                    
                    <View className='border-t-[1px] border-slate-300 w-full' style={{ borderTopWidth:1, borderColor:Colors.mainGray }}
                    />
                    <View className='flex-row justify-end items-center  gap-3' style={{width:'100%',  justifyContent:'space-between'}}>
                        <TouchableOpacity>
                            <UploadPictureIcon onPress={()=>pickSingleImage(setImage, setLoadingImage)} color={Colors.mainGray} size={24} />
                        </TouchableOpacity>
                        <Text className='text-mainGray text-right '>{inputs.title.length}/150</Text>
                    </View>
                </View>
            </View>

            <View className='thread-caption w-full relative'>
                <TextInput
                    onChangeText={(text)=> setInputs(prev => ({ ...prev, caption : text }))}
                    value={inputs.caption}
                    multiline
                    maxLength={800}
                    placeholder='Caption for your thread (optional)'
                    placeholderTextColor={Colors.mainGray}
                    style={{paddingTop: inputs.caption ? 60 :  20, paddingHorizontal:25,backgroundColor:Colors.mainGrayDark, color:'white', paddingBottom:120, minHeight:200, textAlignVertical:'top'}}
                    className='w-full relative min-h-50 bg-white rounded-3xl  items-start justify-start font-pcourier text-lg'
                />
                { inputs.caption && (
                    <View style={{position:"absolute", top:30, alignItems:'center', justifyContent:'center', width:'100%'}}>
                        <Text className='font-pcourier uppercase text-lg text-white' >Drew</Text>
                    </View>
                ) }
                <View className='justify-center items-center z-10 gap-3 w-full bg-white  '  style={{ position:'absolute',backgroundColor:Colors.mainGrayDark, bottom:0, borderBottomRightRadius: 24, borderBottomLeftRadius:24 , height : 70 }}>
                    <View className='border-t-[1.5px] border-slate-200 w-full' 
                    />
                     <View className='w-full justify-center items-center gap-3 bg-white' style={{width:'100%', backgroundColor:Colors.mainGrayDark,position:'absolute',bottom:0, borderBottomRightRadius: 24, borderBottomLeftRadius:24 , paddingHorizontal:25, paddingBottom:10}}>
                    
                    <View className='border-t-[1px]  w-full' style={{borderColor:Colors.mainGray, borderTopWidth:1}}
                    />
                    <View className='flex-row justify-end items-center  gap-3' style={{width:'100%',  justifyContent:'flex-end'}}>
                       
                        <Text className='text-mainGray text-right '>{inputs.title.length}/800</Text>
                    </View>
                </View>
                </View>
            </View>
                <TouchableOpacity className=' bg-secondary rounded-xl justify-center items-center' onPress={()=>{console.log(content)}} style={{paddingVertical:8, width:200, height:45, paddingHorizontal:20 }}>
                    <Text className='font-pbold text-center ' style={{}} >Post</Text>
                </TouchableOpacity>
        </View>

    )
    }

    export default CreateThread

    const styles = StyleSheet.create({})