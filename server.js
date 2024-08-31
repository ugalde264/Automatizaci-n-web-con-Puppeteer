require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');

// Define a route for the API
fastify.get('/api/data', async (request, reply) => {
  try {
    // Asynchronous file read
    const data = await fs.promises.readFile(path.join(__dirname, 'data.json'), 'utf-8');
    reply.send(JSON.parse(data));
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to read data' });
  }
});

// Synchronous file read example route
fastify.get('/api/sync-data', (request, reply) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8');
    reply.send(JSON.parse(data));
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to read data synchronously' });
  }
});

// Start the server
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
