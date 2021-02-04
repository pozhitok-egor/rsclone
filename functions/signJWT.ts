import * as jwt from 'jsonwebtoken';
import config from '../config';
import logger from '../logger';
import IUser from '../interfaces/user';

const NAMESPACE = 'Auth';

const signJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void): void => {
  var timeSinchEpoch = new Date().getTime();
  var expirationTime = timeSinchEpoch + Number(config.server.token.expireTime)*100000;
  var expirationTimeSeconds = Math.floor(expirationTime / 1000);

  logger.info(NAMESPACE, `Attempting to sign token for ${user._id}`);

  try {
    jwt.sign(
      {
        /* Other params like admin or not */
        username: user.username,
        id: user._id
      },
      config.server.token.secret,
      {
        issuer: config.server.token.issuer,
        algorithm: 'HS256',
        expiresIn: expirationTimeSeconds
      },
      (error, token) => {
        if (error) {
          callback(error, null);
        } else if (token) {
          callback(null, token);
        }
      }
    )
  } catch (error) {
    logger.error(NAMESPACE, error.message, error)
    callback(error, null);
  }
}

export default signJWT;
