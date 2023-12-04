import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GoogleLogo from '../../../assets/images/google_logo.svg';
import Logo from '../../../assets/images/scaler_logo.svg';
import AppVersionView from '../../components/AppVersionView';
import HavingTrouble from '../../components/HavingTrouble';
import DidContext from '../../contexts/DidContext';
import UserContext from '../../contexts/UserContext';
import signToken from '../../utils/signToken';
import {domain_URL} from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'; // to implement google sign in
import PoweredBy from '../../components/PoweredBy';

const registerBackend = async (userInfo, did) => {
  const userEmail = userInfo.user.email;
  const domain_name_provider = userEmail?.split('@')[1];
  const token = await signToken(userEmail, did);
  if (
    domain_name_provider === 'sst.scaler.com' ||
    domain_name_provider === 'scaler.com'
  ) {
    const UserToLogin = {
      name: userInfo.user.name,
      jwtToken: token,
      fcmtoken: await AsyncStorage.getItem('fcmtoken'),
    };

    const response = await fetch(domain_URL + '/attendance/register/', {
      method: 'POST',
      body: JSON.stringify(UserToLogin),
    });

    if (response.ok) {
      const data = await response.json();
      return {status: 'success', ...data};
    } else {
      const errorMessage = await response.json();
      return {status: 'error', message: errorMessage.message};
    }
  } else {
    return {status: 'error', message: 'User Not authorised to signin'};
  }
};

const SignInScreen = () => {
  const {height} = useWindowDimensions();
  const did = useContext(DidContext);
  const {onSuccessRegister} = useContext(UserContext);
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [loggInError, setLoggInError] = useState(null);

  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  const signOut = async () => {
    await GoogleSignin.signOut();
    setUserLoggedIn(null);
  };

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      return userInfo;
    } catch (error) {
      setLoggInError('Google login failed');
      throw error;
    }
  };

  const LoginWithGoogleNow = async () => {
    try {
      const userInfo = await googleLogin();
      const registerResult = await registerBackend(userInfo, did);
      if (registerResult.status === 'success') {
        onSuccessRegister(registerResult);
      } else {
        setLoggInError(registerResult.message);
        signOut();
      }
    } catch (error) {
      signOut();
    }
  };

  return (
    <View>
      <StatusBar animated={true} backgroundColor="#5B5ABE" />

      <LinearGradient
        colors={['#5B5ABE', '#6D73FB', '#85A0FF']}
        style={{height: '100%'}}>
        <View style={styles.root}>
          <Logo size={height * 0.4} style={styles.logo} />
        </View>
        <AppVersionView />
        <View style={[styles.atBottom]}>
          <HavingTrouble error={loggInError} />
          <Pressable
            style={googlestyles.container}
            onPress={LoginWithGoogleNow}>
            <GoogleLogo />

            <Text style={googlestyles.data}>Login with Google</Text>
          </Pressable>

          <PoweredBy />
        </View>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding:20,
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
  },
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
    gap: 15,
    marginTop: 10,
  },

  data: {
    color: '#1a1a1a',
    fontSize: 18,
    fontFamily: 'Alata Regular',
  },
});
export default SignInScreen;
