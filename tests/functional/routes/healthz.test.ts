import { Express } from 'express';
import request from 'supertest';
import App from '../../../src/main';

describe(__filename, () => {
  let app: App;
  let expressServer: Express;

  beforeAll(async () => {
    app = new App(false);
    await app.init();

    expressServer = app.expressServer;
  });

  describe('GET', () => {
    it('/healthz should return true', async () => {
      const res = await request(expressServer).get('/healthz');

      expect(res.body).toEqual({ healthy: true });
      expect(res.statusCode).toEqual(200);
    });
  });
});
