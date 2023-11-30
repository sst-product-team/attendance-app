import checkValidity from '../utils/checkValidity';
import GetLocation from 'react-native-get-location';
import signToken from '../utils/signToken';
import {APP_VERSION, domain_URL} from '../constants';

const markAttendance = async did => {
  return new Promise((resolve, reject) => {
    checkValidity().then(unsafe => {
      if (unsafe) {
        reject({
          status: 'failed',
          message: 'Developer mode enabled',
        });
      } else {
        console.log('Marking final attendance for user :- ', did);
        markFinalAttendance(did).then(resolve).catch(reject);
      }
    });
  });
};

function markFinalAttendance(did) {
  return new Promise((resolve, reject) => {
    // setMarkingAttendance(true); // change state of marking attendance to true
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
        const jwtToken = await signToken('', did);
        const UserToBeMarked = {
          jwtToken: jwtToken,
          latitutde: newLocation.latitude,
          longitude: newLocation.longitude,
          accuracy: newLocation.accuracy,
          version: APP_VERSION,
        };

        // setMarkingAttendance(false); // set marking attendance to false once attendance is marked

        fetch(domain_URL + '/attendance/', {
          method: 'POST',
          body: JSON.stringify(UserToBeMarked),
        })
          .then(response => {
            if (response.ok) {
              response.json().then(res => {
                resolve({
                  status: res.status || 'success',
                  message: res.message || 'Your attendance has been marked.',
                });
              });
            } else if (response.status >= 400 && response.status < 500) {
              response.json().then(errorMessage => {
                reject({
                  status: 'failed',
                  message: errorMessage.message,
                });
              });
            } else {
              reject({
                status: 'failed',
                message: 'Network response was not ok.',
              });
            }
          })
          .catch(error => {
            // setMarkingAttendance(false);
            console.log(error);
            reject({
              status: 'failed',
              message: '' + error,
            });
          });
      })
      .catch(ex => {
        // setMarkingAttendance(false);
        console.log(ex);
        reject({
          status: 'failed',
          message: '' + ex,
        });
      });
  });
}

export default markAttendance;
