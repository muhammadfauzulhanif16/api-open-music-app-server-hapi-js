require('dotenv').config();
const amqp = require('amqplib');
const { NoteServices } = require('./NoteServices');
const { MailSender } = require('./MailSender');
const { Listener } = require('./listener');

const init = async () => {
  const noteServices = NoteServices();
  const mailSender = MailSender();
  const listener = Listener(noteServices, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:notes', {
    durable: true,
  });

  await channel.consume('export:notes', listener.listen, {noAck: true});
}

init();
