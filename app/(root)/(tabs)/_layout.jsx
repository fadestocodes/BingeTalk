import { Tabs } from 'expo-router';
import React from 'react';
import {  Text, Image, View, Pressable } from 'react-native';
import { HomeIcon, SearchIcon, MedalIcon, UserIcon, RoomIcon, PlusIcon, LayersIcon } from '../../../assets/icons/icons'
import {Colors} from '@/constants/Colors'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigationState } from '@react-navigation/native';
import {House, BadgePlus, Handshake, User} from 'lucide-react-native'

import {Stack} from 'expo-router'


import { HapticTab } from '@/components/HapticTab';


const TabIcon = ({icon, color, name, focused, className, isCreate, style}) => {
  return (
    <View className={`flex items-center justify-center bg-black  ${className} `} style={{
    }}>
      {React.createElement(icon, { color: color, size:  34 })} 
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular" } text-xs `}
        style = {{ color:color }}
      >
        {name}
      </Text>
    </View>
  )
}

export default function TabLayout() {


  return (
    <>
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor : Colors.newLightGray,
        tabBarInactiveTintColor: Colors.primaryLight,
        tabBarShowLabel : false,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopColor : 'black',
          backgroundColor:'black',
          height:75,
          paddingTop:10,
          paddingHorizontal:20,
          marginTop : 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          position:'relative'
        },
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          headerShown : false,
          tabBarIcon : ({color, focused}) => (
            <TabIcon
              icon={House}
              color = {color}
              focused={ focused}
            />
          )
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          title: 'Search',
          headerShown : false,
          tabBarIcon : ({color, focused}) => (
            <TabIcon
              icon={SearchIcon}
              color = {color}
              focused={ focused}
            />
          )
        }}
      />
      <Tabs.Screen
        name="(create)"
        options={{
          title: 'Create',
          headerShown : false,
          tabBarIcon : ({color, focused, className}) => (
            <TabIcon
              icon={BadgePlus}
              color = {color}
              focused={ focused}
              isCreate = {true}
            />
          )
        }}
      />
      <Tabs.Screen
        name="(browse)"
        options={{
          title : 'Browse',
          headerShown : false,
          tabBarIcon : ({color, focused}) => (
            <TabIcon
              icon={Handshake}
              color = {color}
              focused={ focused}
            />
          )
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',
          headerShown : false,
          tabBarIcon : ({color, focused}) => (
            <TabIcon
              icon={User}
              color = {color}
              focused={ focused}
            />
          )
        }}
      />
    </Tabs>
     </>
  );
}



// import { Tabs } from 'expo-router';
// import React, { useRef, useEffect } from 'react';
// import { Text, View, Animated, Dimensions, Pressable } from 'react-native';
// import { HomeIcon, SearchIcon, PlusIcon, LayersIcon, UserIcon } from '../../../assets/icons/icons';
// import { Colors } from '@/constants/Colors';
// import { HapticTab } from '@/components/HapticTab';

// const TABS = [
//   { key: '(home)', icon: HomeIcon, label: 'Home' },
//   { key: '(search)', icon: SearchIcon, label: 'Search' },
//   { key: '(create)', icon: PlusIcon, label: 'Create' },
//   { key: '(browse)', icon: LayersIcon, label: 'Browse' },
//   { key: '(profile)', icon: UserIcon, label: 'Profile' },
// ];

// export default function TabLayout() {
//   const screenWidth = Dimensions.get('window').width;
//   const tabWidth = screenWidth / TABS.length;

//   const barAnim = useRef(new Animated.Value(0)).current;

//   const [activeIndex, setActiveIndex] = React.useState(0);

//   useEffect(() => {
//     Animated.timing(barAnim, {
//       toValue: activeIndex * tabWidth,
//       duration: 250,
//       useNativeDriver: true,
//     }).start();
//   }, [activeIndex]);

//   return (
//     <View style={{ flex: 1, backgroundColor: 'black' }}>
//       {/* Render screens */}
//       <Tabs screenOptions={{ headerShown: false, tabBarButton: HapticTab }}>
//         {TABS.map(tab => (
//           <Tabs.Screen key={tab.key} name={tab.key} />
//         ))}
//       </Tabs>

//       {/* Tab bar overlay */}
//       <View
//         style={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           flexDirection: 'row',
//           height: 70,
//           alignItems: 'center',
//         }}
//       >
//         {/* Animated bar */}
//         <Animated.View
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: tabWidth,
//             height: 4,
//             borderRadius:15,
//             backgroundColor: Colors.secondary,
//             transform: [{ translateX: barAnim }],
//           }}
//         />

//         {TABS.map((tab, index) => {
//           const Icon = tab.icon;
//           const focused = index === activeIndex;
//           return (
//             <Pressable
//               key={tab.key}
//               style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
//               onPress={() => setActiveIndex(index)}
//             >
//               <Icon color={focused ? Colors.secondary : Colors.lightBlack} size={28} />
//               <Text style={{ color: focused ? Colors.secondary : Colors.lightBlack, fontSize: 12 }}>
//                 {tab.label}
//               </Text>
//             </Pressable>
//           );
//         })}
//       </View>
//     </View>
//   );
// }
