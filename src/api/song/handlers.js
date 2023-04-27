exports.SongHandlers = (service, validator) => {
  const postSongHandler = async (req, h) => {
    validator.validateSongPayload(req.payload)
    const songId = await service.postSongService(req.payload)

    return h
      .response({
        status: 'success',
        data: {
          songId,
        },
      })
      .code(201)
  }

  const getSongsHandler = async (req) => {
    const songs = await service.getSongsService(req.query)

    return {
      status: 'success',
      data: {
        songs,
      },
    }
  }

  const getSongByIdHandler = async (req) => {
    const song = await service.getSongByIdService(req.params.id)

    return {
      status: 'success',
      data: {
        song,
      },
    }
  }

  const putSongByIdHandler = async (req) => {
    validator.validateSongPayload(req.payload)
    await service.putSongByIdService(req.params.id, req.payload)

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    }
  }

  const deleteSongByIdHandler = async (req) => {
    await service.deleteSongByIdService(req.params.id)

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    }
  }

  return {
    postSongHandler,
    getSongsHandler,
    getSongByIdHandler,
    putSongByIdHandler,
    deleteSongByIdHandler,
  }
}
