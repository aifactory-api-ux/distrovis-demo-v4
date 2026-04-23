import { Pedido } from '../../../shared/models';
import { publishMessage } from '../config/rabbitmq';

export async function publishPedidoCreado(pedido: Pedido): Promise<void> {
  const event = {
    event: 'pedido_creado',
    timestamp: new Date().toISOString(),
    data: pedido,
  };

  try {
    await publishMessage('pedido.creado', event);
    console.log('Published pedido_creado event:', pedido.id);
  } catch (error) {
    console.error('Failed to publish pedido_creado event:', error);
    throw error;
  }
}