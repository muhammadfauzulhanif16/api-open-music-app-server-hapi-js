const Joi = require('joi')

exports.Email = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required()
})
