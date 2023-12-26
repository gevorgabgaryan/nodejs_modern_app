import { Schema, model } from 'mongoose'
import crypto from 'crypto'

const resetTokenSchema = Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    token: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: () => crypto.randomBytes(16).toString('hex')
    }
  },
  {
    timestamps: true
  }
)

resetTokenSchema.index({ createAt: 1 }, { expireAfterSeconds: 3600 })
const ResetTokenModel = model('resetToken', resetTokenSchema)

export default ResetTokenModel
