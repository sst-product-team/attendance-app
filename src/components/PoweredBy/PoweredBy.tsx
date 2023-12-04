import {View, Text, StyleSheet} from 'react-native';

const PoweredBy = () => {
  return (
    <View style={styles.style}>
        <Text style={{color: '#fefefe',}}>
            powered by <Text style={{fontWeight: '800'}}>The Product Team</Text>
        </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  style: {
    marginTop: '3%',
  },
});

export default PoweredBy;