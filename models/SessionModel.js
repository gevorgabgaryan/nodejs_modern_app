import {Schema, model, Types} from "mongoose";
import Config from '../config';

const sessionSchema = Schema(
  {
    token: {
      type: String,
      index: {unique: true},
    },
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    role: {
      type: String,
      enum: Config.userRoles,
      default: "user",
    }
  },
  {
    timestamps: true,
  }
);

const SessionModel = model('session', sessionSchema);

export default SessionModel;