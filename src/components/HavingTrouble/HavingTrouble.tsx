
import React from 'react';
import { View, Text, StyleSheet } from "react-native";

const HavingTrouble = () => {

  return (
    <View style={styles.HavingTrouble}>
      <Text>
        Having Trouble? Raise and Issue
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  HavingTrouble: {
    color: '#1a1a1a',
    marginTop: '5%',
  },
});

export default HavingTrouble;
