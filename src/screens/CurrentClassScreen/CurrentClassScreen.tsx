import {useState, useEffect, useContext} from 'react';
import {Text, View, StatusBar, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import WelcomeMessage from '../../components/WelcomeMessage';
import SeatingPlan from '../../components/SeatingPlan';
import {ClassView, MarkAttendanceButton} from '../../components/ClassView';
import UserContext from '../../contexts/UserContext';
import DidContext from '../../contexts/DidContext';
import fetchCurrentClass from '../../backend/fetchCurrentClass';

const HomeScreen = () => {
  const did = useContext(DidContext);
  const [currentClass, setCurrentClass] = useState(null);
  const {userName, userEmail} = useContext(UserContext);
  
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

  function onSuccessMark() {
    setCurrentClass(null);
    fetchClass();
  }
  return (
    <View>
      <StatusBar animated={true} backgroundColor={'#1A0721'} />
      <LinearGradient
        colors={['#1A0721', '#1A0721', '#1A0721']}
        style={{height: '100%'}}>

        <View style={{width: '100%', height: 'max-content'}}>
          <WelcomeMessage />

          <Text style={LoginStyles.username}>{userName}</Text>
        </View>

        {/*  Seating Display */}

        <SeatingPlan student={userEmail} token={did} />

        {/* Class Display */}
        <ClassView ClassData={currentClass} />
        <MarkAttendanceButton
          ClassData={currentClass}
          onSuccessMark={onSuccessMark}
        />
      </LinearGradient>
    </View>
  );
};
const LoginStyles = StyleSheet.create({
  username: {
    fontSize: 40,
    marginTop: '5%',
    marginHorizontal: '8%',
    color: '#EAEAEAFF',
  },
  classcontainer: {
    backgroundColor: 'rgba(255, 251, 251, 0.11)',
    width: '85%',
    height: '100%',
    marginVertical: '2%',
    borderRadius: 20,
  },
  markButton: {
    width: '70%',
    backgroundColor: '#12142d',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '13%',
    borderRadius: 20,
  },
});
export default HomeScreen;
