import messaging from '@react-native-firebase/messaging';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    await GetFCMToken();
  }
}

async function GetFCMToken() {
  let fcmtoken = await AsyncStorage.getItem('fcmtoken');
  console.log(fcmtoken, 'Old token');
  if (!fcmtoken) {
    try {
      const fcmtoken = await messaging().getToken();
      console.log('got token');
      if (fcmtoken) {
        console.log(fcmtoken, 'New token');
        await AsyncStorage.setItem('fcmtoken', fcmtoken);
      }
    } catch (error) {
      console.log(error, 'error in FCM Token');
    }
  }
}

// export async function createNotificationChannel() {
//   if (Platform.OS === 'android') {
//     const channel = messaging.Android.Channel(
//       'notify_sound',
//       'sst-notify',
//       messaging.Android.Importance.High,
//     )
//       .setDescription('Channel to for SST notifications')
//       .setSound('abcd');
//     await messaging().createChannel(channel);
//   }
// }

export const NotificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });


  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log('notification received in foreground state', remoteMessage);
  });
}
