import {Schema, model} from "mongoose";
import bcrypt from "bcrypt";
import Config from "../../config";
import crypto from "crypto";

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
    minlength: 6,
    triem: true,
  },
  role: {
    type: String,
    enum: Config.userRoles,
    default: "user",
  },
  status: {
    type: String,
    enum: Config.userStatuses,
    default: "new",
  },
  verificationToken: {
    type: String,
    index: true,
    required: true,
    default: crypto.randomBytes(16).toString("hex"), // 16 bytes are represented as 32 hexadecimal characters
  },
  oauthprofiles: [
    {
      provider: {type: String},
      profileId: {type: String},
    },
  ],
  isOnline: {type: Boolean, default: false},
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

userSchema.index({
  "oauthprofiles.provider": 1,
  "outhprofiles.profileId": 1,
});

userSchema.pre(
  "save",
  async function preSave(next) {
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
  }
);

userSchema.methods.comparePassword = async function comparePassword(
  enteredPassword
) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.entitize = function () {
  const args = Array.from(arguments);
  const res = this.toObject({virtuals: true});
  delete res["__v"];
  res["id"] = res["_id"];
  delete res["_id"];
  for (const item of args) {
    delete res[item];
  }
  return res;
};

const UserModel = model("user", userSchema);

export default UserModel;
