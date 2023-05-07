const { Album, AddAlbumCover } = require('./schema')
const { InvariantError } = require('../../exceptions')

exports.AlbumValidator = {
  album: (payload) => {
    if (Album.validate(payload).error) {
      throw new InvariantError(Album.validate(payload).error.message)
    }
  },
  addAlbumCover: (headers) => {
    if (AddAlbumCover.validate(headers).error) {
      throw new InvariantError(AddAlbumCover.validate(headers).error.message)
    }
  }
}
