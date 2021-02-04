import { Document } from "mongoose";

export default interface IUser extends Document {
  username: string;
  password: string;
  // tokens: tokens;
  settings: settings;
}

export interface tokens {
  token: string;
};

export interface settings {
  language: string;
  currency: string;
  totalSum: number;
  colorSchema: string;
};
