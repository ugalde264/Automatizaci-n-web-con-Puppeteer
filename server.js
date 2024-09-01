require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');

// Ruta para la raíz
fastify.get('/', async (request, reply) => {
  reply.send({ message: 'Hola a mi Fastify API!' });
});

// Ruta para leer datos de forma asincrónica
fastify.get('/api/data', async (request, reply) => {
  try {
    const data = await fs.promises.readFile(path.join(__dirname, 'data.json'), 'utf-8');
    reply.send(JSON.parse(data));
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to read data' });
  }
});

// Ruta para leer datos de forma sincrónica
fastify.get('/api/sync-data', (request, reply) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8');
    reply.send(JSON.parse(data));
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to read data synchronously' });
  }
});

// Iniciar el servidor
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    fastify.log.info(`Server running at http://localhost:${process.env.PORT || 3000}/`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
