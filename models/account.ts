
import * as mongoose from 'mongoose';
import IAccount from '../interfaces/account';

const accountSchema: mongoose.Schema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    sum: { type: Number, required: true},
    currency: { type: String, required: true },
    icon: { type: String, required: true },
    inCount: { type: Boolean, required: true }
  }
);

export default mongoose.model<IAccount>('Account', accountSchema)
