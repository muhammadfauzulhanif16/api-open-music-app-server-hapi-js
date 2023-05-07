const path = require('path')

exports.AlbumRoutes = (handlers) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (req, h) => handlers.addAlbum(req, h)
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (req, h) => handlers.addCover(req, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000
      }
    }
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (req, h) => handlers.addLike(req, h),
    options: {
      auth: 'openmusic'
    }
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (req, h) => handlers.getAlbum(req, h)
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (req, h) => handlers.getLikes(req, h)
  },
  {
    method: 'GET',
    path: '/albums/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file')
      }
    }
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (req, h) => handlers.editAlbum(req, h)
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: (req, h) => handlers.deleteLike(req, h),
    options: {
      auth: 'openmusic'
    }
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (req, h) => handlers.deleteAlbum(req, h)
  }
]
