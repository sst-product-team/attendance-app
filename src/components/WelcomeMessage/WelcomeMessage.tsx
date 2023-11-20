import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function getMessage() {
  const currentDate = new Date();
  const time = currentDate.getHours()
  if (time >= 4 && time < 12) {
    return 'Morning';
  } else if (time >= 12 && time < 17) {
    return 'Afternoon';
  } else if (time >= 17 && time < 20) {
    return 'Evening';
  } else {
    return 'Night';
  }
}

const WelcomeMessage = () => {
  return (
    <View>
      <Text style={styles.welcomemessage}>
        Good {getMessage()}
      </Text>
    </View>

  );
}

const styles = StyleSheet.create({
  welcomemessage: {
    fontSize: 18,
    marginHorizontal: '8%',
    marginTop: '10%',
  },
});

export default WelcomeMessage;
