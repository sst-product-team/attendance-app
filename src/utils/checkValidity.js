import JailMonkey from 'jail-monkey';
import {SKIP_DEVELOPER_MODE_CHECK} from '../constants';

const checkValidity = async () => {
  if(SKIP_DEVELOPER_MODE_CHECK){
    return false;
  }
  const DevMode = await JailMonkey.isDevelopmentSettingsMode(); // check if developer is on
  // const TrustFall = JailMonkey.trustFall(); // check for TrustFall
  // const DebugMode = await JailMonkey.isDebuggedMode(); // Check if debug mode is on
  return DevMode;
};

export default checkValidity;
