import Joi from 'joi';

export const catalogoSchema = Joi.object({
  nombre: Joi.string().max(255).required(),
  descripcion: Joi.string().required(),
  precio: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
});

export const catalogoUpdateSchema = Joi.object({
  nombre: Joi.string().max(255).optional(),
  descripcion: Joi.string().optional(),
  precio: Joi.number().positive().optional(),
  stock: Joi.number().integer().min(0).optional(),
}).min(1);

export const pedidoSchema = Joi.object({
  usuario_id: Joi.number().integer().positive().required(),
  fecha: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  estado: Joi.string().max(50).required(),
  total: Joi.number().min(0).required(),
  items: Joi.array().items(
    Joi.object({
      catalogo_id: Joi.number().integer().positive().required(),
      cantidad: Joi.number().integer().positive().required(),
      precio_unitario: Joi.number().min(0).required(),
    })
  ).min(1).required(),
});

export const pedidoUpdateSchema = Joi.object({
  estado: Joi.string().max(50).optional(),
}).min(1);

export const pedidoItemSchema = Joi.object({
  catalogo_id: Joi.number().integer().positive().required(),
  cantidad: Joi.number().integer().positive().required(),
  precio_unitario: Joi.number().min(0).required(),
});

export const usuarioSchema = Joi.object({
  nombre: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  rol: Joi.string().max(50).required(),
});

export const usuarioUpdateSchema = Joi.object({
  nombre: Joi.string().max(255).optional(),
  email: Joi.string().email().max(255).optional(),
  rol: Joi.string().max(50).optional(),
}).min(1);

export const notificacionSchema = Joi.object({
  pedido_id: Joi.number().integer().positive().required(),
  tipo: Joi.string().max(50).required(),
  mensaje: Joi.string().required(),
  fecha_envio: Joi.string().isoDate().required(),
});

export function validateBody<T>(schema: Joi.ObjectSchema<T>, data: any): T {
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details.map(d => d.message).join(', ');
    throw new Error(`Validation error: ${details}`);
  }
  return value;
}