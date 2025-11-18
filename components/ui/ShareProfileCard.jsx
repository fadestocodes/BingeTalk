// ShareProfileCard.js
import React, { forwardRef, useCallback } from 'react';
import { View, Text,Image, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
// import { Image } from 'expo-image';
import SetDaysGraph from '../SetDaysGraph';
import { Colors } from '../../constants/Colors';
import ViewShot from 'react-native-view-shot';
import { avatarFallbackCustom, moviePosterFallback } from '../../constants/Images';
import { Link, MapPin } from 'lucide-react-native';
import { unparseDept } from '../../lib/parseFilmDept';
import { LinearGradient } from 'expo-linear-gradient';

const ShareProfileCard = forwardRef(({ user, setDaysData, totalWorked=0 ,loading,refetch}, ref) => {
    const posterURLlow = 'https://image.tmdb.org/t/p/w500';


    const onCapture = useCallback(uri => {
      }, []);

    const onImageLoad = useCallback(() => {
        ref.current.capture().then(uri => {
        })
      }, []);

    if (!user) return <ActivityIndicator />

  return (
    <ViewShot
    onCapture={onCapture}
      ref={ref}
      style={styles.container}
    >
        <View className='flex flex-col justify-start items-center gap-3'>
            <Image
                onLoad={onImageLoad}
                source={{ uri: user.profilePic  || avatarFallbackCustom}}
                style={styles.avatar}
                width={100}
                height={100}
            />

        </View>
        <View style={{flexDirection:'row', gap:10, justifyContent:'center', alignItems:'flex-end'}} >
            <Text style={styles.name}>{user.firstName} {user.lastName || ''}</Text>
            { user?.accountType === 'FILMMAKER' && user?.filmRole?.role ? (
                <Text style={{ alignSelf: 'baseline', lineHeight: 10 ,fontSize:10, color:Colors.mainGray, fontWeight:'bold'}}
                >{unparseDept(user.filmRole.role)}</Text>
            ): user?.accountType === 'FILMLOVER' && (
                <Text style={{ alignSelf: 'baseline', lineHeight: 10 ,fontSize:10, color:Colors.mainGray, fontWeight:'bold'}}
                >Film Lover</Text>
            )}
        </View>
      <Text style={styles.username}>@{user.username}</Text>
      { user?.bio && (
          <Text style={styles.bio}>{user.bio}</Text>
      ) }
      <View className='flex flex-col items-start justify-center gap-3 pt-3 '>
        {/* { (user?.city || user?.country) && (
            <View className='flex flex-row gap-2'>
                <MapPin  size={16} color={Colors.newLightGray} />
                <Text className='text-mainGray text-md'>{user?.city ? `${user.city}, ${user.country}` : user?.country && user.country}</Text>
            </View>
        ) }
        { user?.bioLink && (
        <View onPress={()=>handleLinkPress(user.bioLink)} className='flex flex-row gap-2'>
            <Link size={16} color={Colors.newLightGray}/>
            <Text className='text-mainGray text-md'>{user.bioLink}</Text>
        </View>
        )} */}
        <View className='flex flex-row gap-2 justify-center items-center pb-4'>
            <View onPress={()=>handleFollowersList('Followers')} className='flex flex-row gap-2 justify-center items-center'>
                <Text className='text-mainGray text-md font-bold'>{ user.followers.length }</Text>
                <Text className='text-mainGray text-md font-bold'>{ user.followers.length > 0 ? 'Follower' :  'Followers'}</Text>
            </View>
            <View onPress={()=>handleFollowersList('Following')} className='flex flex-row gap-2 justify-center items-center'>
                <Text className='text-mainGray text-md font-bold'>{ user.following.length }</Text>
                <Text className='text-mainGray text-md font-bold'>{ 'Following'}</Text>
            </View>
        </View>
    </View>
            {setDaysData?.totalWorked > 0 &&  (
            <View style={{ height:'auto', width:'100%', paddingBottom:20}}>
                <View  className='flex flex-row gap-1 self-start items-center'>
                        <Text className='text-mainGray font-bold text-xl '>SetDays</Text>
                    <Text className='text-mainGrayDark  text-sm  pt-1'>({totalWorked} days worked in the last 365 days)</Text>
                </View>

                <SetDaysGraph data={setDaysData.graphData} loading={loading} refetch={refetch} forceFullRender={true} />
            </View>
            )}

            {user?.userWatchedItems?.length > 0 && (
                    <View style={{width:'100%', height:130}}>
                        <View style={{gap:10}}>
                            <View >
                                <Text className='text-mainGray font-bold text-xl '>Recently Watched</Text>
                            </View>
                            <FlatList
                                data={user.userWatchedItems}
                                horizontal
                                key={(item,index) => `${item.title}-${index}`}
                                contentContainerStyle={{gap:10}}
                                renderItem={({item}) => {
                                    return (
                                    <View  style={{ marginRight:10 }}>
                                        <Image
                                            source={{uri: item.movie ? `${posterURLlow}${item?.movie?.posterPath}` : item.tv ? `${posterURLlow}${item.tv.posterPath}` : moviePosterFallback }}
                                            placeholder={moviePosterFallback}
                                            contentFit='cover'
                                            style={{ width:45, height:65, borderRadius:10, overflow:'hidden' }}
                                        />
                                    </View>
                                
                                )}}
                               
                            />
                        </View>
                        </View>
            )}
            <View className='justify-center items-center w-full '>
                {/* <Image 
                    source={require('../../assets/images/favicon.png')}
                    style={{width:50, height:50}}
                    contentFit='cover'
                /> */}
                 {/* <LinearGradient
                    colors={['#454242', '#171717']}
                    style={{
                    width: 75,
                    height: 75,
                    borderRadius: 37.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                    }}
                > */}
              
          {/* </LinearGradient> */}
           
          {/* <View className="justify-center items-end w-full flex flex-row gap-1  flex-wrap">

            <Text style={{ fontFamily: 'Bebas-Neue', color: 'white', fontSize: 9, lineHeight: 9, alignSelf:'baseline' }}>
                profile page for
            </Text>
            <Text style={{ fontFamily: 'Bebas-Neue', color: 'white', fontSize: 14, lineHeight: 14, alignSelf:'baseline' }}>
            {user.firstName}{user?.lastName && ` ${user.lastName}`}
            </Text>
            <Text style={{ fontFamily: 'Bebas-Neue', color: 'white', fontSize: 9, lineHeight: 9, alignSelf:'baseline' }}>
                a new app experience by
            </Text>
            <Text style={{ fontFamily: 'Bebas-Neue', color: 'white', fontSize: 14, lineHeight: 14, alignSelf:'baseline' }}>
                The Bingeable Team
            </Text>
            <Text style={{ fontFamily: 'Bebas-Neue', color: 'white', fontSize: 9, lineHeight: 9, alignSelf:'baseline' }}>
                made for
            </Text>
            <Text style={{ fontFamily: 'Bebas-Neue', color: 'white', fontSize: 14, lineHeight: 14, alignSelf:'baseline' }}>
                Film Lovers
            </Text>
            <Text style={{ fontFamily: 'Bebas-Neue', color: 'white', fontSize: 9, lineHeight: 9, alignSelf:'baseline' }}>
                and
            </Text>
            <Text style={{ fontFamily: 'Bebas-Neue', color: 'white', fontSize: 14, lineHeight: 14, alignSelf:'baseline' }}>
                Filmmakers
            </Text>
            <Text style={{ fontFamily: 'Bebas-Neue', color: 'white', fontSize: 9, lineHeight: 9, alignSelf:'baseline' }}>
                powered by
            </Text>
            <Text style={{ fontFamily: 'Bebas-Neue', color: 'white', fontSize: 14, lineHeight: 14, alignSelf:'baseline' }}>
                The movie database
            </Text>
            <Text style={{ fontFamily: 'Bebas-Neue', color: 'white', fontSize: 9, lineHeight: 9, alignSelf:'baseline' }}>
                visit us at 
            </Text>
            <Text style={{ fontFamily: 'Bebas-Neue', color: 'white', fontSize: 14, lineHeight: 20, alignSelf:'baseline' }}>
                www.bingeable.app
            </Text>
            </View>
            <View className='w-full justify-center items-center flex flex-row gap-3 px-4'>
                <Image 
                    source={require('../../assets/images/icon-adaptive.png')}
                    style={{width:35, height:35, tintColor:Colors.newDarkGray}}
                    contentFit='cover'
                />
                
                </View> */}
            <View className='justify-center items-center flex flex-col '>
                <Text className='text-newDarkGray font-pmedium text-sm'>Follow me on</Text>
                <Image 
                    source={require('../../assets/images/bingeable-text-black.png')}
                    style={{tintColor:Colors.newDarkGray, width:120, height:20, objectFit:'cover' }}
                />
                <Image 
                    source={require('../../assets/images/icon-adaptive.png')}
                    style={{width:35, height:35, tintColor:Colors.newDarkGray, marginTop:10}}
                    contentFit='cover'
                />
            </View>
            </View>
    </ViewShot>
  );
});

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'column',
    padding: 24,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    justifyContent:'center',
    alignItems: 'flex-start',
  },
  avatar: {  borderRadius: 50, marginBottom: 12, width:100, height:100 },
  name: { fontSize: 20, fontWeight: 'bold', color: Colors.secondary, alignSelf:'baseline' },
  username: { fontSize: 14, color: 'white', marginBottom: 12, fontWeight:'bold' },
  bio: { fontSize: 12, color: Colors.mainGray, marginBottom: 8, textAlign: 'left' , fontFamily:'Courier'},
});

export default ShareProfileCard;
