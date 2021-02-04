import { Document } from "mongoose";

export default interface IAccount extends Document {
  userId: string;
  name: string;
  sum: number;
  currency: string;
  icon: string;
  inCount: boolean;
}
