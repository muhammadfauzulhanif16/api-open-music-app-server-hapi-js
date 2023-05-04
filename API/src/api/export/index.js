const { ExportHandlers } = require('./handlers')
const { ExportRoutes } = require('./routes')

exports.Export = {
  name: 'export',
  version: '1.0.0',
  register: async (
    server,
    { producerServices, playlistServices, validator }
  ) => {
    server.route(
      ExportRoutes(
        ExportHandlers(producerServices, playlistServices, validator)
      )
    )
  }
}
