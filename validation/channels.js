const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const newChannelValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
});

const newMessageValidationSchema = Joi.object({
  channelid: Joi.objectId().required(),
  text: Joi.string().required(),
});

module.exports = { newChannelValidationSchema, newMessageValidationSchema };
