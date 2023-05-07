const { AddPlaylist, Song } = require('./schema')
const { InvariantError } = require('../../exceptions')

exports.PlaylistValidator = {
  addPlaylist: (payload) => {
    if (AddPlaylist.validate(payload).error) {
      throw new InvariantError(AddPlaylist.validate(payload).error.message)
    }
  },
  song: (payload) => {
    if (Song.validate(payload).error) {
      throw new InvariantError(Song.validate(payload).error.message)
    }
  }
}
