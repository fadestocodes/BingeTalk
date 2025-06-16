import { StyleSheet, Text, View , ActivityIndicator, TextInput, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, FlatList, ScrollView} from 'react-native'
import React, {useState, useEffect} from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCustomFetchSingleList , updateList} from '../../api/list'
import { Colors } from '../../constants/Colors'
import { useUser } from '@clerk/clerk-expo'
import { BackIcon, CloseIcon, TVIcon, FilmIcon, PersonIcon } from '../../assets/icons/icons'
import { useFetchOwnerUser } from '../../api/user'
import { searchAll } from '../../api/tmdb'
import { List } from 'lucide-react-native'
import debounce from 'lodash.debounce'
import { Image } from 'expo-image'
import { DraggableGrid } from 'react-native-draggable-grid';
import { getYear } from '../../lib/formatDate'
import { createListSchema } from '../../lib/zodSchemas'
import ToastMessage from '../ui/ToastMessage'


const EditListScreen = () => {
    const { listId } = useLocalSearchParams()
    const { user:clerkUser } = useUser()
    const { data: ownerUser } = useFetchOwnerUser({email : clerkUser?.emailAddresses[0].emailAddress})
    const { list  } = useCustomFetchSingleList(listId)
    const [ inputs, setInputs ] = useState({
        title : list?.title || '',
        caption : list?.caption || '',

    })
    const [isListEmpty, setIsListEmpty] = useState(false)
    const [ message, setMessage ] = useState(null)
    const [listItems, setListItems] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [ resultsOpen, setResultsOpen ] = useState(false);
    const [ results, setResults ] = useState([]);
    const [errors, setErrors] = useState(null)
    const router = useRouter()

    const posterURL = 'https://image.tmdb.org/t/p/w500';

    useEffect(() => {
        if (list){
            const structuredListItems = list?.listItem?.map( i => ({
                ...i,
                item : {
                    media_type : i?.movieId ? 'movie' : i?.tvId ? 'tv' : i?.castId && 'person',
                    profile_path : i?.castId && i.castCrew.posterPath,
                    poster_path : i?.movie?.posterPath || i?.tv?.posterPath,
                    title : i?.movie?.title || i?.tv?.title ,
                    name : i?.castCrew?.name,
                    id : i?.movie?.tmdbId || i?.tv?.tmdbId || i?.castCrew?.tmdbId,
                },
                key : i.id?.toString() || Date.now().toString()
            }))

            setListItems(structuredListItems)
            setInputs({
                title : list.title,
                caption : list.caption
            })
        }
    
    },[list])


    const handleSearch = debounce( async (text) => {
        setResultsOpen(true)
        if (text.length > 1) {
            try {
                const response = await searchAll(text);
                setResults(response.results);
            } catch (err) {
                console.log(err)
            }
        } 
    }, 300)


    const toPascalCase = (str) => {
        return str
            .replace(/[^a-zA-Z0-9 ]/g, '') // Remove non-alphanumeric characters except spaces
            .split(' ') // Split words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
            .join(''); // Join words without spaces
    };


    const handleSearchPress = (item) => {
     
            setListItems((prev) => [
                ...prev,
                {
                    item,  // Store the full item object
                    key: item.id?.toString() || Date.now().toString(), // Ensure a unique key
                },
                ]);
                setResults([]);
                setSearchQuery('');
                setResultsOpen(false)

    }

    const handleRemoveListItem = (key) => {
        setListItems(prev => (
            prev.filter((item) => item.key !== key)
        ))
    }


    const renderItem = (item) => {
        return (
          <View className=' justify-start items-center relative '
            style={{ width:'auto', height:170,  marginHorizontal:0, marginVertical:0, overflow:'hidden' }}
            key={item.key}  // Set key here based on the item key
          >
           <Image 
            source={ item.media_type === 'person' ? {uri:`${posterURL}${item.item.profile_path}`}  : {uri:`${posterURL}${item.item.poster_path}`}}
            contentFit='cover'
            style={{ width:70, height:100, borderRadius:10, overflow:'hidden' }}
            />
            <Text  numberOfLines={2} style={{width:70}} className='text-mainGray text-xs'>{item.item.name || item.item.title}</Text>
            <TouchableOpacity className='rounded-full' onPress={() => handleRemoveListItem(item.key)}  style={{ backgroundColor:Colors.primary, position:'absolute', top:4, right:1 }}>
                <CloseIcon size={20} color={Colors.mainGray} />
            </TouchableOpacity>
          </View>
        );
      };


    const handlePost = async () => {
        if (listItems.length < 1){
            setIsListEmpty(true) 
            return
        } else {
            setIsListEmpty(false)
        }

        const validationResults = createListSchema.safeParse( { ...inputs,  listTitle: inputs.title } )
        if (!validationResults.success) {
            const errorObj = validationResults.error.format();
            console.log(errorObj)
            setErrors(errorObj.listTitle._errors[0] )
            return 
            } else {
              setErrors(null)
            }
            console.log('madeithere')

        const postData = {
            title : inputs.title.trim() ,
            caption : inputs.caption.trim(),
            userId: ownerUser.id,
            listItems,
            listId : list.id

        }
        console.log('postdataforupdatelist', postData)
        const newList = await updateList(postData)
        setSearchQuery('')
        setMessage(newList.message)
        setTimeout(()=>{
            router.back()
        },1200)
        
        // setListItems([])
    }



    if (!list || !ownerUser){
        return (
            <View className='w-full h-full bg-primary justify-center items-center'>
                <ActivityIndicator/>
            </View>
        )
    }

  return (
    <TouchableWithoutFeedback className='h-full w-full'  onPress={  Keyboard.dismiss} >
    <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS uses padding, Android uses height
  style={{ flex: 1 }}
>
<ToastMessage message ={message} onComplete={()=> setMessage(null)} icon={<List size={30} color={Colors.secondary}/>}   />

    <View className='w-full h-full bg-primary ' style={{gap:15, paddingHorizontal:30}}>
        <TouchableOpacity onPress={()=>router.back()} style={{ position:'absolute', top:50, left :25 }}>
            <BackIcon color={Colors.mainGray} size={26} ></BackIcon>
        </TouchableOpacity>
<View style={{ width:55, height:7, borderRadius:10, backgroundColor:Colors.mainGray, position:'absolute', top:40 , alignSelf:'center', }} />
        <View style={{paddingTop:100, gap:15}}>
        <View className="flex-row relative justify-center items-center gap-3 ">
            { resultsOpen && (
                    <TouchableOpacity onPress={()=> {Keyboard.dismiss();setResultsOpen(false)}}>
                        <BackIcon size={20} color={Colors.mainGray}/>
                    </TouchableOpacity>
            ) }
            <View className='' style={{width:300}}>
                    <TextInput
                        autoFocus={true}
                        autoCorrect={false}
                        placeholder='Search for a movie, show, or person'
                        placeholderTextColor={Colors.mainGray}
                        onChangeText={(text)=> {setSearchQuery(text);  handleSearch(text)  }}
                        className=' text-white rounded-3xl '
                        style={{ minHeight:50, width:'100%', backgroundColor:Colors.mainGrayDark, paddingHorizontal:25, paddingBottom:10, textAlignVertical:'center' }}
                        value={searchQuery}
                    />
                <TouchableOpacity onPress={()=> { setSearchQuery('') ; setResults([]); }}  style={{ position:'absolute', right:10, top:15 }}>
                    <CloseIcon color={Colors.mainGray} size={24} className=' ' />
                </TouchableOpacity>

            </View>
                </View>
                </View>

            { resultsOpen ? (
                <>
                 <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle = {{width:'100%' , zIndex:45}}
                    renderItem={({item}) =>  {
                        return (
                        <View  >

                            <View className=''>
                                <TouchableOpacity onPress={()=>handleSearchPress(item)} className='w-full gap-5 flex-row my-3 justify-start items-center'
                                        disabled={ listItems.some( element => element.item.id === item.id) ? true : false}
                                        style={{ opacity: listItems.some( element => element.item.id === item.id) ? 0.5 : 1    }}
                                         
                                    >
                                    <Image 
                                    source={ item.media_type === 'person' ? {uri:`${posterURL}${item.profile_path}`}  : {uri:`${posterURL}${item.poster_path}`}}
                                    contentFit='cover'
                                    style={{ width:50, height:75, borderRadius:10, overflow:'hidden' }}
                                    />
                                    <View className='flex flex-1 w-full justify-center pr-0'>
                                    <View className='flex-row gap-2 flex-1 justify-center items-center'>
                                        { item.media_type === 'person' ? <PersonIcon size={18} color={Colors.secondary} /> : item.media_type === 'movie' ? <FilmIcon size={18} color={Colors.secondary}/> : <TVIcon size={18} color={Colors.secondary}/>}
                                        <Text   style={{ flex: 1, flexWrap: 'wrap' }} className='text-mainGray   pr-3 font-pbold'>{ item.media_type === 'movie' ? item.title : item.name }</Text>

                                    </View>
                                    <Text   style={{ flex: 1, flexWrap: 'wrap' }} className='text-mainGray text-sm  pr-3 font-pmedium'>{ item.media_type === 'person' 
                                    ? `Known for ${item.known_for_department}` : item.media_type === 'movie' ? `Released ${getYear(item.release_date)}` 
                                    : `First aired ${getYear(item.first_air_date)}` }</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ borderTopWidth: .5, borderColor:Colors.mainGray }} />
                        </View>
                    )}

                }
                
                />
                </>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} className='h-full' >
                    <View style={{width:'100%', paddingTop:30, paddingBottom:150, gap:15}}>
                    <View className='gap-3'>
                    { errors && (
                        <View className='w-full mt-1 mb-3 justify-center'>
                    <Text className='text-red-400'>*{errors}</Text>
                    </View>
                ) }
                <Text className='text-mainGray font-pmedium'>Title:</Text>
                <TextInput
                    value={ inputs.title }
                    placeholder='Enter list title'
                    placeholderTextColor={Colors.mainGray}
                    multiline={true}
                    onChangeText={(text)=>setInputs(prev=>({...prev, title:text}))}
                    className='font-pbold text-2xl'
                    style={{ color:'white', width:'100%', backgroundColor:Colors.mainGrayDark, maxHeight:120, paddingVertical:15, borderRadius:15, paddingHorizontal:15, justifyContent:'center', alignItems:'center' }}
                />
                </View>
                    <View className='gap-3'>
                <Text className='text-mainGray font-pmedium'>Description:</Text>
                <TextInput
                    value={ inputs.caption }
                    placeholder='Enter list title'
                    placeholderTextColor={Colors.mainGray}
                    onChangeText={(text)=>setInputs(prev=>({...prev, caption:text}))}

                    multiline={true}
                    className='font-pregular'
                    style={{ color:'white', width:'100%', height :100,backgroundColor:Colors.mainGrayDark, paddingVertical:15, borderRadius:15, paddingHorizontal:15, justifyContent:'center', alignItems:'center' }}
                />
                </View>
                <View className='w-full ' style={{paddingTop:30 }}>
                    
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
                 { isListEmpty && (
                 <Text className='text-red-400 self-start'>*List cannot be empty</Text>
                ) }

                 <TouchableOpacity onPress={handlePost} style={{ borderRadius:30, paddingHorizontal:5, paddingVertical:10, backgroundColor:Colors.secondary, width:150, alignSelf:'center' }}>
                    <Text className='text-primary  text-lg font-pbold text-center'>Save</Text>
                 </TouchableOpacity>
                 </View>
             </ScrollView>


            ) }



    </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default EditListScreen

const styles = StyleSheet.create({})