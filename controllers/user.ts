import {NextFunction, Request, Response} from "express";
import logger from "../logger";
import config from "../config";
import * as bcryptjs from "bcryptjs";
import * as mongoose from "mongoose";
import User from "../models/user";
import Account from "../models/account";
import signJWT from "../functions/signJWT";
import * as unirest from "unirest";

const NAMESPACE = "User";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(NAMESPACE, "Token Validated, user authorized");

  const jwt = res.locals.jwt;
  User.findOne({ _id: jwt.id })
  .exec()
  .then((user) => {
    return res.status(200).json({
      message: "Authorized",
      token: res.locals.token,
      user
    });
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error,
    });
  });
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  let {username, password, language, currency} = req.body;

  bcryptjs.hash(password, 10, (hashError, hash) => {
    if (hashError) {
      return res.status(500).json({
        message: hashError.message,
        error: hashError,
      });
    }

    User.findOne({ username })
    .exec()
    .then((user) => {
      if (user) {
        return res.status(500).json({
          message: `This username already used.`,
        });
      } else {
        const _user = new User({
          _id: new mongoose.Types.ObjectId(),
          username,
          password: hash,
          settings: {
            language,
            currency,
            totalSum: 0,
            colorSchema: 0
          }
        });

        _user
        .save()
        .then((user) => {
          const account = new Account({
            _id: new mongoose.Types.ObjectId(),
            userId: user._id,
            name: "Cash",
            sum: 0,
            currency,
            icon: "cash",
            inCount: true
          });

          account.save()
          .then((account) => {
            return res.status(201).json({
              user,
              account
            });
          })
          .catch((error) => {
            return res.status(500).json({
              message: error.message,
              error,
            });
          });
        })
        .catch((error) => {
          return res.status(500).json({
            message: error.message,
            error,
          });
        });
      }
    });
  });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  let { username, password } = req.body;

  User.find({ username })
  .exec()
  .then(users => {
    if ( users.length !== 1 )
    {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    bcryptjs.compare(password, users[0].password, (error, result) => {
      if (error) {
        logger.error(NAMESPACE, error.message, error);

        return res.status(401).json({
          message: 'Unauthorized'
        });
      } else {
        signJWT(users[0], (_error, token) => {
          if (_error) {
            logger.error(NAMESPACE, "Unable to sign token: ", _error);

            return res.status(401).json({
              message: 'Unauthorized',
              error: _error
            });
          } else if (token) {
            return res.status(200).json({
              message: 'Auth Successful',
              token,
              user: users[0]
            });
          }
        })
      }
    })
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  })
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  User.find()
  .select('-password')
  .exec()
  .then((users) => {
    return res.status(200).json({
      users: users,
      count: users.length
    });
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  })
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const { language, currency, totalSum, colorSchema } = req.body
  User.findOneAndUpdate({ _id: res.locals.jwt.id }, {settings: { language, currency, totalSum, colorSchema }})
  .exec()
  .then((user) => {
    return res.status(200).json({
      message: "Updated",
      user
    });
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  })
}

const recalculate = async (req: Request, res: Response, next: NextFunction) => {
  Account.find({ userId: res.locals.jwt.id })
  .exec()
  .then((accounts) => {
    User.findOne({ _id: res.locals.jwt.id})
    .exec()
    .then((user) => {
      unirest.get(config.currency.address)
        .query(`base=${user.settings.currency}`)
        .then((result) => {
            let totalSum = 0;
            const currencies = result.body.rates;
            const { language, currency, colorSchema } = user.settings;

            accounts.forEach(account => {
              if (account.currency !== user.settings.currency && account.inCount) {
                totalSum = totalSum + account.sum / currencies[account.currency];
              } else if (account.inCount) {
                totalSum = totalSum + account.sum;
              }
            });
            totalSum = Number(totalSum.toFixed(2));

            const {transaction, account} = res.locals;

            User.updateOne({ _id: res.locals.jwt.id },{ settings: { language, currency, totalSum, colorSchema } })
            .then((user) => {
              return res.status(200).json({
                message: "All data updated",
                totalSum: totalSum,
                transaction,
                account
              });
            })
            .catch((error) => {
              return res.status(500).json({
                message: error.message,
                error
              });
            });
        })
        .catch((error) => {
          return res.status(500).json({
            message: error.message,
            error
          });
        });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error
      });
    });
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  });
};

export default {
  getUser,
  register,
  login,
  getAllUsers,
  recalculate,
  update
};
