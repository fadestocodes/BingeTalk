// import { StyleSheet, Text, View } from 'react-native'
// import React, { useEffect, useRef, useState } from 'react'
// import { useRouter } from 'expo-router'
// import { TouchableOpacity } from 'react-native'
// import PagerView from 'react-native-pager-view';
// import ShowcasePage from '../../../../components/Showcase'
// import ProfileMainPage from '../../../../components/ProfileMainPage'
// import Credits from '../../../../components/Credits'
// import { SignOutButton, useAuth } from '@clerk/clerk-react'
// import { useFetchUser } from '../../../../api/user'



// const ProfileHomepage = () => {
//   const router = useRouter();
//   const [active, setActive] = useState(0);
//   const pagerRef = useRef(null)
//   const posterURL = 'https://image.tmdb.org/t/p/original';


//   const tabs = [
//     {id : 0, label : 'Profile'},
//     {id : 1, label : 'Showcase'},
//     {id : 2, label : 'Lists'},
//     {id : 3, label : 'Credits'}
//   ]

//   const tabsChange = (id) => {
//     setActive(id);
//     pagerRef.current?.setPage(id);
//   }

//   return (
//     <View className='flex flex-1 justify-center items-center w-full h-full bg-primary pb-20 relative' >
     
   
//             <View className='flex-row  bg-darkGray  h-12  absolute top-20 z-10 rounded-xl px-3 gap-4 items-center justify-center  shadow-black  shadow-lg '>
//               { tabs.map((item)=>(
//                 <TouchableOpacity key={item.id} onPress={()=>tabsChange(item.id)} className={`justify-center items-center flex  px-2 rounded-md ${item.id === active ? `border-2 bg-third border-third`: `` }`}>
//                   <Text
//                     className={ `text-center font-pbold rounded-md text-black ${ item.id === active ? `` : `text-gray-400` }` }
//                   >{item.label}</Text>
//                 </TouchableOpacity>
//               )) }
              
              
//             </View>
          
//           <PagerView
//             ref={pagerRef}
//             style={{ flex: 1, width: '100%' }}
//             initialPage={0}
//             onPageSelected={(e) => setActive(e.nativeEvent.position)} 
//             // onPageSelected={(e) => {
//             //   const pageIndex = e.nativeEvent.position;
//             //   setActive(pageIndex); // Update active tab
//             // }}
//           >
//             {/* Tab Content */}
//             <View key="1" className='pb-20' >
              
//                <ProfileMainPage   ></ProfileMainPage> 
//             </View>
//             <View key="2" className='pt-32 items-center w-full' >
//                   <ShowcasePage></ShowcasePage>
//             </View>
//             <View key="3" >
//               <Text className='text-white'>Watched Content</Text>
//             </View>
//             <View key="4" className='pt-20' >
//               <Credits></Credits>
//             </View>
//           </PagerView>

          
//     </View>
//   )
// }

// export default ProfileHomepage


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProfileHomepage from '../../../../components/Screens/UserPage'
import { useLocalSearchParams } from 'expo-router'
import { useFetchOwnerUser } from '../../../../api/user'
import { useUser } from '@clerk/clerk-expo'

const UserIDPage = () => {
  console.log('hello')
  const { user:clerkUser } = useUser();

  const { data:user, refetch: refetchUser, isFetching: isFetchingUser } = useFetchOwnerUser( {email : clerkUser.emailAddresses[0].emailAddress} )


  return (
    <>
      <ProfileHomepage user={user} refetchUser={refetchUser} isFetchingUser={isFetchingUser}  />
    </>
  )
}

export default UserIDPage

const styles = StyleSheet.create({})