import * as mongoose from 'mongoose';
import IUser from '../interfaces/user';

const userSchema: mongoose.Schema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    // tokens: [{ token: {type: String, required: true}}],
    settings: {
      language: {type: String, required: true},
      currency: {type: String, required: true},
      totalSum: {type: Number, required: true},
      colorSchema: {type: String, required: true}
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IUser>('User', userSchema)
