import {NextFunction, Request, Response} from "express";
import logger from "../logger";
import * as mongoose from "mongoose";
import User from "../models/user";
import Account from "../models/account";
import Transaction from "../models/transaction";

const NAMESPACE = "Account";

const getAccount = async (req: Request, res: Response, next: NextFunction) => {
  Account.findOne({ userId: res.locals.jwt.id, _id: req.params.id })
  .exec()
  .then((account) => {
    return res.status(200).json({
      account: account
    });
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  })
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  Account.find({ userId: res.locals.jwt.id })
  .exec()
  .then((account) => {
    return res.status(200).json({
      accounts: account,
      count: account.length
    });
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  })
};

const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  Transaction.deleteMany({ accountId: req.params.id })
  .exec()
  .then(() => {
    Account.findOneAndRemove({ userId: res.locals.jwt.id, _id: req.params.id })
    .exec()
    .then((account) => {
      res.locals.account = account;
      next()
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error
      });
    })
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  });

};

const upgradeAccount = async (req: Request, res: Response, next: NextFunction) => {
  Account.findOneAndUpdate({ userId: res.locals.jwt.id, _id: req.params.id}, req.body)
  .exec()
  .then((account) => {
    res.locals.account = account;
    next()
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  })
};

const addAccount = async (req: Request, res: Response, next: NextFunction) => {
  const {name, sum, currency, icon, inCount} = req.body;

  const id = res.locals.jwt.id;

  Account.find({ userId: res.locals.jwt.id })
  .exec()
  .then((account) => {
    if (account.length < 5) {
      const account = new Account({
        _id: new mongoose.Types.ObjectId(),
        userId: id,
        name,
        sum,
        currency,
        icon,
        inCount
      });

      account.save()
      .then((account) => {
          res.locals.account = account;
          next()
      })
      .catch((error) => {
        return res.status(500).json({
          message: error.message,
          error,
        });
      });
    } else {
      return res.status(500).json({
        message: "You have too many accounts"
      });
    }
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  })
};

const recalculate = async (req: Request, res: Response, next: NextFunction) => {
  Transaction.aggregate([
    { $match: {
        accountId: res.locals.transaction.accountId
    }},
    { $group: {
        _id: "$income",
        sum: { $sum: "$sum"  }
    }}
  ])
  .then((transaction) => {
    let totalSum = 0;
    transaction.forEach(elem => {
      if (elem._id) {
        totalSum += elem.sum;
      } else {
        totalSum -= elem.sum;
      }
    });
    Account.findOneAndUpdate({ userId: res.locals.jwt.id, _id: res.locals.transaction.accountId}, { sum: totalSum })
    .exec()
    .then((account) => {
      if ( next ) {
        res.locals.account = account;
        next();
      } else {
        return res.status(200).json({
          message: "Account updated",
          account
        });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error
      });
    })
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  })
};

export default {
  getAccount,
  getAll,
  deleteAccount,
  upgradeAccount,
  addAccount,
  recalculate
};
