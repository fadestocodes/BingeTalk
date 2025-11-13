// import { Tabs } from 'expo-router';
// import React from 'react';
// import {  Text, Image, View, Pressable } from 'react-native';
// import { HomeIcon, SearchIcon, MedalIcon, UserIcon, RoomIcon, PlusIcon, LayersIcon } from '../../../assets/icons/icons'
// import {Colors} from '@/constants/Colors'
// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
// import { useNavigationState } from '@react-navigation/native';
// import {House, BadgePlus, Handshake, User} from 'lucide-react-native'

// import {Stack} from 'expo-router'


// import { HapticTab } from '@/components/HapticTab';
// import { useGetUser, useGetUserFull } from '@/api/auth';
// import { useGetPendingRecNotifCount, useGetRecommendationsReceived } from '@/api/user';
// import { useNotificationCountContext } from '@/lib/NotificationCountContext';




// const TabIcon = ({icon, color, name, focused, className, isCreate, style}) => {
//   return (
//     <View className={`flex items-center justify-center bg-[#0e1010]  ${className} `} style={{
//     }}>
//       {React.createElement(icon, { color: color, size:  34 })} 
//       <Text
//         className={`${focused ? "font-psemibold" : "font-pregular" } text-xs `}
//         style = {{ color:color }}
//       >
//         {name}
//       </Text>
//     </View>
//   )
// }

// export default function TabLayout() {
  
//   const {user} = useGetUser()
//   const {user:userFull} = useGetUserFull(user?.id)
//   useGetPendingRecNotifCount(user?.id)
//   const { pendingRecsNotifCount } = useNotificationCountContext(); // subscribe here


//   const DynamicRecIcon = ({ color, focused }) => {
  
//     return (
//       <View className="flex items-center justify-center relative">
//         <Handshake color={color} size={34} />
//         <Text
//           className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
//           style={{ color }}
//         >
//         </Text>
  
//         {pendingRecsNotifCount > 0 && (
//           <View className="absolute w-[25px] h-[25px] rounded-full bg-secondary -top-4 -right-4 justify-center items-center">
//             <Text className="text-primary font-semibold text-xs">
//               {pendingRecsNotifCount > 99 ? '99+' : pendingRecsNotifCount}
//             </Text>
//           </View>
//         )}
//       </View>
//     );
//   };
  

//   return (
//     <>
//     <Tabs 

//       screenOptions={{
//         tabBarActiveTintColor : Colors.newLightGray,
//         tabBarInactiveTintColor: Colors.primaryLight,
//         tabBarShowLabel : false,
//         headerShown: false,
//         tabBarButton: HapticTab,
//         tabBarStyle: {
//           borderTopColor : '#0e1010',
//           backgroundColor:'#0e1010',
//           height:75,
//           paddingTop:10,
//           paddingHorizontal:20,
//           marginTop : 0,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           flexDirection: "row",
//           position:'relative'
//         },
//       }}>
//       <Tabs.Screen
//         name="(home)"
//         options={{
//           title: 'Home',
//           headerShown : false,
//           tabBarIcon : ({color, focused}) => (
//             <TabIcon
//               icon={House}
//               color = {color}
//               focused={ focused}
//             />
//           )
//         }}
//       />
//       <Tabs.Screen
//         name="(search)"
//         options={{
//           title: 'Search',
//           headerShown : false,
//           tabBarIcon : ({color, focused}) => (
//             <TabIcon
//               icon={SearchIcon}
//               color = {color}
//               focused={ focused}
//             />
//           )
//         }}
//       />
//       <Tabs.Screen
//         name="(create)"
//         options={{
//           title: 'Create',
//           headerShown : false,
//           tabBarIcon : ({color, focused, className}) => (
//             <TabIcon
//               icon={BadgePlus}
//               color = {color}
//               focused={ focused}
//               isCreate = {true}
//             />
//           )
//         }}
//       />
//       <Tabs.Screen
//         name="(recs)"
//         options={{
//           title : 'Recs',
//           headerShown : false,
//           tabBarIcon: ({ color, focused }) => <DynamicRecIcon color={color} focused={focused} />,

//         }}
//       />

//       <Tabs.Screen
//         name="(profile)"
        
//         options={{
//           title: 'Profile',
//           headerShown : false,
//           tabBarIcon : ({color, focused}) => (
//             <TabIcon
//               icon={User}
//               color = {color}
//               focused={ focused}
//             />
//           )
//         }}
//       />
//     </Tabs>
//      </>
//   );
// }

import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { House, BadgePlus, Handshake, User } from 'lucide-react-native';
import { SearchIcon } from 'lucide-react-native';
import { useNotificationCountContext } from '@/lib/NotificationCountContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BAR_WIDTH = 30;
const TAB_COUNT = 5;
const TAB_LIST_PADDING_HORIZONTAL = 15;
const TAB_WIDTH = (SCREEN_WIDTH - TAB_LIST_PADDING_HORIZONTAL * 2) / TAB_COUNT;

const ACTIVE_COLOR = '#9CA3AF';   // newLightGray
const INACTIVE_COLOR = '#1f2223'; // primaryLight

export default function TabLayout() {
  const { pendingRecsNotifCount } = useNotificationCountContext();
  const [activeTab, setActiveTab] = useState(0);
  const activeIndex = useSharedValue(0);

  useEffect(() => {
    activeIndex.value = activeTab;
  }, [activeTab]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(
          TAB_LIST_PADDING_HORIZONTAL + activeIndex.value * TAB_WIDTH + (TAB_WIDTH - BAR_WIDTH) / 2,
          { duration: 100 }
        ),
      },
    ],
  }));

  const icons = [House, SearchIcon, BadgePlus, Handshake, User];
  const labels = ['Home', 'Search', 'Create', 'Recs', 'Profile'];
  const hrefs = ['(home)', '(search)', '(create)', '(recs)', '(profile)'];

  return (
    <Tabs>
      <TabSlot />

      <TabList
        style={{
          flexDirection: 'row',
          height: 80,
          backgroundColor: '#0e1010',
          borderTopColor: '#0e1010',
          paddingHorizontal: TAB_LIST_PADDING_HORIZONTAL,
          paddingTop: 10,
          position: 'relative',
        }}
      >
        {/* Animated bar */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              width: BAR_WIDTH,
              height: 4,
              backgroundColor: '#ffe600',
              borderRadius: 999,
            },
            animatedBarStyle,
          ]}
        />

        {labels.map((label, index) => {
          const Icon = icons[index];
          const isActive = activeTab === index;

          return (
            <TabTrigger
              key={label}
              name={label.toLowerCase()}
              href={`/${hrefs[index]}`}
              onPress={() => setActiveTab(index)}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <View className="relative items-center">
                <Icon color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR} size={34} />

                {label === 'Recs' && pendingRecsNotifCount > 0 && (
                  <View className="absolute w-[22px] h-[22px] rounded-full bg-secondary -top-3 -right-3 justify-center items-center">
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '600',
                        color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
                      }}
                    >
                      {pendingRecsNotifCount > 99 ? '99+' : pendingRecsNotifCount}
                    </Text>
                  </View>
                )}

                <Text
                  style={{
                    color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
                    fontSize: 10,
                    marginTop: 2,
                  }}
                >
                  {label}
                </Text>
              </View>
            </TabTrigger>
          );
        })}
      </TabList>
    </Tabs>
  );
}
