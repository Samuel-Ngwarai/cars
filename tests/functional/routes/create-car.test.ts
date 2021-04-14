import { Express } from 'express';
import request from 'supertest';
import * as uuid from 'uuid';

import { CreateCarMetadata } from '../../../src/entities/car';
import App from '../../../src/main';

jest.mock('uuid');

describe(__filename, () => {
  let app: App;
  let expressServer: Express;

  beforeAll(async () => {
    app = new App(false);
    await app.init();

    expressServer = app.expressServer;
  });

  describe('GET', () => {
    it('/createCar should return createdCar', async () => {
      const uuidSpy = jest.spyOn(uuid, 'v4');
      uuidSpy.mockReturnValue('mocked_uuid');
      const requestBody: CreateCarMetadata = {
        model: 'someModel',
        color: 'someColor',
        brand: 'someBrand',
        people: 5,
        distance: 5000
      };
      const res = await request(expressServer).post('/createCar').send(requestBody);

      const expected = {
        id: 'mocked_uuid',
        ...requestBody,
      }

      expect(res.body).toEqual(expected);
      expect(res.statusCode).toEqual(200);
    });

    it('/createCar should fail for invalid input', async () => {
      const uuidSpy = jest.spyOn(uuid, 'v4');
      uuidSpy.mockReturnValue('mocked_uuid');
      const requestBody: CreateCarMetadata = {
        model: 'someModel',
        color: 'someColor',
        brand: 'someBrand',
        people: 50,
        distance: 5000
      };

      const res = await request(expressServer).post('/createCar').send(requestBody);

      expect(res.statusCode).toEqual(500);
      expect(res.error.text).toEqual('Something broke!');
    });
  });
});
