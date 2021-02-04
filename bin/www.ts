#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app';
import debug0 from 'debug'
import * as http from 'http';
import config from '../config';
import logger from '../logger';
import * as mongoose from "mongoose";
import Transaction from "../models/transaction";
import * as schedule from 'node-schedule';


/**
 * Get port from environment and store in Express.
 */

const NAMESPACE = 'SERVER';

const debug = debug0('backend:server');

const port = normalizePort(config.server.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  logger.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`)
  const job = schedule.scheduleJob('0 0 4 * * * *', function(fireDate){
    logger.info('JOB', `Checking all transactions`);
    Transaction.find({ repeat: true })
    .exec()
    .then((transactions) => {
      transactions.forEach((transaction) => {
        const transactionDate = transaction.createdAt;
        const today = new Date();
        const createdAt = today;
        createdAt.setHours(transactionDate.getHours());
        createdAt.setMinutes(transactionDate.getMinutes());
        createdAt.setSeconds(transactionDate.getSeconds());
        let tr = null;
        if (transactionDate.toLocaleDateString("en-US") !== today.toLocaleDateString("en-US")) {
          switch (transaction.delay) {
            case "Week":
              const dayOfWeek = transaction.day ? transaction.day : transactionDate.getDay();
              if (transactionDate.getDay() === dayOfWeek) {
                tr = new Transaction({
                  _id: new mongoose.Types.ObjectId(),
                  userId: transaction.userId,
                  accountId: transaction.accountId,
                  type: transaction.type,
                  sum: transaction.sum,
                  income: transaction.income,
                  reference: transaction._id,
                  createdAt
                });
              }
              break;
            case "Day":
              tr = new Transaction({
                _id: new mongoose.Types.ObjectId(),
                userId: transaction.userId,
                accountId: transaction.accountId,
                type: transaction.type,
                sum: transaction.sum,
                income: transaction.income,
                reference: transaction._id,
                createdAt
              });
              break;
            case "Month":
              if (transactionDate.getDate() === today.getDate()) {
                tr = new Transaction({
                  _id: new mongoose.Types.ObjectId(),
                  userId: transaction.userId,
                  accountId: transaction.accountId,
                  type: transaction.type,
                  sum: transaction.sum,
                  income: transaction.income,
                  reference: transaction._id,
                  createdAt
                });
              }
              break;
            case "Year":
              if (transactionDate.getDate() === today.getDate() && transactionDate.getMonth() === today.getMonth()) {
                tr = new Transaction({
                  _id: new mongoose.Types.ObjectId(),
                  userId: transaction.userId,
                  accountId: transaction.accountId,
                  type: transaction.type,
                  sum: transaction.sum,
                  income: transaction.income,
                  reference: transaction._id,
                  createdAt
                });
              }
              break;
            default:
              logger.error('JOB', `Transaction ${transaction._id} doesn't match any case.`);
              break;
          }
          if (tr) {
            tr.save()
            .then((transaction) => {
              logger.info('JOB', `Transaction ${transaction._id} created.`);
            })
            .catch((error) => {
              logger.info('JOB', error.message, error);
            });
          }
        }
      });
    })
    .catch((error) => {
      logger.error('JOB', error.message, error);
    });
  });
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
