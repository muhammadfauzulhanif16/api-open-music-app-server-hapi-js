exports.UserRoutes = (handlers) => [
  {
    method: 'POST',
    path: '/users',
    handler: (req, h) => handlers.addUser(req, h)
  }
]
