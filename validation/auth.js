const Joi = require("joi");

const registerValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = { registerValidationSchema, loginValidationSchema };
