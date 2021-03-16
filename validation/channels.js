const Joi = require("joi");

const newChannelValidationSchema = Joi.object({
  name: Joi.string().min(3).required(),
});

module.exports = newChannelValidationSchema;
