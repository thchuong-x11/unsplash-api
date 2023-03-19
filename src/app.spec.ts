import supertest, { SuperAgentTest } from 'supertest';
import * as http from 'http';

import { app } from './app';
import { ANALYZE_SERVICE } from './init';
jest.mock('./init');

const testPort = 6666;

describe('app', () => {
  let server: http.Server;
  let agent: SuperAgentTest;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen({ port: testPort }, done);
    agent = supertest.agent(server);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /analyze', () => {
    describe('Errors handling', () => {
      it('Should return HTTP 400 if there is no body', async () => {
        await agent.post('/analyze').expect(400);
      });

      it('Should return HTTP 400 if the body does not have all required properties', async () => {
        await agent.post('/analyze').send({ keyword: 'hello' }).expect(400);
      });

      it('Should return HTTP 400 if the properties do not respect their constraints', async () => {
        await agent
          .post('/analyze')
          .send({ keyword: 'hello', labels: [] })
          .expect(400);
      });

      it('Should return HTTP 500 if the analyze service returns an error of that status code', async () => {
        (ANALYZE_SERVICE.analyze as any).mockResolvedValueOnce({
          success: false,
          status: 500,
          errors: ['Expected errors'],
        });
        await agent
          .post('/analyze')
          .send({ keyword: 'hello', labels: ['hello'] })
          .expect(500)
          .expect(({ body }) => {
            expect(body).toMatchObject({
              success: false,
              errors: ['Expected errors'],
            });
          });
      });
    });

    describe('Functional tests', () => {
      it('Should return HTTP 200 if there is no error', async () => {
        (ANALYZE_SERVICE.analyze as any).mockResolvedValueOnce({
          success: true,
          keyword: 'hello',
          total: 0,
          matches: [],
        });
        await agent
          .post('/analyze')
          .send({ keyword: 'hello', labels: ['world'] })
          .expect(200)
          .expect(({ body }) => {
            expect(body).toMatchObject({
              success: true,
              keyword: 'hello',
              total: 0,
              matches: [],
            });
          });
      });
    });
  });
});
