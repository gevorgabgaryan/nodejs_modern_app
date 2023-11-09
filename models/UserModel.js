import {Schema, model} from "mongoose";
import bcrypt from "bcrypt";
import Config from '../config'
import crypto from 'crypto';

const userSchema = Schema({
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
  role: {
    type: String,
    enum: Config.userRoles,
    default: 'user'
  },
  status:  {
    type: String,
    enum: Config.userStatuses,
    default: 'new'
  },
  verificationToken: {
    type: String,
    index: true,
    required: true,
    default:  crypto.randomBytes(16).toString('hex') // 16 bytes are represented as 32 hexadecimal characters
  }

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
}, {
    timestamps: true
});

userSchema.methods.comparePassword = async function comparePassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}

const UserModel = model('user', userSchema)

export default UserModel;

