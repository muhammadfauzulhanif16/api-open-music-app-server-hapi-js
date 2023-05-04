exports.Listener = (noteServices, mailSender) => {
  const listen = async (message) => {
    try {
      const { userId, targetEmail } = JSON.parse(message.content.toString())

      const notes = await noteServices.getNotes(userId)
      const result = await mailSender.sendEmail(targetEmail, JSON.stringify(notes))
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    listen
  }
}
