require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Ruta para tomar una captura de pantalla
fastify.get('/api/screenshot', async (request, reply) => {
  const url = request.query.url || 'https://www.google.com';

  try {
    // Lanzar un navegador
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Navegar a la URL proporcionada
    await page.goto(url);
    
    // Tomar una captura de pantalla
    const screenshotPath = path.join(__dirname, 'screenshot.png');
    await page.screenshot({ path: screenshotPath });

    // Cerrar el navegador
    await browser.close();

    reply.sendFile('screenshot.png');
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: 'Failed to take screenshot' });
  }
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

// Ruta para la raíz
fastify.get('/', async (request, reply) => {
  reply.send({ message: 'Bienvenido a la API de conferencias!' });
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
