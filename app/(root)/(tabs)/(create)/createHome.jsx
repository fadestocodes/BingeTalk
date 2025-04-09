import { StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, TouchableOpacity,Dimensions,  Keyboard, FlatList, TouchableWithoutFeedback,  KeyboardAvoidingView, Platform } from 'react-native'
import { Image } from 'expo-image'
import React, {useState, useEffect, useRef} from 'react'
import { PeopleIcon, SlateIcon, ThreadsIcon, DownIcon, FilmIcon, TVIcon, PersonIcon, CloseIcon, BackIcon } from '../../../../assets/icons/icons'
import { Colors } from '../../../../constants/Colors'
import CreateDialogue from '../../../../components/CreateMenu/CreateDialogue'
import CreateThread from '../../../../components/CreateMenu/CreateThread'
import CreateShowcase from '../../../../components/CreateMenu/CreateShowcase'
import CreateList from '../../../../components/CreateMenu/CreateList'
import { searchAll } from '../../../../api/tmdb'
import debounce from 'lodash.debounce'
import { getYear } from '../../../../lib/formatDate'
import { DraggableGrid } from 'react-native-draggable-grid';
import { useUser } from '@clerk/clerk-expo'
import { useFetchOwnerUser } from '../../../../api/user'
import { useRouter } from 'expo-router'
import { createCategories } from '../../../../lib/CategoryOptions'
import { useCreateContext } from '../../../../lib/CreateContext'

