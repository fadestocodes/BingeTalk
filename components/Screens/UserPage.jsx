import { StyleSheet, Text, View , ActivityIndicator} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import PagerView from 'react-native-pager-view';
import ShowcasePage from '../Showcase';
import ProfileMainPage from '../ProfileMainPage';
import Credits from '../Credits';
import { SignOutButton, useAuth } from '@clerk/clerk-react'
import { useFetchUser } from '../../api/user';
import UserListsPage from './UserListsPage';


const ProfileHomepage = ( { user, isFetchingUser, refetchUser } ) => {

    // if (!user || isFetchingUser) {
            
    //     refetchUser();

    //     return <View className='bg-primary justify-center items-center h-full'>
    //       <ActivityIndicator></ActivityIndicator>  
    //     </View> 
    // } 
  const router = useRouter();
  const [active, setActive] = useState(0);
  const pagerRef = useRef(null)
  const posterURL = 'https://image.tmdb.org/t/p/original';


  const tabs = [
    {id : 0, label : 'Profile'},
    // {id : 1, label : 'Showcase'},
    {id : 1, label : 'Lists'},
    // {id : 3, label : 'Credits'}
  ]

  const tabsChange = (id) => {
    setActive(id);
    pagerRef.current?.setPage(id);
  }

  return (
    
    <View className='flex flex-1 justify-center items-center w-full h-full bg-primary pb-20 relative' >
      { !user || isFetchingUser ? (
      <View className='bg-primary justify-center items-center h-full'>
        <ActivityIndicator></ActivityIndicator>  
      </View> 
      ) : (
        <>



            <View className='flex-row  bg-primaryLight  h-12  absolute top-20 z-10 rounded-xl px-3 gap-4 items-center justify-center  shadow-black  shadow-lg '>
              { tabs.map((item)=>(
                <TouchableOpacity key={item.id} onPress={()=>tabsChange(item.id)} className={`justify-center items-center flex  px-2 rounded-md ${item.id === active ? `border-2 bg-white border-white`: `` }`}>
                  <Text
                    className={ `text-center font-pbold rounded-md  ${ item.id === active ? `text-primary` : `text-gray-400` }` }
                  >{item.label}</Text>
                </TouchableOpacity>
              )) }
              
              
            </View>
          
          <PagerView
            ref={pagerRef}
            style={{ flex: 1, width: '100%' }}
            initialPage={0}
            onPageSelected={(e) => setActive(e.nativeEvent.position)} 
            // onPageSelected={(e) => {
            //   const pageIndex = e.nativeEvent.position;
            //   setActive(pageIndex); // Update active tab
            // }}
          >
            {/* Tab Content */}
            <View key="1" className='pb-10' >
              
               <ProfileMainPage user={user} isFetchingUser={isFetchingUser} refetchUser={refetchUser}  ></ProfileMainPage> 
            </View>
            {/* <View key="2" className='pt-32 items-center w-full' >
                  <ShowcasePage></ShowcasePage>
            </View> */}
            <View key="2" className='pb-8'>
              <UserListsPage  userId={user.id}></UserListsPage>
            </View>
            {/* <View key="4" className='pt-20' >
              <Credits></Credits>
            </View> */}
          </PagerView>
          </>
      ) }
     
   

          
    </View>
  )
}

export default ProfileHomepage
