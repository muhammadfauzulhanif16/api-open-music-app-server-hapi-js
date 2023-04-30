exports.PlaylistRoutes = (handlers) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (req, h) => handlers.addPlaylist(req, h),
    options: {
      auth: 'openmusic'
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (req, h) => handlers.deletePlaylist(req, h),
    options: {
      auth: 'openmusic'
    }
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (req, h) => handlers.getPlaylists(req, h),
    options: {
      auth: 'openmusic'
    }
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (req, h) => handlers.addSongToPlaylist(req, h),
    options: {
      auth: 'openmusic'
    }
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (req, h) => handlers.getPlaylist(req, h),
    options: {
      auth: 'openmusic'
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (req, h) => handlers.deleteSongFromPlaylist(req, h),
    options: {
      auth: 'openmusic'
    }
  }
]
