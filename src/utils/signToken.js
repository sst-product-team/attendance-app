import {sign} from 'react-native-pure-jwt';
import {JWT_SIGNATURE} from '../constants';

const signToken = async (mail, payload) => {
  return await sign(
    {
      iss: mail,
      exp: new Date().getTime() + 20 * 1000, // expiration date, required, in ms, absolute to 1/1/1970
      did: payload,
    }, // body
    JWT_SIGNATURE, // secret
    {
      alg: 'HS256',
    },
  );
};

export default signToken;
