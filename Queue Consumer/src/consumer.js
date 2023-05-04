require('dotenv').config();
const amqp = require('amqplib');
const { PlaylistServices } = require('./PlaylistServices');
const { MailSender } = require('./MailSender');
const { Listener } = require('./listener');

const init = async () => {
  const playlistServices = PlaylistServices();
  const mailSender = MailSender();
  const listener = Listener(playlistServices, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlist', {
    durable: true,
  });

  await channel.consume('export:playlist', listener.listen, {noAck: true});
}

init();
