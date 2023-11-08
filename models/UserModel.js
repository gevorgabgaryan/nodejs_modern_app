import {Schema, model} from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    minlength: 3,
  },
  lastName: {
    type: String,
    trim: true,
    minlength: 4,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    index: {unique: true},
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    triem: true,
  },
});

userSchema.pre("save", async function preSave(next) {
  const user = this;
  if (user.isModified("password")) {
    try {
      const hash = await bcrypt.hash(user.password, 12);
      user.password = hash;
      return next();
    } catch (e) {
      next(e);
    }
  }
});

const UserModel = model('user', userSchema)

export default UserModel;

