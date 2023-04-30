const { AlbumValidator } = require('./album')
const { SongValidator } = require('./song')
const { UserValidator } = require('./user')
const { AuthenticationValidator } = require('./authentication')
const { PlaylistValidator } = require('./playlist')

module.exports = {
  AlbumValidator,
  SongValidator,
  UserValidator,
  AuthenticationValidator,
  PlaylistValidator
}
