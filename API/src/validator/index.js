const { AlbumValidator } = require('./album')
const { SongValidator } = require('./song')
const { UserValidator } = require('./user')
const { AuthenticationValidator } = require('./authentication')
const { PlaylistValidator } = require('./playlist')
const { CollaborationValidator } = require('./collaboration')
const { ExportValidator } = require('./export')

module.exports = {
  AlbumValidator,
  SongValidator,
  UserValidator,
  AuthenticationValidator,
  PlaylistValidator,
  CollaborationValidator,
  ExportValidator
}
