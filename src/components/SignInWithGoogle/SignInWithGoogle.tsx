import React, { useEffect } from "react";

import { Text, View, StyleSheet, Pressable} from "react-native";

import GoogleLogo from '../../../assets/images/google_logo.svg';
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";



const SignInWithGoogle = (LoginWithGoogleNow) => {

  useEffect(() => {
    GoogleSignin.configure();
  }, []);


  return (

    <Pressable style={styles.container} onPress={LoginWithGoogleNow}>
      <GoogleLogo
      />

      <Text style={styles.data}>
        Login with Google
      </Text>
    </Pressable>

  );

}

const styles = StyleSheet.create({
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

export default SignInWithGoogle;
