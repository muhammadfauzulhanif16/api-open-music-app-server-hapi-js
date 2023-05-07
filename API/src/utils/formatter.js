exports.mapDBToAlbumModel = ({ id, name, year, cover }) => ({
  id,
  name,
  year,
  coverUrl: cover
})

exports.mapDBToSongModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id: albumId
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId
})

exports.mapDBToSongsModel = ({ id, title, performer }) => ({
  id,
  title,
  performer
})

exports.mapDBToPlaylistModel = ({ id, name, username }) => ({
  id,
  name,
  username
})

exports.mapDBToActivitiesModel = ({
  username,
  title,
  action,
  created_at: time
}) => ({
  username,
  title,
  action,
  time
})
