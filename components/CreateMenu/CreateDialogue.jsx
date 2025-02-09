import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Image, Keyboard, SectionList, Pressable } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Colors } from '../../constants/Colors'
import { SlateIcon, PeopleIcon, ThreadsIcon,UploadPictureIcon, CloseIcon } from '../../assets/icons/icons'
import { pickSingleImage } from '../../lib/pickImage'
import { searchAll } from '../../lib/TMDB'
import { MentionInput } from 'react-native-controlled-mentions'
import debounce from 'lodash.debounce'

const toPascalCase = (str) => {
        return str
            .replace(/[^a-zA-Z0-9 ]/g, '') // Remove non-alphanumeric characters except spaces
            .split(' ') // Split words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
            .join(''); // Join words without spaces
    };

const CreateDialogue = ( {flatlistVisible, setFlatlistVisible} ) => {

    const [ input, setInput ] = useState('')
    const [image, setImage] = useState(null);
    const [ loadingImage, setLoadingImage ] = useState(false);
    const [ results, setResults ] = useState([]);
    const [ resultsOpen, setResultsOpen ] = useState(false);
    const [ mentionIndex, setMentionIndex ] = useState(null);
    const [inputLayout, setInputLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [ textParts, setTextParts ] = useState([])
    const [ mentions, setMentions ] = useState([])
    const [ suggestionOpen, setSuggestionOpen ] = useState(true)
    const inputRef = useRef(null);  // Create a ref for the MentionInput
    const [filteredMentions, setFilteredMentions] = useState([]);



    const posterURL = 'https://image.tmdb.org/t/p/original';

   


    useEffect(() => {
      
        mentions.forEach( mention => {
            if (!input.includes(mention.pascalName)){
                console.log(' the mentino to remove is ', mention.pascalName)
            }
        }  )
        setMentions(prev => prev.filter( item => input.includes(item.pascalName) ) )
        // console.log('Mentions after filtering', filteredMentions);
    }, [input]);  // Watching both input and mentions
   

    const handleSearch = debounce( async (query) => {
        if (query.length > 2) {
            try {
                setResultsOpen(true)
                setSuggestionOpen(true)
                const response = await searchAll(query);
                setResults(response.results);
                // setResults( [{ title : 'Results', data : response.results }] )
                // console.log('results are ', results)
            } catch (err) {
                console.log(err)
            }
        } 
    }, 300)

    const handleInput = (text) => {
        setInput(text);
    }



    const handleMentionSelect = (selectedItem) => {
        setMentions(selectedItem);
    }

    useEffect(( ) => {
        console.log('mentions array ', mentions)
    }, [mentions])


    const removeMention = (mentionId) => {
        setTextParts( prev => prev.filter((part) => part.id !== mentionId) )
    }

//-----------------
    const renderSuggestions = ( { keyword, onSuggestionPress } ) => {

        
        if (keyword === null || mentions.some( mention => mention.pascalName === keyword ) || keyword === undefined ) {
            return null
        }
        handleSearch(keyword)
        return (
            <View style={{  }} >
              
                { results.length > 0 && results.map( item => (
                     <TouchableOpacity  
                        key={item.id}
                        disabled={mentions.some((mention) => mention.pascalName === toPascalCase(item.name || item.title))}

                        onPress={() => {
                            setResults([]);
                            setSuggestionOpen(false)
                            const mentionText = `${toPascalCase(item.name || item.title)}`;
                            setMentions((prev) => {
                                const exists = prev.some((mention) => mention.pascalName === mentionText);
                              
                                if (!exists) {
                                  return [...prev, { mentionObj: item.name || item.title, pascalName: mentionText }];
                                }
                              
                                return prev; // If it exists, return the same array without adding a duplicate
                              });
                            onSuggestionPress({
                                id: item.id,
                                name: mentionText, // This inserts the mention into input
                            });
                           
                        }} 
                        style={{ width:'100%', padding:10, paddingHorizontal:10, borderBottomWidth:.5, borderColor:Colors.mainGray }}
                    >
                   
                     <Text style={{ opacity : mentions.some((mention) => mention.pascalName === toPascalCase(item.name || item.title)) ? .2 : 1 }}  className='text-mainGray text-sm '>{item.name || item.title}</Text>
                 </TouchableOpacity>
                ) ) }
            </View>
        )
    }
//------------------

    


    
 


  return (
    <View onPress={()=>{setResultsOpen(false); setFlatlistVisible(false)}} className='w-full px-6 relative items-center justify-center' style={{  }} >

        {/* { resultsOpen && flatlistVisible && (
            <View style ={{ position:'absolute', width:300, zIndex:30, paddingVertical:20, paddingHorizontal:10,  height:'auto', backgroundColor:Colors.primary, top:inputLayout.y + inputLayout.height - 40 , borderRadius:24, borderWidth:2, borderColor:Colors.mainGray }}>
                <FlatList
                    data = { results }
                    horizontal
                    // scrollEnabled={ flatlistVisible ? true : false }
                    // scrollEnabled={false}
                    nestedScrollEnabled={true}
                    keyExtractor={(item) => item.id} 
                    contentContainerStyle={{ width:'auto', zIndex:30 }}
                    renderItem={({item}) => (
                        // <View style={{ width:100 }}>
                            <TouchableOpacity onPress={() => handleMentionSelect(item)} style={{  paddingHorizontal:10, width:100 }}>
                                <Image
                                    source={ item.media_type === 'person' ? {uri:`${posterURL}${item.profile_path}`}  : {uri:`${posterURL}${item.poster_path}`}}
                                    resizeMode='cover'
                                    style={{ height:100, width:70 }}
                                />
                                <Text className='text-mainGray text-xs '>{item.name || item.title}</Text>
                            </TouchableOpacity>
                        // </View>
                    )}

                />
            </View>
        ) } */}

        <View className='w-full relative items-center justify-between ' style={{marginBottom:20, position:'relative'}}>


        {/* trying the mention package */}
        
           <MentionInput
            value = {input}
            multiline={true}
            onChange={handleInput}
            style={{ fontFamily:'Courier', fontSize:15, lineHeight:24, color:'white' }}
            maxLength={800}
            placeholder="Use '/' to tag a movie, show, cast, or crew. "
            placeholderTextColor={Colors.mainGray}
            autoCorrect={false}
            partTypes={ [
                {
                    trigger : '/',
                    textStyle : { fontWeight: 'bold', color:Colors.secondary },
                    renderSuggestions,
                    isBottomMentionSuggestionsRender:true,
                    isInsertSpaceAfterMention:true
                }
            ] }
            containerStyle = { {backgroundColor:Colors.mainGrayDark, width:'100%', fontFamily : 'Courier', fontSize:18,minHeight:200,paddingTop: input ? 60 : 40, paddingHorizontal:25, paddingBottom:50, minHeight:200, borderTopLeftRadius:24, borderTopRightRadius:24} }
           
           />

        {/* end of using mentino package */}


        {/* this works, use as backup */}
            {/* <TextInput
                    onChangeText={handleInput}
                    value={input}
                    onLayout={(event) => {setInputLayout(event.nativeEvent.layout); console.log('on layout',inputLayout) }}
                    multiline
                    maxLength={800}
                    placeholder='Talk about a movie, show, cast/crew...'
                    placeholderTextColor={Colors.mainGray}
                    style={{paddingTop: input ? 60 : 20, paddingHorizontal:25, paddingBottom:50, minHeight:200, borderTopLeftRadius:24, borderTopRightRadius:24}}
                    className='w-full relative min-h-50 bg-white   items-start justify-start font-pcourier text-lg'
            /> */}


            {/* Render chips for each mention */}
                    {/* {mentions.map((mention, index) => (
                    <View
                    key={mention.key}
                    style={{
                        flexDirection:'row',
                        gap:5,
                        position: 'absolute',
                        left: mention.position.x,   // Absolute positioning based on layout
                        top: mention.position.y,    // Same here for vertical positioning
                        width: 'auto',
                        height: mention.position.height,
                        backgroundColor: 'lightblue',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 15,
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                    }}
                    onLayout={(event) => handleMentionLayout(event, index)} // Get layout of the mention chip
                    >
                        <Text style={{ fontWeight: 'bold' }}>{mention.text}</Text>
                        <TouchableOpacity onPress={() => removeMention(index)}>
                        <CloseIcon size={14} color={Colors.mainGray} />
                        </TouchableOpacity>
                    </View>
                    ))} */}

        { input && (
            <View style={{position:"absolute", top:30, alignItems:'center', justifyContent:'center', width:'100%'}}>
                <Text className='font-pcourier uppercase text-lg text-white ' >Drew</Text>
            </View>

        ) }


        {   loadingImage ? (
            <View className='bg-mainGrayDark justify-center items-center' style={{ width:'100%', height : 200 }}>
                <ActivityIndicator></ActivityIndicator>
            </View>
        ) 
        
        : image && (
            <View className='bg-mainGrayDark justify-center items-center ' style={{  width:'100%', paddingBottom:50}}>
                    <View className="relative">
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
     
            <View className='w-full justify-center items-center gap-3 ' style={{width:'100%', position:'absolute',bottom:0, backgroundColor:Colors.mainGrayDark, borderBottomRightRadius: 24, borderBottomLeftRadius:24 , paddingHorizontal:25, paddingBottom:20}}>
                    
                    <View className='border-t-[1px] w-full' style={{borderColor:Colors.mainGray, borderTopWidth:1}}
                    />
                    <View className='flex-row justify-end items-center  gap-3' style={{width:'100%',  justifyContent:'space-between'}}>
                        <TouchableOpacity>
                            <UploadPictureIcon onPress={()=>pickSingleImage(setImage, setLoadingImage)} color={Colors.mainGray} size={24} />
                        </TouchableOpacity>
                        <View className="flex-row justify-center items-center gap-3">
                            <Text className='text-mainGray text-right '>{input.length}/800</Text>
                            <TouchableOpacity onPress={()=>console.log('mentinos when posting',mentions)}>
                        <Text className='font-pbold bg-secondary rounded-xl ' style={{paddingVertical:8, paddingHorizontal:20}} >Post</Text>
                    </TouchableOpacity>

                        </View>
                    </View>
                </View>
    </View>
  )
}

export default CreateDialogue

const styles = StyleSheet.create({})