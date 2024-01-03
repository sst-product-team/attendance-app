import { useState, useEffect, useContext } from 'react';
import DidContext from '../../contexts/DidContext';
import {View, Text} from 'react-native';
import MarkAttendanceButton from './MarkAttendanceButton';
import fetchCurrentClass from '../../backend/fetchCurrentClass';

function formatDateObject(start, end, join) {
  let startString = start.toLocaleDateString();
  let startTimeString = start.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  let endString = end.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${startString} ${startTimeString} ${join} ${endString}`;
}



const ClassView = () => {
  const did = useContext(DidContext);
  const [currentClass, setCurrentClass] = useState(null);

  useEffect(() => {
    fetchClass();
  }, []);

  function fetchClass() {
    fetchCurrentClass(did)
      .then(classs => {
        setCurrentClass(classs);
      })
      .catch(err => {});
  }

  const ClassData = currentClass;

  if (!ClassData) {
    return (
      <View style={{width: '100%', height: '20%', alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: 'rgba(255, 251, 251, 0.11)',
            width: '90%',
            height: '100%',
            borderRadius: 20,
          }}>
          <Text
            style={{
              fontSize: 16,
              marginTop: '6%',
              marginLeft: '5%',
              color: '#ffffff',
            }}>
            {ClassData?.name || 'No scheduled class for now'}
          </Text>
        </View>
      </View>
    );
  }

  function onSuccessMark() {
    setCurrentClass(null);
    fetchClass();
  }


  const atw = 'Attendance Window: '+ formatDateObject(ClassData.attendance_start_time,ClassData.attendance_end_time,'to',)
  
  return (
    <View style={{width: '100%', height: '20%', alignItems: 'center'}}>
      <View
        style={{
          backgroundColor: 'rgba(255, 251, 251, 0.05)',
          width: '90%',
          height: '90%',
          borderRadius: 20,
        }}>
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
          {'Class Window: '}
          {formatDateObject(
            ClassData.class_start_time,
            ClassData.class_end_time,
            'to',
          )}
        </Text>
        <Text
          style={{
            fontSize: 12,
            marginTop: '4%',
            marginLeft: '5%',
            color: '#e1e1e1',
          }}>
            {ClassData.marked_by_bsm? "Attendance will be marked by BSM": atw} 
        </Text>

        {/*  attendance button here */}
        {ClassData.marked_by_bsm? null: <MarkAttendanceButton ClassData={ClassData} onSuccessMark={onSuccessMark} />}
      </View>
    </View>
  );
};

export default ClassView;