const CreateHome = () => {

    const [ content, setContent ] = useState('');
    const [ menuOpen, setMenuOpen ] = useState(false);
    const [ createType, setCreateType ] = useState('Dialogue')
    const [ resultsOpen, setResultsOpen ] = useState(false);
    const [ results, setResults ] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [ listItems, setListItems ]  = useState([])
    const [ flatlistVisible, setFlatlistVisible ] = useState(false);
    const [ threadObject, setThreadObject ] = useState(null)
    const [ selected, setSelected ] = useState('Dialogue')
    const { url, updateUrl } = useCreateContext()

    const [ inputs, setInputs ] = useState({
        threadTitle : '',
        threadCaption : '',
        listTitle:'',
        listDescription:''

    })

    const posterURL = 'https://image.tmdb.org/t/p/w500';

    const {user:clerkUser} = useUser();
    const { data : ownerUser } = useFetchOwnerUser({email : clerkUser?.emailAddresses[0].emailAddress});
    userId = ownerUser?.id



    const handleChange = (text) => {
        setContent(text);
    }

    const handleSearch = debounce( async (text) => {
        setResultsOpen(true)
        if (text.length > 2) {
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
    
    const handlePress = (item) => {
        // setInputs(prev => ({
        //     ...prev,
        //     query: `/${toPascalCase(item.name || item.title)}` // Convert to PascalCase
        // }));

        setSearchQuery(  `/${toPascalCase(item.name || item.title)}` )
        setResultsOpen(false);
    };


    const handleSearchPress = (item) => {
        if (createType === 'Thread') {
            setSearchQuery(  `/${toPascalCase(item.name || item.title)}` )
            setThreadObject(item)


            setResults([]);
            setResultsOpen(false);
        } else if (createType === 'List') {
            setListItems((prev) => [
                ...prev,
                {
                    item,  // Store the full item object
                    key: item.id?.toString() || Date.now().toString(), // Ensure a unique key
                },
                ]);
                setResults([]);
                setSearchQuery('');
            }

    }

    const handleRemoveListItem = (key) => {
        setListItems(prev => (
            prev.filter((item) => item.key !== key)
        ))
    }

    const handleBackSearch = () => {
        if (createType === 'Thread') {
            setResultsOpen(false);
        } else if (createType === 'List') {
            
        }
    }

    if (!ownerUser){
        return (
          <View className='w-full h-full bg-primary justify-center items-center'>
            <ActivityIndicator />
          </View>
        )
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

    

  return (
    <TouchableWithoutFeedback className='h-full w-full'  onPress={Keyboard.dismiss} >
          <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS uses padding, Android uses height
        style={{ flex: 1 }}
    >
    <SafeAreaView className='bg-primary h-full w-full  '  style={{ paddingBottom:0 }} >
    
    <View className='w-full  pt-3 px-6 gap-5'>
        <View className="">
            <View className='flex-row gap-2'>
              {/* <LayersIcon size={30} color='white' /> */}
              <Text className='text-white font-pbold text-3xl'>Create</Text>
            </View>
            <Text className='text-mainGray font-pmedium'>Speak your mind or create a List for the world to see!</Text>
        </View>

        <View className='w-full my-3'>
        <FlatList
          horizontal
          data={createCategories}
          keyExtractor={(item,index) => index}
          contentContainerStyle={{ gap:10 }}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=>{setSelected(item); setCreateType(item); setContent(''); setSearchQuery(''); setListItems([]); updateUrl({link:'',image:'',titel:'',subtitle:''}); setInputs({threadTitle:'', threadCaption:'', listTitle:'',listDescription:''}) }} style={{ borderRadius:15, backgroundColor:selected===item ? 'white' : 'transparent', paddingHorizontal:8, paddingVertical:3, borderWidth:1, borderColor:'white' }}>
              <Text className=' font-pmedium' style={{ color : selected===item ? Colors.primary : 'white' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      </View>
      { resultsOpen ? (
        <View className='w-full h-full justify-center items-center' style={{ paddingTop:20, paddingHorizontal:25, borderRadius:20, backgroundColor:Colors.primary}} >
            <View className='thread-topic w-full h-full relative  gap-3' style={{paddingBottom:100}}>
                <View className="flex-row justify-center items-center gap-3 px-4">
                    <TouchableOpacity onPress={()=> setResultsOpen(false)}>
                        <BackIcon size={20} color={Colors.mainGray}/>
                    </TouchableOpacity>
                    <TextInput
                        autoFocus={true}
                        autoCorrect={false}
                        placeholder='Search for a movie, show, or person'
                        placeholderTextColor={Colors.mainGray}
                        onChangeText={(text)=> {setSearchQuery(text);  handleSearch(text)  }}
                        className='w-full text-white rounded-3xl '
                        // style={{ height:50, paddingHorizontal:25, paddingBottom:0 }}
                        style={{ minHeight:50, backgroundColor:Colors.mainGrayDark, paddingHorizontal:25, paddingTop:0, textAlignVertical:'center' }}

                        value={searchQuery}
                    />
                </View>
                <TouchableOpacity onPress={()=> { setSearchQuery('') ; setResults([]); }}  style={{ position:'absolute', right:15, top:15 }}>
                    <CloseIcon color={Colors.mainGray} size={24} className=' ' />
                </TouchableOpacity>

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
                >
                </FlatList>

                { searchQuery === '' && createType === 'List' && (
                    <ScrollView className='pt-20  w-full h-full'   >
                        <DraggableGrid
                            numColumns={4}
                            renderItem={renderItem}
                            data={listItems}
                            itemHeight={140}
                            onDragRelease={(data) => {
                            setListItems(data);// need reset the props data sort after drag release
                            }}
                        />
                    </ScrollView>
                                    ) }
            </View>


                
         </View>
        ) : (
            <>
            
            <ScrollView scrollEnabled={ createType === 'Showcase' ? false : true }  nestedScrollEnabled={true} onPress={Keyboard.dismiss}  className="relative w-full pt-6 gap-3" contentContainerStyle={{alignItems:'center' , justifyContent : 'center', gap:10, paddingBottom:200}}>
       
       

        { createType === 'Dialogue' ? (
            <CreateDialogue flatlistVisible={flatlistVisible} setFlatlistVisible={setFlatlistVisible} />
        ) : createType === 'Thread' ? (
            <CreateThread threadObject={threadObject}  handleChange={handleChange} inputs={inputs} setInputs={setInputs}
                results={results} setResults={setResults} resultsOpen={resultsOpen} setResultsOpen={setResultsOpen}
                handleSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            />
        ) : createType === 'Showcase' ? (
            <CreateShowcase handleChange={handleChange} content={content} setContent={setContent} />
        ) : createType === 'List' && (
            <CreateList userId={userId}  handleChange={handleChange} inputs={inputs} setInputs={setInputs} setResultsOpen={setResultsOpen}
            setResults={setResults} setSearchQuery={setSearchQuery}  searchQuery={searchQuery} setListItems={setListItems} listItems={listItems} 
            renderItem={renderItem} handleRemoveListItem={handleRemoveListItem}
            />
        )}
      </ScrollView>
      </>
        )}  

    </SafeAreaView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default CreateHome

const styles = StyleSheet.create({})