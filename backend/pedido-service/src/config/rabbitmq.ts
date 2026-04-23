import amqp, { Channel, Connection } from 'amqplib';
import * as dotenv from 'dotenv';

dotenv.config();

const rabbitmqHost = process.env.RABBITMQ_HOST || 'localhost';
const rabbitmqPort = parseInt(process.env.RABBITMQ_PORT || '5672', 10);
const rabbitmqUser = process.env.RABBITMQ_USER || 'guest';
const rabbitmqPassword = process.env.RABBITMQ_PASSWORD || 'guest';

const amqpUrl = `amqp://${rabbitmqUser}:${rabbitmqPassword}@${rabbitmqHost}:${rabbitmqPort}`;

let connection: Connection | null = null;
let channel: Channel | null = null;

export async function getRabbitMQChannel(): Promise<Channel> {
  if (channel) {
    return channel;
  }

  connection = await amqp.connect(amqpUrl);
  channel = await connection.createChannel();

  await channel.assertExchange('pedido_events', 'topic', { durable: true });

  return channel;
}

export async function publishMessage(routingKey: string, message: any): Promise<void> {
  const ch = await getRabbitMQChannel();
  const messageBuffer = Buffer.from(JSON.stringify(message));
  ch.publish('pedido_events', routingKey, messageBuffer, { persistent: true });
}

export async function closeRabbitMQ(): Promise<void> {
  if (channel) {
    await channel.close();
    channel = null;
  }
  if (connection) {
    await connection.close();
    connection = null;
  }
}