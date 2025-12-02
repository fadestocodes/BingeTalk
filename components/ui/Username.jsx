import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { badgeIconMap } from '../../constants/BadgeIcons'
import { Colors } from '../../constants/Colors'

const Username = ({user, size='md' , color='white', onPress=null, bold=false, reverse=false}) => {
    const [displayBadgeIcon, setDisplayBadgeIcon] = useState('')

    const dimensions = {
        sm : {
            width: 25,
            height : 30
        },
        md : {
            width: 30,
            height : 35
        },
        lg : {
            width: 40,
            height : 45
        },
    }

    useEffect(() => {
        let displayBadge = ''
        let uri = ''
        if (user?.displayBadge){
          displayBadge = badgeIconMap.find( i => i.type === user.displayBadge.badgeType)
          uri = displayBadge.levels[user.displayBadge.badgeLevel].uri
        } else if (user?.unlockedBadges?.length > 0){
            displayBadge = badgeIconMap.find( i => i.type === user.unlockedBadges[0].badgeType)
            uri = displayBadge.levels[user.unlockedBadges[0].badgeLevel].uri
        }
        if (uri){
            setDisplayBadgeIcon(uri)
        }
    },[user])

    if (!user){
        return <ActivityIndicator/>
    }

  return (
    <View  className='flex flex-row justify-start items-center  gap-2'>
        { reverse ? (
            <>
            <Text style={{color:color}} className={ `${bold && 'font-bold'} text-lg  `}>@{user.username}</Text>
            { displayBadgeIcon && (
                <Image
                    source={displayBadgeIcon}
                    width={dimensions[size].width}
                    height={dimensions[size].height}
                    contentFit='contain'
                    style={{ overflow:'hidden'}}
                />
            ) }
            </>

        ) : (
            <>
        { displayBadgeIcon && (
            <Image
                source={displayBadgeIcon}
                width={dimensions[size].width}
                height={dimensions[size].height}
                contentFit='contain'
                style={{ overflow:'hidden'}}
            />
        ) }
        <Text style={{color:color}} className={ `${bold && 'font-bold'} text-lg  `}>@{user.username}</Text>
        </>

        ) }

    </View>
  )
}

export default Username

const styles = StyleSheet.create({})