const { Song } = require('./schema')
const { InvariantError } = require('../../exceptions')

exports.SongValidator = {
  song: (payload) => {
    if (Song.validate(payload).error) {
      throw new InvariantError(Song.validate(payload).error.message)
    }
  }
}
