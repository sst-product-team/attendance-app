/**
 * Scaler School of Technology Application
 * @format
 */

import React, {useEffect, useState, useRef} from 'react'; // importing react module
import {
  StyleSheet,
  PermissionsAndroid
} from 'react-native';
import FlashMessage, {showMessage} from 'react-native-flash-message'; // module to flash messages on device screen
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {domain_URL, APP_VERSION} from './src/constants'; // improt API URL and current APP version
import DidContext from './src/contexts/DidContext';
import UserContext from './src/contexts/UserContext';
import DeviceInfo from 'react-native-device-info';

import SignInScreen from './src/screens/SignInScreen';
import HomeScreen from './src/screens/CurrentClassScreen';

import { requestUserPermission, NotificationListener } from './src/utils/pushnotification_helper';
import SplashScreen from 'react-native-splash-screen';

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  const [did, setdid] = useState('');
  const [fcm, setFCM] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const navigationRef = useRef(null);


  useEffect(() => {
    DeviceInfo.getUniqueId().then(uniqueId => {
      setdid(uniqueId);
    });
  }, []);

  useEffect(() => {

    try {
      const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Allow Scaler School of Technology to send you notifications',
          message:
            'Notification access required.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // } else {
      // }
    } catch (err) {
    }


    requestUserPermission();
    NotificationListener();
  }, []);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  function onSuccessRegister(initResponse) {
    setUserInfo({
      userName: initResponse.name,
      userEmail: initResponse.mail,
    });
    navigationRef.current.navigate('CurrentClassScreen');
  }

  return (
    <DidContext.Provider value={did}>
      <UserContext.Provider
        value={{...userInfo, onSuccessRegister: onSuccessRegister}}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={SignInScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="CurrentClassScreen"
              component={HomeScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
          <FlashMessage position="bottom" style={{marginBottom: '5%'}} />
        </NavigationContainer>
      </UserContext.Provider>
    </DidContext.Provider>
  );
}
