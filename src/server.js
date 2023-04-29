require('dotenv').config()
const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

const { Song, Album, User } = require('./api')
const { SongValidator, AlbumValidator, UserValidator } = require('./validator')
const { SongServices, AlbumServices, UserServices } = require('./services')

const { ClientError } = require('./exceptions')

const init = async () => {
  const userServices = UserServices()
  const songServices = SongServices()
  const albumServices = AlbumServices(songServices)

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
      plugin: Song,
      options: {
        songServices,
        validator: SongValidator
      }
    },
    {
      plugin: Album,
      options: {
        albumServices,
        validator: AlbumValidator
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
