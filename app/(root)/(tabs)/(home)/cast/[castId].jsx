// import {  ScrollView, Text, TouchableOpacity, View, Image } from 'react-native'
// import React, {useState, useEffect} from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
// import { BackIcon, DownIcon } from '../../../../../assets/icons/icons'
// import { Colors } from '../../../../../constants/Colors'
// import { getPerson } from '../../../../../lib/TMDB'
// import { useTMDB } from '../../../../../lib/useTMDB'
// import { LinearGradient } from 'expo-linear-gradient'
// import DiscussionThread from '../../../../../components/DiscussionThread'
// import CastCrewHorizontal from '../../../../../components/CastCrewHorizontal'
// import { capitalize } from '../../../../../lib/capitalize'

// const CastIdPage = () => {

//     const params = useLocalSearchParams();
//     const castId = params.castId;
//     const router = useRouter();
//     const posterURL = 'https://image.tmdb.org/t/p/original';
//     const [dropdownMenu, setDropdownMenu] = useState(false);
//     const [creditOptions, setCreditOptions] = useState([])
//     const [whichCredits, setWhichCredits] = useState('')
//     const [readMore, setReadMore] = useState(false);


//     const {data:personData, loading, refetch} = useTMDB(()=>getPerson(castId));
//     // console.log('person data ', personData.combined_credits)
//     // console.log('person data ', typeof(personData.combined_credits))
//     // console.log('person data ', personData.combined_credits)
//     // if (personData.combined_credits) {
//     //     const dropdownOptions = Object.keys(personData.combined_credits).filter(key => key === 'cast' || key === 'crew');
//     //     console.log('dropdown optinos', dropdownOptions)
//     //     // setCreditOptions(dropdownOptions);
//     //     // setWhichCredits(dropdownOptions[0])

//     // }
//     useEffect(() => {
//         if (personData.combined_credits) {
//           const dropdownOptions = Object.keys(personData.combined_credits)
//           .filter(key => {
//             const credits = personData.combined_credits[key];
//             return (key === 'cast' && credits.length > 0) || (key === 'crew' && credits.length > 0)});
    
//           console.log('Dropdown options:', dropdownOptions);
//           setCreditOptions(dropdownOptions);
    
//           // Safely set the initial value for whichCredits
//           if (dropdownOptions.length > 0) {
//             setWhichCredits(dropdownOptions[0]);
//           }
//         }
//       }, [personData.combined_credits]); 

//     // if (personData?.combined_credits && typeof personData.combined_credits === 'object') {
//     //     const keys = Object.keys(personData.combined_credits).filter(
//     //       (key) => key === 'cast' || key === 'crew'
//     //     );
//     //     console.log(keys); // Output: ['cast', 'crew']
//     //   } else {
//     //     console.error('combined_credits is undefined or invalid:', personData.combined_credits);
//     //   }



//     const backPress = () => {
//         console.log('pressed')
//         router.back()
//     }
    
    
//     const castPress = (item) => {
//         if (item.poster_path){  
//             router.push(`/movie/${item.id}`)
//         } else {
//             router.push(`/cast/${item.id}`)
//         }
//     }


//     const threadsPress = (item) => {
//         router.push(`/threads/${item.id}`)
//     }


//   return (
//     <SafeAreaView className='h-full pb-24 bg-primary'>
//     <ScrollView className=' h-full  flex  ' style={{backgroundColor:Colors.primary}}>
//       <TouchableOpacity className='border-white rounded-md w-16 flex items-center left-2 py-1 absolute   ' style={{}}   onPress={backPress}>
//                       <BackIcon className='' color={Colors.third}  size='22'/>
//       </TouchableOpacity>
//       <View className='gap-8 w-full px-8'>
//         <View className='image-and-name items-center justify-center gap-5  w-full pt-20 '>
//           <View className="px-8 flex-row items-center w-full justify-center">
//             <Image className=''
//               source={{uri:`${posterURL}${personData.profile_path}`}}
//                style={{ width:100, height: 180, overflow:'hidden', borderRadius:10}}
//                 resizeMode='cover'
//               />
//             <View className='name-bio items-start gap-0  text-wrap flex-wrap px-8 max-w-64  '>
//               <Text className=' text-3xl text-secondary font-pbold'>{personData.name}</Text>
//               <Text className=' text-sm text-mainGray font-medium '>{personData.birthday}</Text>
//               <Text className=' text-sm text-mainGray font-medium '>{personData.place_of_birth}</Text>
//               <Text className=' text-sm text-mainGray font-medium '>Known for: {personData.known_for_department}</Text>
//             </View>
//           </View>
//         </View>
//         <View className="buttons flex gap-4 w-full items-center ">
                   
