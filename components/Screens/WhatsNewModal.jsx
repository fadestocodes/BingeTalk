import { View, Text, Modal, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import React, {useRef,useState} from 'react'
import { Colors } from '../../constants/Colors'
import { Image } from 'expo-image'
import { Clapperboard, PopcornIcon } from 'lucide-react-native';

const { width } = Dimensions.get("window");

const WhatsNewModal = ({handleClose}) => {

  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);

  const pages = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
  ];

  const handleScroll = (e) => {
    if (!pageWidth) return;
    const x = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(x / pageWidth);
    setIndex(newIndex);
  };


  return (
      <Modal  animationType="slide" transparent={false}>
        <View className="flex-1 pt-14 pb-10 p-6 " style={{backgroundColor:Colors.mainGrayDark}}> 
            {/* <ScrollView contentContainerStyle={{  gap:10 }} showsVerticalScrollIndicator={false}>

                    <View className="gap-2 pb-6">
                        <Text className="text-3xl font-bold mb-4 text-white pt-[50px]" >🎉 What’s New in v.2.0.0</Text>
                        <Text className="text-white mb-3  font-medium">• NEW FEATURE: You can now write Reviews! Just rate a title like before, then add a Review to it.</Text>
                        <Text className="text-white mb-3  font-medium">• NEW FEATURE: Submit feedback. Under Profile > Account > Submit your feedback, you can write to us if you have any thoughts on how to improve Bingeable.</Text>
                        <Text className="text-white mb-3  font-medium">• NEW: Browse and watch new movie trailers in the Search tab.</Text>
                        <Text className="text-white mb-3  font-medium">• NEW: Discover users with a distinct taste in the Search tab.</Text>
                        <Text className="text-white mb-3  font-medium">• Improved performance</Text>
                        <Text className="text-white mb-3  font-medium">• UI enhancements and bug fixes</Text>
                    </View>  
                    <View style={{ width: 300, height: 250, overflow: 'hidden', borderRadius:15 }}>
                        <Image
                        source={require('../../assets/images/screenshots/ratingToReview.jpg')}
                        contentFit="cover"
                        style={{
                            width: 300,
                            height: 300, // Taller than the container
                            marginTop: -30, // Push content up inside the box
                        }}
                        />
                    </View>
                    <View style={{ width: 300, height: 400, overflow: 'hidden', borderRadius:15 }}>
                        <Image
                        source={require('../../assets/images/screenshots/reviewPage.jpg')}
                        contentFit="cover"
                        style={{
                            width: 300,
                            height: 500, // Taller than the container
                            marginTop: 0, // Push content up inside the box
                        }}
                        />
                    </View>

            {/* Add as many features as needed */}
            {/* </ScrollView> */} 

            <View
          className="flex-1 w-full pt-4"
          onLayout={(e) => {
            setPageWidth(e.nativeEvent.layout.width);
          }}
        >
          {pageWidth > 0 && (
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {pages.map((page) => (
                <View
                  key={page.id}
                  style={{ width: pageWidth, backgroundColor: Colors.primary }}
                  className="justify-center items-center rounded-3xl"
                >
                  { page.id === 0 ? (
                    <View className='px-8 py-4 justify-center items-center gap-3'>
                      <Text className='text-white font-pbold text-2xl'>🎉 What's New in v.2.0.0</Text>
                      <Text className='text-mainGray font-medium pb-6 '>Bingeable has got some major updates! Below are some key points of the new update. Swipe through to see the important changes.</Text>
                      <View className='flex flex-col w-full justify-center items-start gap-1'>
                        <Text className='text-mainGray font-semibold text-lg  '>• (NEW) Account Types: Choose between Filmmaker or Film Lover</Text>
                        <Text className='text-mainGray font-semibold text-lg  '>• (NEW) Recs Tab: Tab for Recommendations to easily manage your Recs</Text>
                        <Text className='text-mainGray font-semibold text-lg  '>• (NEW) SetDays: Post and track your days on Set</Text>
                        <Text className='text-mainGray font-semibold text-lg  '>• (NEW) Badges: Unlock and level up Badges based on your watches and interactions</Text>
                        <Text className='text-mainGray font-semibold text-lg  '>• Improved session and log in flow</Text>

                      </View>
                    </View>

                  ) : page.id === 1 ? (
                    <View className='px-8 py-4 justify-center items-center gap-3'>
                      <Text className='text-white font-pbold text-xl'>Account Type</Text>
                      <Text className='text-mainGray font-medium pb-6 '>Bingeable is creating features specifically for users working in the industry and if you want to use these features, select the Filmmaker account type. If you just want to use the app to track your watches etc, choose the Film Lover account type.</Text>
                      <View   className=' px-6 gap-2 rounded-3xl border-2 border-primaryLight py-4 justify-center items-center'>
                          <View className='flex flex-row gap-2 justify-center items-center'>
                              <Clapperboard size={25} color={Colors.mainGray}/>
                              <Text className='text-newLightGray font-bold text-lg'>Filmmaker</Text>
                          </View>
                      </View>
                      <View   className='px-6 gap-2 rounded-3xl  border-2 border-primaryLight py-4 justify-center items-center'>
                          <View className='flex flex-row gap-2 justify-center items-center'>
                              <PopcornIcon size={25} color={Colors.mainGray} />
                              <Text className='text-newLightGray font-bold text-lg'>Film Lover</Text>
                          </View>
                      </View>
                    </View>

                  ) : page.id === 2 ? (
                    <View className='px-8 py-4 justify-center items-center gap-3'>
                      <Text className='text-white font-pbold text-xl'>Recs Tab</Text>
                      <Text className='text-mainGray font-medium pb-6 '>Recommendations got it's own tab so it's easier than ever to track your Recs! Get notified when your friends send you a Rec and keep track of them in the new tab page.</Text>
                      <Image
                        source={require('../../assets/images/screenshots/recsTab.png')}
                        width={300}
                        height={70}
                        contentFit='contain'
                      />
                      <Image
                        source={require('../../assets/images/screenshots/recommendationsPage.png')}
                        width={300}
                        height={270}
                        contentFit='cover'
                        style={{overflow:'hidden'}}
                      />
                    </View>


                  ) : page.id === 3 ? (
                    <View className='px-8 py-4 justify-center items-center gap-3'>
                      <Text className='text-white font-pbold text-xl'>SetDays</Text>
                      <Text className='text-mainGray font-medium pb-6 '>A way for Filmmakers to track and post about their days on set.</Text>
                      <Image
                        source={require('../../assets/images/screenshots/setDayGraph.png')}
                        width={240}
                        height={100}
                        contentFit='cover'
                      />
                      <Image
                        source={require('../../assets/images/screenshots/setDayCard.png')}
                        width={240}
                        height={400}
                        contentFit='cover'
                        style={{overflow:'hidden'}}
                      />
                    </View>
                  ) : page.id === 4 ?  (

                    <View className='px-8 py-4 justify-center items-center gap-3'>
                      <Text className='text-white font-pbold text-xl'>Badges</Text>
                      <Text className='text-mainGray font-medium pb-6 '>Unlock new Badges and level them up based on your activity! Go to the Badges page in your profile to read the requirements for each badge.</Text>
                      
                      <Image
                        source={require('../../assets/images/screenshots/badgesPage.png')}
                        width={270}
                        height={350}
                        contentFit='cover'
                        style={{overflow:'hidden'}}
                      />
                    </View>
                  ) : page.id === 5 && (
                    <View className='flex flex-col justify-center items-center gap-8 px-8'>
                      <Text className='text-mainGray font-semibold'>We hope you enjoy the new features and improvements, our team strives to provide the best experience for all film lovers and filmmakers!</Text>
                    <TouchableOpacity onPress={handleClose} className="bg-primaryLight py-4  w-[200px] items-center" style={{borderRadius:25}}>
                    <Text className="text-mainGray font-semibold text-lg">Got it!</Text>
                  </TouchableOpacity>

                    </View>

                  )  }


                </View>
              ))}
            </ScrollView>
          )}

          {/* DOTS */}
          <View className="flex-row justify-center mt-4">
            {pages.map((_, i) => (
              <View
                key={i}
                className="w-2 h-2 mx-1 rounded-full"
                style={{ backgroundColor: i === index ? "white" : "gray" }}
              />
            ))}
          </View>
        </View>

        {/* <View className="absolute bottom-16 left-0 right-0 px-6">
        
        </View> */}
      </View>    
      </Modal>
  )
}

export default WhatsNewModal