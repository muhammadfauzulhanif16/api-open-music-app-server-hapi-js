const { UserHandlers } = require('./handlers')
const { UserRoutes } = require('./routes')

exports.User = {
  name: 'user',
  version: '1.0.0',
  register: async (server, { validators, services }) => {
    server.route(UserRoutes(UserHandlers(validators, services)))
  }
}
