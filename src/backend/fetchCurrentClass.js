// import signToken from '../utils/signToken';
import {domain_URL} from '../constants';

const fetchCurrentClass = did => {
  return new Promise((resolve, reject) => {
    fetch(domain_URL + '/attendance/getcurclassattendance/', {
      method: 'POST',
      body: JSON.stringify({
        token: did,
      }),
    })
      .then(response => {
        return response.json();
      })
      .then(classs => { 
        if (classs) {
          classs.attendance_start_time = new Date(classs.attendance_start_time);
          classs.attendance_end_time = new Date(classs.attendance_end_time);
          classs.class_start_time = new Date(classs.class_start_time);
          classs.class_end_time = new Date(classs.class_end_time);
        }
        resolve(classs);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export default fetchCurrentClass;
