import { StatusBar } from "expo-status-bar";
import { Redirect, router, Link } from "expo-router";
import { View, Text, Image, ScrollView, Button } from "react-native";
// import { useNavigation } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { useEffect } from "react";


// import { images } from "../constants";
// import { CustomButton, Loader } from "../components";
// import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
//   const { loading, isLogged } = useGlobalContext();

//   if (!loading && isLogged) return <Redirect href="/home" />;
  const {user} = useUser();
  const router = useRouter();  // Access navigation object

  // If user is logged in, redirect immediately in the render
  if (user) {
    return <Redirect href="(home)/homeIndex" />
    router.push('(home)/homeIndex'); // Perform the redirection to the Home screen
    // return null; // This prevents rendering anything else while the navigation happens
  }

  console.log('signedIn is ', SignedIn)

    return (
      <View style={{ justifyContent:'center', alignItems:'center', width:'100%', height:'100%' }} >
        <SignedIn>
          {/* <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
          <Link href="/(home)/homeIndex">Home</Link> */}
          
        </SignedIn>
        <SignedOut>
          <Link href="/(auth)/signIn">
            <Text>Sign in</Text>
          </Link>
          <Link href="/(auth)/signUp">
            <Text>Sign up</Text>
          </Link>
        </SignedOut>
      </View>
    )

    return <Redirect href="/(home)/homeIndex" />;
    

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* <Loader isLoading={loading} /> */}

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          {/* <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          /> */}

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>
{/* 
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            /> */}
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Aora
          </Text>

          <Button
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;