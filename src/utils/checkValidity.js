import JailMonkey from 'jail-monkey';

const checkValidity = async () => {
  const DevMode = await JailMonkey.isDevelopmentSettingsMode(); // check if developer is on
  // const TrustFall = JailMonkey.trustFall(); // check for TrustFall
  // const DebugMode = await JailMonkey.isDebuggedMode(); // Check if debug mode is on
  return !DevMode;
};

export default checkValidity;
