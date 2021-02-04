import {NextFunction, Request, Response} from "express";
import logger from "../logger";
import * as mongoose from "mongoose";
import Transaction from "../models/transaction";

const NAMESPACE = "Transactions";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  Transaction.find({ userId: res.locals.jwt.id })
  .exec()
  .then((transactions) => {
    return res.status(200).json({
      transactions: transactions,
      count: transactions.length
    });
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  })
};

const getTransaction = async (req: Request, res: Response, next: NextFunction) => {
  Transaction.findOne({ userId: res.locals.jwt.id, _id: req.params.id })
  .exec()
  .then((transaction) => {
    return res.status(200).json({
      transaction
    });
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  })
};

const getAllFromAccount = async (req: Request, res: Response, next: NextFunction) => {
  Transaction.find({ userId: res.locals.jwt.id, accountId: req.params.id})
  .exec()
  .then((transaction) => {
    return res.status(200).json({
      transactions: transaction,
      count: transaction.length
    });
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  })
};

const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
  Transaction.findOneAndRemove({ userId: res.locals.jwt.id, _id: req.params.id })
  .exec()
  .then((transaction) => {
    res.locals.transaction = transaction;
    next();
    // return res.status(200).json({
    //   message: "Successfully removed",
    //   transaction
    // });
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  })
};

const upgradeTransaction = async (req: Request, res: Response, next: NextFunction) => {
  Transaction.findOneAndUpdate({userId: res.locals.jwt.id, _id: req.params.id}, req.body)
  .exec()
  .then((transaction) => {
    res.locals.transaction = transaction;
    next();
  })
  .catch((error) => {
    return res.status(500).json({
      message: error.message,
      error
    });
  })
};

const addTransaction = async (req: Request, res: Response, next: NextFunction) => {
  const { accountId, type, sum, repeat, income} = req.body;

  const day = req.body.day ? req.body.day : null;
  const delay = req.body.delay ? req.body.delay : null;

  if (repeat) {
    if (!["Week","Day","Month","Year"].includes(delay)) {
      return res.status(500).json({
        message: `\"delay\" does not have ${delay}`,
        error: `delay can have only \"Week\", \"Day\", \"Month\", \"Year\"`,
      });
    }
    if (typeof day !== 'number' || day < 0 || day > 6) {
      return res.status(500).json({
        message: `\"day\" must be a number between 0 and 6`,
        error: `\"day\" must be a number between 0 and 6`,
      });
    }
  }

  const id = res.locals.jwt.id;

  const transaction = new Transaction({
    _id: new mongoose.Types.ObjectId(),
    userId: id,
    accountId,
    type,
    sum,
    repeat,
    delay,
    day,
    income
  });

  transaction
    .save()
    .then((transaction) => {
      res.locals.transaction = transaction;
      next();
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

export default {
  getAll,
  getTransaction,
  deleteTransaction,
  upgradeTransaction,
  addTransaction,
  getAllFromAccount
};
