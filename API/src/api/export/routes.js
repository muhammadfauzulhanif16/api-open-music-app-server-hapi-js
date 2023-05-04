exports.ExportRoutes = (handlers) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: (req, h) => handlers.addExportPlaylist(req, h),
    options: {
      auth: 'openmusic'
    }
  }
]
