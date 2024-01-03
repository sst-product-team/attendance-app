import {Text, View, Pressable, ActivityIndicator} from 'react-native';
import {useState, useContext} from 'react';

import markAttendance from '../../backend/markAttendance';
import {showMessage} from 'react-native-flash-message';
import DidContext from '../../contexts/DidContext';

const MarkAttendanceButton = ({ClassData, onSuccessMark}) => {
  const did = useContext(DidContext);
  const [markingAttendance, setMarkingAttendance] = useState(false);

  const RepeatedMarking = async () => {
    setMarkingAttendance(true);
    try {
      markAttendance(did)
        .then(result => {
          setMarkingAttendance(false);
          showMessage({
            message:
              result.status === 'success'
                ? 'Attendance marked'
                : 'Attendance not marked',
            description: result.message,
            type: result.status,
            floating: true,
            duration: 4000,
          });
          onSuccessMark();
        })
        .catch(err => {
          setMarkingAttendance(false);

          showMessage({
            message: 'Attendance not marked',
            description: err.message,
            type: 'error',
            floating: true,
            duration: 4000,
          });
        });
    } catch (err) {
      setMarkingAttendance(false);

      showMessage({
        message: 'Attendance not marked',
        description: 'problem',
        type: 'error',
        floating: true,
        duration: 3000,
      });
    }
  };

  function classStatusToButtonText(status) {
    switch (status) {
      case 'Present':
        return '👍Attendance Marked';
        break;

      default:
        return 'Mark Attendance';
        break;
    }
    return ClassData.attendance_status === 'Absent'
      ? 'Mark Attendance'
      : ClassData.attendance_status;
  }

  const attendanceStatus = ClassData
    ? classStatusToButtonText(ClassData.attendance_status)
    : 'Absent';

  const isDisabled = !ClassData || markingAttendance;

  return (
    <View style={{width: '100%', alignItems: 'center'}}>
      <Pressable
        disabled={isDisabled}
        style={{
          width: '80%',
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '18%',
          borderRadius: 20,
          backgroundColor:
            ClassData?.attendance_status === 'Present'
              ? 'rgb(69,122,44)'
              : '#872341',
          opacity: isDisabled ? 0.4 : 1,
        }}
        onPress={(isDisabled) ? null : RepeatedMarking}>
        <Text style={{fontSize: 15, color: '#EAEAEAFF'}}>
          {attendanceStatus}
        </Text>
      </Pressable>
      {markingAttendance ? <ActivityIndicator color="white" size={47} /> : ''}
    </View>
  );
};

export default MarkAttendanceButton;
