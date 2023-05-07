const { AlbumServices } = require('./postgre/albumServices')
const { SongServices } = require('./postgre/songServices')
const { UserServices } = require('./postgre/userServices')
const { AuthenticationServices } = require('./postgre/authenticationServices')
const { PlaylistServices } = require('./postgre/playlistServices')
const { CollaborationServices } = require('./postgre/collaborationServices')
const { ProducerServices } = require('./rabbitmq/producerServices')
const { StorageServices } = require('./storage/storageServices')
const { CacheServices } = require('./redis/cacheServices')

module.exports = {
  AlbumServices,
  SongServices,
  UserServices,
  AuthenticationServices,
  PlaylistServices,
  CollaborationServices,
  ProducerServices,
  StorageServices,
  CacheServices
}
