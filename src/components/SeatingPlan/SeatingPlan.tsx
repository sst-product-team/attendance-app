import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

function getFormattedDate() {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const today = new Date();
  return today.toLocaleDateString('en-US', options);
}

const SeatingPlan = (student) => {

  useEffect(() => {
    fetch(API_URL + '/api?email=' + email).then((response) => {
        return response.json();
      })
      .then(data => {
        let seat = data.seat.split("-");
        let seat_string = `${seat[0]}-${seat[1]}(${seat[2]})`
        setSeat(seat_string);
      });
  }, [email]);

  const [seat, setSeat] = useState('');
  const email = student.student.split("@")[0] + '@ms.sst.scaler.com';
  const API_URL = 'https://seating.vercel.app';
  return (
    <View
      style={{width: '100%', height: '10%', alignItems: 'center', marginBottom: '5%'}} >
      <View style={Seating.container}>
        <View style={{width: '60%', height: '100%', borderBottomLeftRadius: 20, borderTopLeftRadius: 20}}>
          <View style={{width: '100%', height: '60%', justifyContent: 'center', fontFamily: 'Alata Regular', marginLeft: '8%' }}>
            <Text style={{fontSize: 25}}>
              Seating Plan
            </Text>
          </View>
          <View style={{width: '100%', height: '40%', marginLeft: '10%'}}>
            <Text style={{color: '#cacaca', fontSize: 12}}>
              {getFormattedDate()}
            </Text>
          </View>
        </View>
        <View style={{width: '40%', height: '100%', borderTopRightRadius: 20, borderBottomRightRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 32, color: '#dadada', fontFamily: 'Alata Regular',}}>
            {seat}
          </Text>
        </View>
      </View>


    </View>
  )

}

const Seating = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 251, 251, 0.21)',
    width: '85%',
    height: '100%',
    marginVertical: '8%',
    borderRadius: 20,
    flexDirection: 'row',
  },
});

export default SeatingPlan;
