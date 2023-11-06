/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, Button, StyleSheet, Appearance, useWindowDimensions, Pressable } from "react-native";
import SignInScreen from "./src/screens/SignInScreen";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import LinearGradient from "react-native-linear-gradient";
import Logo from "./assets/images/scaler_logo.svg";
import SignInWithGoogle from "./src/components/SignInWithGoogle/SignInWithGoogle";
import SignInWithMicrosoft from "./src/components/SignInWithMicrosoft";
import HavingTrouble from "./src/components/HavingTrouble";
import GoogleLogo from "./assets/images/google_logo.svg";
import MicrosoftLogo from "./assets/images/microsoft_logo.svg";
import DeviceInfo from "react-native-device-info";

export default function App(): JSX.Element {

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const {height} = useWindowDimensions();
  if (userLoggedIn) {
    return (
      <SafeAreaView>
        <View>
          <Text>Welcome User</Text>
          <Button title="Log Out" />
        </View>
      </SafeAreaView>
    );
  } else {

    useEffect(() => {
      GoogleSignin.configure();
    }, []);


    async function LoginWithGoogleNow() {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log(userInfo);
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('SIGN IN CANCELLED');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log('SIGNING IN');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log('PLAY SERVICES NOT AVAILABLE');
        } else {
          console.log(error);
        }
      }
    }

    const [StatusBarColor, setStatusBarColor] = useState("#5B5ABE");
    const [BackgroundGradientTop, setBackgroundGradientTop] = useState("#5B5ABE");
    const [did, setdid] = useState("");
    DeviceInfo.getUniqueId().then((uniqueId) => {
      // iOS: "FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9"
      // Android: "dd96dec43fb81c97"
      // Windows: "{2cf7cb3c-da7a-d508-0d7f-696bb51185b4}"
      setdid(uniqueId);
      console.log(uniqueId);
    });

    // @ts-ignore
    return (
      <View>
        <LinearGradient colors={['#5B5ABE', '#6D73FB', '#85A0FF']} style={{height: '100%'}} >



          <View style={styles.root}>
            <Logo size={height * 0.4} style={styles.logo} />
          </View>

          <View style={[styles.atBottom]}>

            <Text>
              {did}
            </Text>

            <Pressable style={googlestyles.container} onPress={LoginWithGoogleNow}>
              <GoogleLogo
              />

              <Text style={googlestyles.data}>
                Login with Google
              </Text>
            </Pressable>

            <Pressable style={msstyles.container}>
              <MicrosoftLogo
              />

              <Text style={msstyles.data}>
                Login with Microsoft
              </Text>
            </Pressable>

            <HavingTrouble />

          </View>

        </LinearGradient>
      </View>
    );

  }
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    maxWidth: 300,
    maxHeight: 100,
    marginVertical: '25%',
  },
  atBottom: {
    padding: 15,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    marginBottom: '3%',
  }
});

const googlestyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '90%',
    height: 65,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  data: {
    color: '#333333',
    fontSize: 18,
    paddingLeft: 25,
    fontFamily: 'Alata Regular',
  },

});

const msstyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    width: '90%',
    height: 65,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  data: {
    color: '#cacaca',
    fontSize: 18,
    paddingLeft: 25,
    fontFamily: 'Alata Regular',
  },
});
