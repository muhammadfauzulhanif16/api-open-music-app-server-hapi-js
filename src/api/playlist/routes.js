exports.PlaylistRoutes = (handlers) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (req, h) => handlers.addPlaylist(req, h)
  }
]
