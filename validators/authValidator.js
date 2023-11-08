import Joi from "joi";
import {passwordPattern} from "../utils/constants";

export const registerBodySchema = Joi.object({
  firstName: Joi.string().min(3).max(200),
  lastName: Joi.string().min(3).max(200),
  email: Joi.string().email().required().max(40),
  password: Joi.string()
    .regex(RegExp(passwordPattern))
    .required()
    .min(6)
    .max(20),
});

export const loginBodySchema = Joi.object({
  email: Joi.string().email().required().max(40),
  password: Joi.string()
    .regex(RegExp(passwordPattern))
    .required()
    .min(6)
    .max(20),
});
