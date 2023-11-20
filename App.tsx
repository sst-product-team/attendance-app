/**
 * Scaler School of Technology Application
 * @format
 */

import React, {useEffect, useState} from 'react'; // importing react module
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  StatusBar,
  ActivityIndicator,
} from 'react-native'; // importing react-native
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'; // to implement google sign in
import LinearGradient from 'react-native-linear-gradient'; // implement linear gradient in screens
import Logo from './assets/images/scaler_logo.svg'; // import scaler school of technology SVG logo
import HavingTrouble from './src/components/HavingTrouble'; // show the having trouble link in sign in page
import GoogleLogo from './assets/images/google_logo.svg'; // import the Google SVG logo
import DeviceInfo from 'react-native-device-info'; // module to bring device info from
import GetLocation from 'react-native-get-location'; // get user location from device
import FlashMessage, {showMessage} from 'react-native-flash-message'; // module to flash messages on device screen
import JailMonkey from 'jail-monkey'; // module to prevent TrustFall
import {sign} from 'react-native-pure-jwt';

export default function App(): JSX.Element {
  const [loggInError, setLoggInError] = useState(null); // check if user logged in or not
  const [userLoggedIn, setUserLoggedIn] = useState(false); // check if user logged in or not
  const [userEmail, setUserEmail] = useState('Anonymous'); // state to store user email
  const [did, setdid] = useState(''); // state to store Device ID from react-native-device-info
  const [userCord, setUserCord] = useState([]); // state to store user coordinates
  const [markingAttendance, setMarkingAttendance] = useState(false); // state to store marking attendance
  const [userName, setUserName] = useState(''); // state to store username
  const [ClassData, setClassData] = useState(null); // state to store class data.
  const domain_URL = 'https://attendancebackend-v9zk.onrender.com'; // API URL to make requests to database

  /**
   * Effect to configure Google Sign In for application
   * */
  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  /**
   * Function to check validity of device for marking attendance.
   *
   * return true if phone is either in developer mode, debug mode or is Jail Broken
   * */
  const checkValidity = async () => {
    const DevMode = await JailMonkey.isDevelopmentSettingsMode(); // check if developer is on
    const TrustFall = JailMonkey.trustFall(); // check for TrustFall
    const DebugMode = await JailMonkey.isDebuggedMode(); // Check if debug mode is on
    return DevMode;
  };

  const signToken = async (mail, payload) => {
    return await sign(
      {
        iss: mail,
        exp: new Date().getTime() + 20 * 1000, // expiration date, required, in ms, absolute to 1/1/1970
        did: payload,
      }, // body
      'this_is_not_secret_key', // secret
      {
        alg: 'HS256',
      },
    );
  };

  /**
   * get height of device screen from react-native
   * */
  const {height} = useWindowDimensions();

  /**
   * Function to sign out user.
   * */
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      if (userLoggedIn) {
        setUserLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * function to mark attendance of student at stage 2.
   * */
  function markAttendance() {
    setMarkingAttendance(true); // change state of marking attendance to true
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
      rationale: {
        title: 'Location permission',
        message: 'The app needs the permission to request your location.',
        buttonPositive: 'Ok',
      },
    })
      .then(async newLocation => {
        // setUserLat(newLocation.latitude);
        // setUserLong(newLocation.longitude);
        setUserCord([
          ...userCord,
          newLocation.latitude + ',' + newLocation.longitude + '\n',
        ]); // change state of user coordinates

        const jwtToken = await signToken('', did);
        const UserToBeMarked = {
          jwtToken: jwtToken,
          latitutde: newLocation.latitude,
          longitude: newLocation.longitude,
          accuracy: newLocation.accuracy,
          version: '0.2.4',
        };

        setMarkingAttendance(false); // set marking attendance to false once attendance is marked

        fetch(domain_URL + '/attendance/', {
          method: 'POST',
          body: JSON.stringify(UserToBeMarked),
        })
          .then(response => {
            // Handle the response
            setMarkingAttendance(false);
            console.log(response.status);
            if (response.status == 200) {
              return response.json();
            } else if (response.status >= 400 && response.status < 500) {
              response.json().then(errorMessage => {
                showFlashMessage(
                  'Attendance not marked',
                  errorMessage.message,
                  'error',
                );
              });
            } else {
              throw new Error('');
            }
          })
          .then(data => {
            showFlashMessage(
              'Attendance marked',
              'Your attendance has been marked.',
              'success',
            ); // show success message on successfully marking attendance.
          })
          .catch(error => {
            setMarkingAttendance(false);
            console.log(error);
            showFlashMessage('Attendance not marked', '' + error, 'error');
          });
      })
      .catch(ex => {
        setMarkingAttendance(false);
        console.log(ex);
        showFlashMessage('Problem with Location', '' + ex, 'error');
      });
  }

  const MarkFinalAttendance = () => {
    checkValidity().then(unsafe => {
      if (unsafe) {
        showFlashMessage(
          'Developer mode enabled',
          'Turn off developer mode to mark attendance',
          'error',
        );
      } else {
        console.log('Marking final attendance for user :- ', did);
        markAttendance();
      }
    });
  };

  const RepeatedMarking = async () => {
    const requests = 5;
    MarkFinalAttendance();
    // for (let i = 0; i < requests; i++) {
    //   MarkFinalAttendance();
    // }
  };

  function showFlashMessage(message: string, desc: string, type: string) {
    showMessage({
      message: message,
      description: desc,
      type: type,
      floating: true,
      duration: 3000,
    });
  }

  function formatDateObject(dateObject) {
    if (!dateObject) {
      return '-';
    }
    let hour = dateObject.getHours();
    const minute = dateObject.getMinutes();
    let ampm = 'AM';

    if (hour >= 12) {
      ampm = 'PM';
    }
    if (hour > 12) {
      hour = hour - 12;
    }

    return `${hour}:${minute} ${ampm}`;
  }

  if (userLoggedIn) {
    return (
      <View>
        <StatusBar animated={true} backgroundColor="#1a1a1a" />

        <LinearGradient
          colors={['#5B5ABE', '#6D73FB', '#85A0FF']}
          style={{height: '100%'}}>
          <StatusBar animated={true} backgroundColor={'#5B5ABE'} />

          <View style={{width: '100%', height: 'max-content'}}>
            <Text style={LoginStyles.welcomemessage}>Good Morning</Text>

            <Text style={LoginStyles.username}>{userName}</Text>
          </View>

          <View style={{width: '100%', height: '30%', alignItems: 'center'}}>
            <View style={LoginStyles.classcontainer}>
              <Text
                style={{
                  fontSize: 18,
                  marginTop: '6%',
                  marginLeft: '5%',
                  color: '#ffffff',
                }}>
                {ClassData?.name || 'No scheduled class for now'}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  marginTop: '4%',
                  marginLeft: '5%',
                  color: '#e1e1e1',
                }}>
                {ClassData?.attendance_start_time
                  ? `Class Window: ${formatDateObject(
                      ClassData.class_start_time,
                    )} to ${formatDateObject(ClassData.class_end_time)}`
                  : '-'}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginTop: '4%',
                  marginLeft: '5%',
                  color: '#e1e1e1',
                }}>
                {ClassData?.attendance_start_time
                  ? `Attendance Window: ${formatDateObject(
                      ClassData.attendance_start_time,
                    )} to ${formatDateObject(ClassData.attendance_end_time)}`
                  : '-'}
              </Text>

              <View style={{width: '100%', alignItems: 'center'}}>
                <Pressable
                  disabled={ClassData ? false : true}
                  style={{
                    ...LoginStyles.markButton,
                    backgroundColor: ClassData?.attendance_time
                      ? 'green'
                      : '#2f3c7c',
                    opacity: ClassData ? 1 : 0.4,
                  }}
                  onPress={RepeatedMarking}>
                  <Text style={{fontSize: 15}}>
                    {ClassData?.attendance_time
                      ? '👍Present'
                      : 'Mark Attendance'}
                  </Text>
                </Pressable>
                {markingAttendance ? (
                  <ActivityIndicator color="white" size={47} />
                ) : (
                  ''
                )}
              </View>
            </View>
          </View>
        </LinearGradient>
        <FlashMessage position="bottom" style={{marginBottom: '5%'}} />
      </View>
    );
  } else {
    DeviceInfo.getUniqueId().then(uniqueId => {
      setdid(uniqueId);
    });

    async function LoginWithGoogleNow() {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

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
          };

          let statCode = 400;
          fetch(domain_URL + '/attendance/register/', {
            method: 'POST',
            body: JSON.stringify(UserToLogin),
          })
            .then(async response => {
              // Handle the response
              console.log(response);
              if (response.status == 200) {
                statCode = 200;
              } else if (response.status >= 400 && response.status < 500) {
                let errorMessage = await response.json();
                setLoggInError(errorMessage.message);
                throw new Error(errorMessage.message);
              } else {
                throw new Error('Network response was not ok.');
              }
            })
            .then(data => {
              // User allowed login
              statCode = 200;

              if (statCode == 200) {
                setUserEmail(userEmail);
                const username = userInfo.user.name?.split(' ');
                // @ts-ignore
                username.concat(' ');
                setUserName(username[0] + ' ' + username[1]);
                fetch(domain_URL + '/attendance/getcurclassattendance/', {
                  method: 'POST',
                  body: JSON.stringify({
                    token: did,
                  }),
                })
                  .then(response => {
                    return response.json();
                  })
                  .then(classes => {
                    console.log(classes);

                    if (classes) {
                      classes.attendance_start_time =
                        classes.attendance_start_time
                          ? new Date(classes.attendance_start_time)
                          : null;
                      classes.attendance_end_time = classes.attendance_end_time
                        ? new Date(classes.attendance_end_time)
                        : null;
                      classes.class_start_time = classes.class_start_time
                        ? new Date(classes.class_start_time)
                        : null;
                      classes.class_end_time = classes.class_end_time
                        ? new Date(classes.class_end_time)
                        : null;

                      classes.attendance_time = classes.attendance_time
                        ? new Date(classes.attendance_time)
                        : null;
                    }
                    setClassData(classes);
                  });
                setUserLoggedIn(true);
              } else {
                console.log('Some error at backend');
                signOut();
              }
            })
            .catch(error => {
              statCode = 400;
              signOut();
              setLoggInError('' + error);
            });
        } else {
          setLoggInError('User Not authorised to signin');
          console.log('User Not authorised to signin');
          signOut();
        }
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

    // @ts-ignore
    return (
      <View>
        <StatusBar animated={true} backgroundColor="#5B5ABE" />

        <LinearGradient
          colors={['#5B5ABE', '#6D73FB', '#85A0FF']}
          style={{height: '100%'}}>
          <View style={styles.root}>
            <Logo size={height * 0.4} style={styles.logo} />
          </View>

          <View style={[styles.atBottom]}>
            <HavingTrouble error={loggInError} />
            <Pressable
              style={googlestyles.container}
              onPress={LoginWithGoogleNow}>
              <GoogleLogo />

              <Text style={googlestyles.data}>Login with Google</Text>
            </Pressable>
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
  },
});

const LoginStyles = StyleSheet.create({
  welcomemessage: {
    fontSize: 18,
    marginHorizontal: '8%',
    marginTop: '10%',
  },
  username: {
    fontSize: 40,
    marginTop: '5%',
    marginHorizontal: '8%',
  },
  classcontainer: {
    backgroundColor: 'rgba(255, 251, 251, 0.21)',
    width: '85%',
    height: '100%',
    marginVertical: '10%',
    borderRadius: 20,
  },
  markButton: {
    width: '80%',
    backgroundColor: '#2f3c7c',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
    borderRadius: 20,
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
