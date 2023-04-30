exports.PlaylistHandlers = (playlistServices, songServices, validator) => {
  const addPlaylist = async (req, h) => {
    validator.validatePlaylistPayload(req.payload)

    const playlistId = await playlistServices.addPlaylist(
      req.payload.name,
      req.auth.credentials.id
    )

    return h
      .response({
        status: 'success',
        data: {
          playlistId
        }
      })
      .code(201)
  }

  const getPlaylist = async (req) => {
    await playlistServices.verifyPlaylistOwner(
      req.params.id,
      req.auth.credentials.id
    )

    const playlist = await playlistServices.getPlaylist(req.params.id)

    return {
      status: 'success',
      data: {
        playlist
      }
    }
  }

  const getPlaylists = async (req) => {
    const playlists = await playlistServices.getPlaylists(
      req.auth.credentials.id
    )

    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  const deletePlaylist = async (req) => {
    await playlistServices.verifyPlaylistOwner(
      req.params.id,
      req.auth.credentials.id
    )

    await playlistServices.deletePlaylist(req.params.id)

    return {
      status: 'success',
      message: 'Daftar putar berhasil dihapus'
    }
  }

  const addSongToPlaylist = async (req, h) => {
    validator.validateSongToPlaylistPayload(req.payload)

    await playlistServices.verifyPlaylistOwner(
      req.params.id,
      req.auth.credentials.id
    )
    await songServices.getSong(req.payload.songId)
    await playlistServices.verifySongOnPlaylist(req.payload.songId)
    await playlistServices.addSongToPlaylist(req.params.id, req.payload.songId)

    return h
      .response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke daftar putar'
      })
      .code(201)
  }

  const deleteSongFromPlaylist = async (req) => {
    validator.validateSongToPlaylistPayload(req.payload)

    await playlistServices.verifyPlaylistOwner(
      req.params.id,
      req.auth.credentials.id
    )
    await songServices.getSong(req.payload.songId)

    await playlistServices.deleteSongFromPlaylist(
      req.params.id,
      req.payload.songId
    )

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari daftar putar'
    }
  }

  return {
    addPlaylist,
    getPlaylist,
    getPlaylists,
    deletePlaylist,
    addSongToPlaylist,
    deleteSongFromPlaylist
  }
}
