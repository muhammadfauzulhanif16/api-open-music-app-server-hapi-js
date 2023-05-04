require('dotenv').config()
const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const Inert = require('@hapi/inert')

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
  ProducerServices
} = require('./services')

const { ClientError } = require('./exceptions')
const { TokenManager } = require('./tokenize/TokenManager')

const init = async () => {
  const userServices = UserServices()
  const authenticationServices = AuthenticationServices()
  const albumServices = AlbumServices()
  const songServices = SongServices(albumServices)
  const collaborationServices = CollaborationServices()
  const playlistServices = PlaylistServices(collaborationServices)

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
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
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: User,
      options: {
        userServices,
        validator: UserValidator
      }
    },
    {
      plugin: Authentication,
      options: {
        authenticationServices,
        userServices,
        tokenManager: TokenManager,
        validator: AuthenticationValidator
      }
    },
    {
      plugin: Album,
      options: {
        albumServices,
        validator: AlbumValidator
      }
    },
    {
      plugin: Song,
      options: {
        songServices,
        validator: SongValidator
      }
    },
    {
      plugin: Collaboration,
      options: {
        collaborationServices,
        playlistServices,
        userServices,
        validator: CollaborationValidator
      }
    },
    {
      plugin: Playlist,
      options: {
        playlistServices,
        songServices,
        validator: PlaylistValidator
      }
    },
    {
      plugin: Export,
      options: {
        producerServices: ProducerServices,
        playlistServices,
        validator: ExportValidator
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
