import {sign} from 'react-native-pure-jwt';

const signToken = async (mail, payload) => {
  return await sign(
    {
      iss: mail,
      exp: new Date().getTime() + 20 * 1000, // expiration date, required, in ms, absolute to 1/1/1970
      did: payload,
    }, // body
    'this_is_not_secret_key', // secret
    {
      alg: 'HS256',
    },
  );
};

export default signToken;
