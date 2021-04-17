import { Express } from 'express';
import request from 'supertest';
import App from '../../../src/main';

describe(__filename, () => {
  let app: App;
  let expressServer: Express;

  beforeAll(async () => {
    app = new App(false);
    await app.init(false);

    expressServer = app.expressServer;
  });

  describe('GET', () => {
    it('/healthz should return true', async () => {
      const res = await request(expressServer).get('/healthz');

      expect(res.body).toEqual({ healthy: true });
      expect(res.statusCode).toEqual(200);
    });

    it('/readyz should return true', async () => {
      const res = await request(expressServer).get('/readyz');

      expect(res.body).toEqual({ ready: true });
      expect(res.statusCode).toEqual(200);
    });

    it('/ should return error', async () => {
      const res = await request(expressServer).get('/');

      expect(res.statusCode).toEqual(404);
      expect(res.error.text).toEqual('Uknown route called. Try "/createCar" for example');
    });

    it('/ random Routes should return error', async () => {
      const res = await request(expressServer).get('/randomRoute');

      expect(res.statusCode).toEqual(404);
      expect(res.error.text).toEqual('Uknown route called. Try "/createCar" for example');
    });
  });
});
