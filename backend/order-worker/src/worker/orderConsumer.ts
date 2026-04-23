import amqplib, { Connection, Channel, ConsumeMessage } from 'amqplib';
import { updateInventory } from '../services/inventoryService';

let connection: Connection | null = null;
let channel: Channel | null = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
const QUEUE_NAME = 'order.created';

export const startOrderConsumer = async (): Promise<void> => {
  try {
    connection = await amqplib.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`Order worker waiting for messages in queue: ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (msg: ConsumeMessage | null) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log('Received order event:', content);

          await updateInventory(content);

          channel?.ack(msg);
          console.log('Order processed and acknowledged');
        } catch (error) {
          console.error('Error processing order:', error);
          channel?.nack(msg, false, true);
        }
      }
    });

    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
    });

    connection.on('close', () => {
      console.log('RabbitMQ connection closed');
    });
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
};

export const stopOrderConsumer = async (): Promise<void> => {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    console.log('Order consumer stopped');
  } catch (error) {
    console.error('Error stopping order consumer:', error);
    throw error;
  }
};