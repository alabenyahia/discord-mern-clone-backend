const Joi = require("joi");

const newChannelValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
});

const newMessageValidationSchema = Joi.object({
  channelid: Joi.string().alphanum().length(24).required(),
  //TODO dont need userid will use jwt payload id instead
  userid: Joi.string().alphanum().length(24).required(),
  text: Joi.string().required(),
});

module.exports = { newChannelValidationSchema, newMessageValidationSchema };
