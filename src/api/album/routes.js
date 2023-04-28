exports.AlbumRoutes = (handlers) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (req, h) => handlers.addAlbum(req, h)
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (req, h) => handlers.getAlbum(req, h)
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (req, h) => handlers.editAlbum(req, h)
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (req, h) => handlers.deleteAlbum(req, h)
  }
]