//                     <TouchableOpacity>
//                         <View className='border-2 rounded-xl border-secondary bg-secondary p-2 w-96 items-center'>
//                             <Text className='text-primary font-pbold text-sm'>Add to Watchlist</Text>
//                         </View>
//                     </TouchableOpacity>
//                     <TouchableOpacity>
//                         <View className='border-2 rounded-xl border-secondary bg-secondary p-2 w-96 items-center'>
//                             <Text className='text-primary font-pbold text-sm'>Recommend to friend</Text>
//                         </View>
//                     </TouchableOpacity>
//                     <TouchableOpacity>
//                         <View className='border-2 rounded-xl border-secondary bg-secondary p-2 w-96 items-center'>
//                             <Text className='text-primary font-pbold text-sm'>Rate</Text>
//                         </View>
//                     </TouchableOpacity>
//         </View>
//           <View>
//             <View className="bio relative gap-8 w-full" style={{  height:readMore ? 'auto' : 65 }}>
//               <Text className=' text-sm text-mainGray w-full  ' numberOfLines={!readMore && 3} >{personData.biography} </Text>
//               <LinearGradient className=''
//                   colors={[`${Colors.primary}00`, `${Colors.primary}FF`]}
//                   style={{height : readMore ? 'auto' :65, width:'100%', position:'absolute', top:0 }}>
//                 </LinearGradient>
//                 <View className="w-full px-20">
                  
//                   <TouchableOpacity onPress={()=>setReadMore(prev => !prev)} className='w-full  items-center rounded-lg' style={{  paddingVertical:5, paddingHorizontal:10, borderWidth:2, borderColor:Colors.mainGray }}>
//                       <Text className='text-mainGray'>{ readMore ? 'Collapse' : 'Read more'}</Text>
//                   </TouchableOpacity>
//                 </View>
//           </View>
//           <View className='ratings  flex pt-20 gap-6 ' style={{marginTop:20, marginBottom:20}}>
//             <View className='ratings flex-row justify-center items-center flex-wrap gap-8'>
//                 <View className='gap-0 items-center'>
//                     <Text className='text-mainGray text-sm font-psemibold'>Your rating</Text>
//                     <Text className='text-mainGray text-2xl font-pbold'>N/A</Text>
//                 </View>
//                 <View className='gap-0'>
//                     <Text className='text-mainGray text-sm font-psemibold'>From your network</Text>
//                     <View className='flex-row items-center gap-2 justify-center'>
//                         <Text className='text-mainGray text-2xl font-pbold'>8.1</Text>
//                         <Text className='text-mainGray text-xs font-pbold'>(avg)</Text>
//                     </View>
//                 </View>
//                 <View className='gap-0'>
//                     <Text className='text-mainGray text-sm font-psemibold'>From others</Text>
//                     <View className='flex-row items-center gap-2 justify-center'>
//                         <Text className='text-mainGray text-2xl font-pbold'>7.3</Text>
//                         <Text className='text-mainGray text-xs font-pbold'>(avg)</Text>
//                     </View>
//                 </View>
//             </View>
//           </View>
//           <View>
//           <View className='dropdown-menu relative flex gap-5 w-auto mt-6'>
//             <View className='flex-row gap-2 justify-start items-center'>

//                     <Text className='text-mainGray font-psemibold '>Credits as:  </Text>
//                 <TouchableOpacity onPress={()=>setDropdownMenu(prevData => !prevData)} className='justify-start items-center' style={{borderRadius:10, borderWidth:2, backgroundColor:Colors.mainGray, borderColor:Colors.mainGray, paddingHorizontal:5, paddingVertical:2, flexDirection:'row', gap:5, alignSelf:'flex-start'}}>
//                     <Text className='text-primary font-psemibold '>{capitalize(whichCredits)}</Text>
//                     <DownIcon color={Colors.primary} size={15}></DownIcon>
//                 </TouchableOpacity>
//             </View>


//              { dropdownMenu && (
//                     <>
//                     <View style={{marginBottom:30, borderWidth:2, borderColor:Colors.mainGray, paddingHorizontal:10, paddingVertical:20, justifyContent:'center', alignItems:'', gap:10, borderRadius:10}}>
//                     {creditOptions.map((item,index) => (
//                         <View key={index} style={{ display:'flex', justifyContent:'center',  marginTop:0, marginBottom:0}}>
//                             <TouchableOpacity style={{ width:'auto' }} onPress={()=>{setWhichCredits(item);setDropdownMenu(false)}}>
//                                 <Text className='text-mainGray items-center justify-center' style={{width:300}}>
//                                     {capitalize(item)}
//                                 </Text>
//                             </TouchableOpacity>
//                                 <View style={{ borderTopWidth:1, marginTop:10, borderColor:Colors.mainGray, width:'320',  }}/>
//                         </View>

//                     )) }
//                     </View>
//                     </>
//                 )  }
//                 { whichCredits === 'cast' && (
//                     <CastCrewHorizontal  param={ personData?.combined_credits.cast} handlePress={castPress}/>
//                 ) }
//                 { whichCredits === 'crew' && (
//                     <CastCrewHorizontal  param={ personData?.combined_credits.crew } handlePress={castPress} />
//                 ) }
//           </View>
//           </View>
//             <View className='w-full border-t-[.5px] border-mainGray items-center self-center shadow-md shadow-black-200' style={{borderColor:Colors.mainGray, marginVertical:10}}/>
//             <DiscussionThread handlePress={threadsPress}></DiscussionThread>
//           </View>
//       </View>
//     </ScrollView>
//     </SafeAreaView>
//   )
// }

// export default CastIdPage


// CastIdPage.options = {
//     headerShown: false,  // Optional: Hide header if not needed
//   };

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CastIdPage from '../../../../../components/Screens/CastCrewPage'

const castId= () => {
  return (
    <CastIdPage></CastIdPage>
  )
}

export default castId
const styles = StyleSheet.create({})