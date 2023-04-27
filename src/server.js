require('dotenv').config()
const Hapi = require('@hapi/hapi')

const { Song } = require('./api/song')
const { SongValidator } = require('./validator/song')
const { SongServices } = require('./services/postgre/SongServices')

const { Album } = require('./api/album')
const { AlbumValidator } = require('./validator/album')
const { AlbumServices } = require('./services/postgre/AlbumServices')

const { ClientError } = require('./exceptions')

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  await server.register([
    {
      plugin: Song,
      options: {
        service: SongServices(),
        validator: SongValidator,
      },
    },
    {
      plugin: Album,
      options: {
        service: AlbumServices(),
        validator: AlbumValidator,
      },
    },
  ])

  server.ext('onPreResponse', (req, h) => {
    const { response } = req

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(response.statusCode)
      }

      if (!response.isServer) {
        return h.continue
      }

      return h
        .response({
          status: 'error',
          message: 'terjadi kegagalan pada server kami',
        })
        .code(500)
    }

    return h.continue
  })

  await server.start()
}

init()
