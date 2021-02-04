import { Document } from "mongoose";

export default interface ITransaction extends Document {
  userId: string;
  accountId: string;
  type: string;
  sum: number;
  income: boolean;
  repeat?: boolean;
  delay?: string;
  day?: number;
  createdAt?: Date;
  reference?: string;
}
