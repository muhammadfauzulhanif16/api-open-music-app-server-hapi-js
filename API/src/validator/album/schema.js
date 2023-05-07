const Joi = require('joi')

exports.Album = Joi.object({
  name: Joi.string().required().min(1),
  year: Joi.number().required().min(1900).positive()
})

exports.AddAlbumCover = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg'
    )
    .required()
}).unknown()
