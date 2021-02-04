import * as mongoose from 'mongoose';
import ITransaction from '../interfaces/transaction';

const transactionSchema: mongoose.Schema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    accountId: { type: String, required: true },
    type: { type: String, required: true },
    sum: { type: Number, required: true },
    income: {type: Boolean, required: true },
    repeat: { type: Boolean },
    delay: { type: String },
    day: { type: Number },
    reference: { type: String }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITransaction>('Transaction', transactionSchema)
