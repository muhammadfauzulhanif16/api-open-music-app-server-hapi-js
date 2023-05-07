require('dotenv').config()
const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const Inert = require('@hapi/inert')
const path = require('path')
const { config } = require('./utils/config')

const {
  Song,
  Album,
  User,
  Authentication,
  Playlist,
  Collaboration,
  Export
} = require('./api')
const {
  SongValidator,
  AlbumValidator,
  UserValidator,
  AuthenticationValidator,
  PlaylistValidator,
  CollaborationValidator,
  ExportValidator
} = require('./validator')
const {
  SongServices,
  AlbumServices,
  UserServices,
  AuthenticationServices,
  PlaylistServices,
  CollaborationServices,
  ProducerServices,
  StorageServices,
  CacheServices
} = require('./services')

const { ClientError } = require('./exceptions')
const { TokenManager } = require('./tokenize/TokenManager')

const init = async () => {
  const cacheServices = CacheServices()
  const userServices = UserServices()
  const authenticationServices = AuthenticationServices()
  const albumServices = AlbumServices(cacheServices)
  const songServices = SongServices()
  const collaborationServices = CollaborationServices()
  const playlistServices = PlaylistServices(collaborationServices)
  const storageServices = StorageServices(
    path.resolve(__dirname, 'api/album/file/covers/')
  )

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: Jwt.plugin
    },
    {
      plugin: Inert.plugin
    }
  ])

  server.auth.strategy('openmusic', 'jwt', {
    keys: config.auth.access.key,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.auth.access.maxAgeSec
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        userId: artifacts.decoded.payload.userId
      }
    })
  })

  await server.register([
    {
      plugin: User,
      options: {
        validators: UserValidator,
        services: userServices
      }
    },
    {
      plugin: Authentication,
      options: {
        validators: AuthenticationValidator,
        userServices,
        tokenManager: TokenManager,
        authenticationServices
      }
    },
    {
      plugin: Album,
      options: {
        validators: AlbumValidator,
        albumServices,
        storageServices
      }
    },
    {
      plugin: Song,
      options: {
        validators: SongValidator,
        services: songServices
      }
    },
    {
      plugin: Collaboration,
      options: {
        validators: CollaborationValidator,
        playlistServices,
        userServices,
        collaborationServices
      }
    },
    {
      plugin: Playlist,
      options: {
        validators: PlaylistValidator,
        playlistServices,
        songServices
      }
    },
    {
      plugin: Export,
      options: {
        validators: ExportValidator,
        playlistServices,
        producerServices: ProducerServices
      }
    }
  ])

  server.ext('onPreResponse', (req, h) => {
    const { response } = req

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: response.message
          })
          .code(response.statusCode)
      }

      if (!response.isServer) {
        return h.continue
      }

      return h
        .response({
          status: 'error',
          message: 'terjadi kegagalan pada server kami'
        })
        .code(500)
    }

    return h.continue
  })

  await server.start()
}

init()
