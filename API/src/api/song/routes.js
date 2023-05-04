exports.SongRoutes = (handlers) => [
  {
    method: 'POST',
    path: '/songs',
    handler: (req, h) => handlers.addSong(req, h)
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (req, h) => handlers.getSong(req, h)
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (req, h) => handlers.getSongs(req, h)
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (req, h) => handlers.editSong(req, h)
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (req, h) => handlers.deleteSong(req, h)
  }
]
