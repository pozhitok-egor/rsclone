import * as express from 'express';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as mongoose from 'mongoose';

import userRouter from './routes/user';
import accountsRouter from './routes/account';
import transactionsRouter from './routes/transaction';
import config from './config';
import logging from './logger';

const NAMESPACE = 'Server';

var app = express();

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then(result => {
      logging.info(NAMESPACE, 'Connected to MongoDB!');
    })
    .catch(error => {
      logging.error(NAMESPACE, error.message, error);
    })

app.use(logger('dev'));
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));

app.use('/users', userRouter);
app.use('/accounts', accountsRouter);
app.use('/transactions', transactionsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.json({
    statusCode: 404
  });
});

// error handler
app.use(function(err, req, res, next) {
  res.json({
    statusCode: 500,
    message: err.message,
    stack: err.stack
  });
});

export default app;
