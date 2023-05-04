const { AuthenticationHandlers } = require('./handlers')
const { AuthenticationRoutes } = require('./routes')

exports.Authentication = {
  name: 'authentication',
  version: '1.0.0',
  register: async (
    server,
    { validator, tokenManager, userServices, authenticationServices }
  ) => {
    server.route(
      AuthenticationRoutes(
        AuthenticationHandlers(
          validator,
          tokenManager,
          userServices,
          authenticationServices
        )
      )
    )
  }
}
