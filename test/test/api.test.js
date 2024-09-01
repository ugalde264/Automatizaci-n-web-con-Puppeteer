const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const fastify = require('fastify')({ logger: true });
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');


require('../server'); 

chai.use(chaiHttp);

describe('API Routes', function() {
  this.timeout(10000); 

  before(async () => {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  });

  after(async () => {
    await fastify.close();
  });

  it('should return data from /api/data', async () => {
    const res = await chai.request(fastify.server).get('/api/data');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.conferences).to.be.an('array');
    expect(res.body.conferences).to.have.lengthOf(3);
  });

  it('should return a screenshot from /api/screenshot', async () => {
    const res = await chai.request(fastify.server).get('/api/screenshot?url=https://www.google.com');
    expect(res).to.have.status(200);
    
    expect(res.headers['content-type']).to.include('image/png');
  });
});
