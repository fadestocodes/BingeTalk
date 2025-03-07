import { StyleSheet, Text, View, TextInput,  Keyboard, FlatList, TouchableWithoutFeedback, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Button, Image } from 'react-native'
import { DraggableGrid } from 'react-native-draggable-grid';
import { CloseIcon, BackIcon, TVIcon, FilmIcon } from '../../../../../assets/icons/icons';
import { searchTitles } from '../../../../../api/tmdb';
import { getYear } from '../../../../../lib/formatDate';
import debounce from 'lodash.debounce';
import { Colors } from '../../../../../constants/Colors';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { updateRotation } from '../../../../../api/user';

import React, {useEffect, useState} from 'react'
import { useFetchOwnerUser } from '../../../../../api/user';

const editRotation = () => {
  
  const [ resultsOpen, setResultsOpen ] = useState(false);
  const [ results, setResults ] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ listItems, setListItems ]  = useState([])
  const {user} = useUser();
  const posterURL = 'https://image.tmdb.org/t/p/original';
  const router = useRouter();

  const { data : userDB, refetch } = useFetchOwnerUser( {email : user.emailAddresses[0].emailAddress} );
  const userId = userDB.id
  const oldRotation = userDB?.currentRotation
  
  useEffect(() => {
    // console.log('old rotation', oldRotation)
    oldRotation.forEach( item => {
      setListItems((prev) => [
        ...prev,
        {
            item,  // Store the full item object
            key: item.id?.toString() || Date.now().toString(), // Ensure a unique key
        },
        ]);
    } )
  }, [])
  console.log('listitems',listItems)



  const handleChange = (text) => {
      setSearchQuery(text)
      handleSearch(text);
    }
  
    const handleSearch = debounce( async (text) => {
      if (text.length > 2) {
        try {
          const response = await searchTitles(text);
          // console.log('response is ', response)
  
          setResults(response);
          // console.log('results are ', response.results)
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
     
     if ( listItems.length < 5  ) {
         setListItems((prev) => [
             ...prev,
             {
                 item,  // Store the full item object
                 key: item.id?.toString() || Date.now().toString(), // Ensure a unique key
             },
             ]);
             setResults([]);
             setSearchQuery('');
     } else {
      return
     }

  }

  const handleRemoveListItem = (key) => {
      setListItems(prev => (
          prev.filter((item) => item.key !== key)
      ))
  }

  const renderItem = (item) => {
    const movie = item.item.movie;
    const tv = item.item.tv;
    const posterPath = movie ? movie.posterPath : tv ? tv.posterPath : item.item.poster_path;


      return (
        <View className=' justify-start items-center relative '
          style={{ width:'auto', height:100,  marginHorizontal:0, marginVertical:0, overflow:'hidden' }}
          key={item.key}  // Set key here based on the item key
        >
         <Image 
          source={  {uri:`${posterURL}${posterPath}`} }
          resizeMode='cover'
          style={{ width:50, height:80, borderRadius:10, overflow:'hidden' }}
          />
          <TouchableOpacity className='rounded-full' onPress={() => handleRemoveListItem(item.key)}  style={{ backgroundColor:Colors.primary, position:'absolute', top:4, right:1 }}>
              <CloseIcon size={20} color={Colors.mainGray} />
          </TouchableOpacity>
        </View>
      );
    };

  const handleContinue = async () => {
      console.log('clicked')
      // const listItemObj = listItems.map((item) => (  item.item.movie ? item.item.movie : item.item.tv ? item.item.tv : item.item  ))
      const listItemObj = listItems.map((item) => 
        item.item.movie ?? item.item.tv ?? item.item
    );
      console.log('listItemObj', listItemObj)
      // const rotationItems = listItems.map((listItem) => {
      //     return {
      //         userId,
      //         ...(listItem.item.media_type === 'movie' ? { movieTMDBId: listItem.item.id } : listItem.item.media_type === 'tv' ? { tvTMDBId: listItem.item.id } : listItem.item.movieTMDBId ? { movieTMDBId : listItem.item.movieTMDBId  } : {tvTMDBId : listItem.item.tvTMDBId})
      //     };
      // })
      const rotationItems = listItems.map((listItem) => {
        const { item } = listItem; // Extract item for easier access
        let rotationObj = { userId }; // Start with userId
        
        if (item.media_type === 'movie') {
            rotationObj.movieTMDBId = item.id;
        } else if (item.media_type === 'tv') {
            rotationObj.tvTMDBId = item.id;
        } else if (item.movieTMDBId) {
            rotationObj.movieTMDBId = item.movieTMDBId;
        } else if (item.tvTMDBId) {
            rotationObj.tvTMDBId = item.tvTMDBId;
        }

        return rotationObj;
    });
      console.log('rotationItems', rotationItems)
      try {
          // const params = {
          //     id : userId,
          //     clerkId : user.id,
          //     bio,
          //     bioLink,
          //     profilePic : image,
          // }
          // const response = await updateUser(params,user.emailAddresses[0].emailAddress )
          const rotationResponse = await updateRotation( userId, rotationItems, listItemObj )
          console.log('rotationResposne', rotationResponse)
          refetch();
          router.back()
          // updateUserDB(response)
          console.log('complete')
          
      } catch (err) {
          console.log(err)
      } finally {
          console.log('finally')
          // router.replace('/')
      }

  }


return (
  <SafeAreaView className='w-full h-full   bg-primary' style ={{height:'100%', height:'100%' , justifyContent:'center', alignItems:'center'}}>
     <KeyboardAvoidingView
    style={{ flex: 1, width:'100%', height:'100%' }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
  <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} style={{width:'100%', height:'100%', backgroundColor:Colors.primary}}>
    <View  style={{ justifyContent:'center', alignItems:'center', height:'100%', height:'100%', paddingTop:0,  backgroundColor:Colors.primary, gap:15 , paddingHorizontal:30}} >

     

    { resultsOpen ? (
      <View className='w-full h-full' style={{ paddingTop:40, paddingHorizontal:5, borderRadius:20, backgroundColor:Colors.primary }} >
          <View className='thread-topic w-full  relative   '>
              <View className="flex-row justify-center items-center gap-3 px-4">
                  <TouchableOpacity onPress={()=> setResultsOpen(false)}>
                      <BackIcon size={20} color={Colors.mainGray}/>
                  </TouchableOpacity>
                  <TextInput
                      autoFocus={true}
                      autoCorrect={false}
                      placeholder='Search for a movie/show'
                      placeholderTextColor={Colors.mainGray}
                      onChangeText={(text)=>handleChange(text)}
                      className='w-full bg-white rounded-3xl text-lg font-pbold'
                      style={{ height:50, paddingHorizontal:25, paddingBottom:0 }}
                      value={searchQuery}
                  />
              </View>
              <TouchableOpacity onPress={()=> { setSearchQuery('') ; setResults([]); }}  style={{ position:'absolute', right:5, top:15 }}>
                  <CloseIcon color={Colors.mainGray} size={24} className=' ' />
              </TouchableOpacity>
          </View>

              { searchQuery === '' ? (
              <ScrollView className='pt-10 w-full h-full'  >
                      <DraggableGrid
                      numColumns={5}
                      renderItem={renderItem}
                      data={listItems}
                      itemHeight={170}
                      onDragRelease={(data) => {
                         setListItems(data);// need reset the props data sort after drag release
                      }}
                      />
                  </ScrollView>
                  
              ) : (

                  <View className='' >
                  <FlatList
                  data={results}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle = {{width:'auto', zIndex:40}}
                  renderItem={({item}) =>  {
                      // console.log(item.title || item.name)
                      return (
                      <>
                          <View className=''>
                              <TouchableOpacity onPress={()=>handleSearchPress(item)} className='w-full gap-5 flex-row my-3 justify-start items-center'
                                      disabled={ listItems.some( element =>  element.item?.movieTMDBId === item.id || element.item?.tvTMDBId === item.id  ) ? true : false}
                                      style={{ opacity: listItems.some( element =>  element.item?.movieTMDBId === item.id || element.item?.tvTMDBId === item.id  )  ? 0.5 : 1    }}
                                       
                                  >
                                  <Image 
                                  source={ item.media_type === 'person' ? {uri:`${posterURL}${item.profile_path}`}  : {uri:`${posterURL}${item.poster_path}`}}
                                  resizeMode='cover'
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
                      </>
                  )}

              }
              >
              </FlatList>
              </View>

              )}
              </View>

      ) : (
      <ScrollView  className='bg-primary' style={{ width:'100%', height:'100%', paddingTop:70 }}>

      <View className='w-full h-full justify-center items-center gap-5 '>
        <Text className='text-white font-pbold text-2xl  text-center'>Current Rotation.</Text>
        <Text className='text-mainGray px-2  '>Pick 5 titles to be displayed on your profile you want to highlight. These can be titles you've seen recently, currently watching, or anticipating.</Text>
        <View className='items-center justify-center w-full gap-5'>

       
          <View className='thread-topic w-full relative my-5 '>
              <TextInput
                  placeholder='Search for a movie/show'
                  placeholderTextColor={Colors.mainGray}
                  multiline
                  autoCorrect={false}
                  onChangeText={(text)=> { setSearchQuery(text);  handleSearch(text)  }}
                  className='w-full text-white rounded-3xl text-lg font-pbold'
                  style={{ minHeight:50, backgroundColor:Colors.mainGrayDark, paddingHorizontal:25, paddingTop:10, textAlignVertical:'center' }}
                  value={searchQuery}
                  onFocus={()=>setResultsOpen(true)}
              />
              <TouchableOpacity onPress={()=> { setSearchQuery('') ; setResults([]); setResultsOpen(false)}}  style={{ position:'absolute', right:20, top:15 }}>
                  <CloseIcon color={Colors.mainGray} size={24} className=' ' />
              </TouchableOpacity>
          </View>

          <View className='w-full'>
              <DraggableGrid
                  numColumns={5}
                  renderItem={renderItem}
                  data={listItems}
                  itemHeight={100}
                  onDragRelease={(data) => {
                      setListItems(data);// need reset the props data sort after drag release
                  }}
              />

          </View>
         
          <TouchableOpacity onPress={handleContinue}  style={{ borderRadius:10, paddingHorizontal:15, paddingVertical:5, backgroundColor:Colors.secondary, width:100 }}  >
            <Text className='text-primary text-lg font-pbold text-center'>Save</Text>
          </TouchableOpacity>
          </View>
      </View>

      </ScrollView>
      )}


          </View>
  </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </SafeAreaView>
)
}

export default editRotation

const styles = StyleSheet.create({})