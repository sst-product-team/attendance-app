import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { fetchAttendance } from '../../backend/fetchAttendance';
import { showMessage } from "react-native-flash-message";


function getFormattedDate() {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const today = new Date();
  return today.toLocaleDateString('en-US', options);
}

const SeatingPlan = (student, token) => {

  useEffect(() => {
    
    fetch(API_URL + '/api?email=' + email).then((response) => {
        return response.json();
    })
      .then(data => {
        let seat = data.seat.split("-");
        let seat_string = `${seat[0]}-${seat[1]}(${seat[2]})`
        setSeat(seat_string);
    });
    
  }, [email, token]);

  const [seat, setSeat] = useState('');
  const [attendance, attendance_percentage] = useState('');
  const email = student.student.split("@")[0] + '@ms.sst.scaler.com';
  const API_URL = 'https://seating.vercel.app';

  const student_attendance_data = fetchAttendance(student.token)

  function showCompleteAttendance() {
    showMessage({
      message: "Attendance Record",
      description: student_attendance_data.attendance_record,
      type: "error",
      floating: true,
      duration: 4500,
    });
  }

  function showSeatingDetails() {
    showMessage({
      message: "Seating Details",
      description: "This seating is 0-indexed.",
      type: "error",
      floating: true,
      icon: "info",
    });
    
  }

  function redirectToCompleteAttendancePage() {
    const student_id = student.student.split("@")[0];
    const complete_attendance_link = `https://attendancebackend-v9zk.onrender.com/attendance/studentAttendance/${student_id}/`;
    Linking.openURL(complete_attendance_link);
  }


  
  
  return (
    <View
    style={globals.container} >
      
      <Pressable>
        <View style={Seating.container}>
          <View style={Seating.topper}>
            <Text style={Seating.topper_text}>
              Seating Plan
            </Text>
          </View>

          <Pressable style={Seating.loser} onPress={showSeatingDetails}>
            <Text style={Seating.loser_text}>
              {seat}
            </Text>
          </Pressable>

        </View>
      </Pressable>



      <Pressable onPress={showCompleteAttendance} onLongPress={redirectToCompleteAttendancePage}>
        <View style={Seating.container}>
          <View style={Seating.topper}>
            <Text style={Seating.topper_text}>
              Attendance
            </Text>
          </View>

          <Pressable style={Seating.loser} onPress={showCompleteAttendance} onLongPress={redirectToCompleteAttendancePage}>
            <Text style={Seating.loser_text}>
              {student_attendance_data.attendance_percentage}%
            </Text>
          </Pressable>

        </View>
      </Pressable>


    </View>
  )

}


const globals = StyleSheet.create({
  container: {
    width: '100%',
    height: '15%',
    marginVertical: '5%',
    flexDirection: 'row',
    // backgroundColor: 'red',
    justifyContent: 'space-evenly',
    alignItems: 'center',

  }
});

const Seating = StyleSheet.create({
  container : {
    width: 175,
    height: '100%',
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 251, 251, 0.05)',
  },
  topper: {
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topper_text: {
    fontSize: 18,
    color: '#ffffff',
  },
  loser: {
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loser_text: {
    fontSize: 38,
    color: '#ffffff',
  }
});

export default SeatingPlan;
