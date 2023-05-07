exports.SongHandlers = (validators, services) => {
  const addSong = async (req, h) => {
    validators.song(req.payload)

    const songId = await services.addSong(req.payload)

    return h
      .response({
        status: 'success',
        data: {
          songId
        }
      })
      .code(201)
  }

  const getSong = async (req) => {
    const song = await services.getSong(req.params.id)

    return {
      status: 'success',
      data: {
        song
      }
    }
  }

  const getSongs = async (req) => {
    const songs = await services.getSongs(req.query)

    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  const editSong = async (req) => {
    validators.song(req.payload)

    await services.getSong(req.params.id)
    await services.editSong(req.params.id, req.payload)

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui'
    }
  }

  const deleteSong = async (req) => {
    await services.getSong(req.params.id)
    await services.deleteSong(req.params.id)

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    }
  }

  return {
    addSong,
    getSong,
    getSongs,
    editSong,
    deleteSong
  }
}
