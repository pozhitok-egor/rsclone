import { Request, Response, NextFunction } from 'express';
import logger from '../logger';
import * as jwt from 'jsonwebtoken';
import config from '../config';

const NAMESPACE = "Auth";

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
  logger.info(NAMESPACE, 'Validating Token');

  let token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, config.server.token.secret, (error, decoded) => {
      if (error) {
        return res.status(404).json({
          message: error.message,
          error
        })
      } else {
        res.locals.jwt = decoded;
        res.locals.token = token;
        next();
      }
    })
  } else {
    return res.status(401).json({
      message: 'Unauthorized'
    })
  }
}
export default extractJWT;
