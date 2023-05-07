const Joi = require('joi')

exports.AddAuthentication = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

exports.EditAuthentication = Joi.object({
  refreshToken: Joi.string().required()
})

exports.DeleteAuthentication = Joi.object({
  refreshToken: Joi.string().required()
})
