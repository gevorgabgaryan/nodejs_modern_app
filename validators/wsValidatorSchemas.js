import Joi from 'joi'

export const wsTokenSchema = Joi.object({
  token: Joi.string().required()
})
