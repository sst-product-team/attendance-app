import React from "react";

import {StyleSheet, View, Text} from "react-native";



const ClassData = () => {

  return (
    <View style={LoginStyles.classcontainer}>
      <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 16, color: "rgba(217,217,217,0.8)"}}>
          No class has been added
        </Text>
      </View>
    </View>
  );

  const LoginStyles= StyleSheet.create({
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
      justifyContent: "center",
      alignItems: "center",
      marginTop: '5%',
      borderRadius: 20,
    }
  });
}


export default ClassData;
