import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const HavingTrouble = ({error}) => {
  return (
    <View style={error ? styles.Error : styles.HavingTrouble}>
      <Text>{error ? error : ''}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  HavingTrouble: {
    color: '#1a1a1a',
    marginTop: '5%',
  },
  Error: {
    color: 'red',
    marginTop: '5%',
  },
});

export default HavingTrouble;
