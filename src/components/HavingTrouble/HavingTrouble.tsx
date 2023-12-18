import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const HavingTrouble = ({error}) => {
  return (
    <View style={styles.HavingTrouble}>
      <Text style={error ? styles.ErrorText : styles.DefaultText}>
        {error ? error : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  HavingTrouble: {
    marginTop: '5%',
  },
  DefaultText: {
    color: '#1a1a1a',
  },
  ErrorText: {
    color: 'red',
    fontSize: 15, // Adjust the font size as needed
  },
});

export default HavingTrouble;
