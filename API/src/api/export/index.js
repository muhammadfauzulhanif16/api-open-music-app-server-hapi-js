const { ExportHandlers } = require('./handlers')
const { ExportRoutes } = require('./routes')

exports.Export = {
  name: 'export',
  version: '1.0.0',
  register: async (
    server,
    { validators, playlistServices, producerServices }
  ) => {
    server.route(
      ExportRoutes(
        ExportHandlers(validators, playlistServices, producerServices)
      )
    )
  }
}
