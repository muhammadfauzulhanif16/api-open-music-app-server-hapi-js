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
  performer,
  genre,
  duration,
  album_id: albumId,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
})

exports.mapDBToSongsModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
})

exports.mapDBToPlaylistsModel = ({ id, name, username }) => ({
  id,
  name,
  username,
})

exports.mapDBToPlaylistModel = ({ id, name, username }, songs) => ({
  id,
  name,
  username,
  songs,
})

exports.mapDBToActivitiesModel = ({
  username,
  title,
  action,
  created_at: time,
}) => ({
  username,
  title,
  action,
  time,
})
