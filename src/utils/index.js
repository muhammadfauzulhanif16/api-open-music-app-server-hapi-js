exports.mapDBToAlbumModel = ({ id, name, year }, songs) => ({
  id,
  name,
  year,
  songs,
})

exports.mapDBToSongModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id: albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
})

exports.mapDBToSongsModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
})
