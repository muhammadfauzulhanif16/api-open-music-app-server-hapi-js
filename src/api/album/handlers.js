exports.AlbumHandlers = (service, validator) => {
  const postAlbumHandler = async (req, h) => {
    validator.validateAlbumPayload(req.payload)
    const albumId = await service.postAlbumService(req.payload)

    return h
      .response({
        status: 'success',
        data: {
          albumId,
        },
      })
      .code(201)
  }

  const getAlbumByIdHandler = async (req) => {
    const album = await service.getAlbumByIdService(req.params.id)

    return {
      status: 'success',
      data: {
        album,
      },
    }
  }

  const putAlbumByIdHandler = async (req) => {
    validator.validateAlbumPayload(req.payload)
    await service.putAlbumByIdService(req.params.id, req.payload)

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    }
  }

  const deleteAlbumByIdHandler = async (req) => {
    await service.deleteAlbumByIdService(req.params.id)

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    }
  }

  return {
    postAlbumHandler,
    getAlbumByIdHandler,
    putAlbumByIdHandler,
    deleteAlbumByIdHandler,
  }
}
