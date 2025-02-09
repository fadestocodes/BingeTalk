import { Tabs } from 'expo-router';
import React from 'react';
import {  Text, Image, View, Pressable } from 'react-native';
import { HomeIcon, SearchIcon, MedalIcon, UserIcon, RoomIcon, PlusIcon } from '../../../assets/icons/icons'
import {Colors} from '@/constants/Colors'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigationState } from '@react-navigation/native';

import {Stack} from 'expo-router'


import { HapticTab } from '@/components/HapticTab';


const TabIcon = ({icon, color, name, focused, className, isCreate, style}) => {
  return (
    <View className={`flex items-center justify-center  w-28 h-28 ${className} `} style={{
      ...(isCreate && { width: 78, height: 78, backgroundColor: focused ? 'black' : 'black' }), // Adjust for isCreate if needed
      ...style, // Merge custom styles
    }}>
      {React.createElement(icon, { color: color, size: isCreate ? 32 : 28 })} 
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

        tabBarActiveTintColor : Colors.secondary,
        tabBarInactiveTintColor: Colors.lightBlack,
        tabBarShowLabel : false,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor : 'black',
          borderRadius: 50,
          borderTopColor : 'black',
          // paddingBottom: 30,
          // overflow: "hidden",
          marginHorizontal: 10,
          marginBottom: 30,
          marginTop : 0,
          height: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
        },
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          headerShown : false,
          tabBarIcon : ({color, focused}) => (
           
            <TabIcon
              icon={HomeIcon}
              color = {color}
              name = 'Home'
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
              name = 'Search'
              focused={ focused}
            />
          )
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          headerShown : false,
          tabBarIcon : ({color, focused, className}) => (
            <TabIcon
              icon={PlusIcon}
              color = {color}
              name = 'Create'
              focused={ focused}
              isCreate = {true}
              style={{ shadowColor: Colors.mainGray, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 5 }, shadowRadius: 5}}
              className={` rounded-full   mb-8 ${focused ? `` : ``}`}
            />
          )
        }}
      />
      <Tabs.Screen
        name="badges"
        options={{
          title: 'Rooms',
          headerShown : false,
          tabBarIcon : ({color, focused}) => (
            <TabIcon
              icon={RoomIcon}
              color = {color}
              name = 'Rooms'
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
              icon={UserIcon}
              color = {color}
              name = 'Profile'
              focused={ focused}
            />
          )
        }}
      />
      <Tabs.Screen
        name="(castOrCrew)"
        options={{
          title : 'CastDetails',
          href : null,
          headerShown : false,
      
        }}
      />
     
       
    </Tabs>
     </>
  );
}
