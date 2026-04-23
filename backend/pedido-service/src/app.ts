import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import catalogoRouter from './routes/catalogo';
import pedidoRouter from './routes/pedido';
import usuarioRouter from './routes/usuario';
import notificacionRouter from './routes/notificacion';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'pedido-service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.use('/catalogo', catalogoRouter);
app.use('/pedidos', pedidoRouter);
app.use('/usuarios', usuarioRouter);
app.use('/notificaciones', notificacionRouter);

app.use(errorHandler);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: { message: 'Not Found', statusCode: 404 } });
});

export default app;