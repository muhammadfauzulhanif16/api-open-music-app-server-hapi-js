const { AlbumServices } = require('./postgre/albumServices')
const { SongServices } = require('./postgre/songServices')
const { UserServices } = require('./postgre/userServices')

module.exports = {
  AlbumServices,
  SongServices,
  UserServices
}
