exports.PlaylistHandlers = (validator, songServices, playlistServices) => {
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
    await playlistServices.verifyAccess(req.params.id, req.auth.credentials.id)

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

  const getActivities = async (req) => {
    await playlistServices.verifyOwner(req.params.id, req.auth.credentials.id)

    const playlistId = await playlistServices.verifyPlaylist(req.params.id)
    const activities = await playlistServices.getActivities(req.params.id)

    return {
      status: 'success',
      data: {
        playlistId,
        activities
      }
    }
  }

  const deletePlaylist = async (req) => {
    await playlistServices.verifyOwner(req.params.id, req.auth.credentials.id)

    await playlistServices.deletePlaylist(req.params.id)

    return {
      status: 'success',
      message: 'Daftar putar berhasil dihapus'
    }
  }

  const addSong = async (req, h) => {
    validator.validateSongToPlaylistPayload(req.payload)

    await playlistServices.verifyAccess(req.params.id, req.auth.credentials.id)
    await songServices.getSong(req.payload.songId)
    await playlistServices.verifySong(req.payload.songId)
    await playlistServices.addSong(
      req.params.id,
      req.auth.credentials.id,
      req.payload.songId
    )

    return h
      .response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke daftar putar'
      })
      .code(201)
  }

  const deleteSong = async (req) => {
    console.log(req.payload)
    validator.validateSongToPlaylistPayload(req.payload)

    await playlistServices.verifyAccess(req.params.id, req.auth.credentials.id)
    await songServices.getSong(req.payload.songId)

    await playlistServices.deleteSong(
      req.params.id,
      req.payload.songId,
      req.auth.credentials.id
    )

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari daftar putar'
    }
  }

  return {
    addPlaylist,
    addSong,
    getPlaylist,
    getPlaylists,
    getActivities,
    deletePlaylist,
    deleteSong
  }
}
