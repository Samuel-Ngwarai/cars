import { Express } from 'express';
import request from 'supertest';
import * as uuid from 'uuid';
import mongoose from 'mongoose';

import { CreateCarMetadata } from '../../src/entities/car';
import App from '../../src/main';
import { MongoDBService } from '../../src/services/mongodb-service';

jest.mock('uuid');

describe(__filename, () => {
  let app: App;
  let expressServer: Express;
  let mongoDBDatabase: MongoDBService;

  beforeAll(async (done) => {
    app = new App(false);
    await app.init(true);

    expressServer = app.expressServer;
    mongoDBDatabase = app.mongoDBService;
    const uuidSpy = jest.spyOn(uuid, 'v4');
    uuidSpy.mockReturnValue('mocked_uuid');

    // clean database
    await mongoDBDatabase['CarModel'].deleteMany({});
    done();
  });

  afterAll(async() => {

    await mongoDBDatabase['CarModel'].deleteMany({});
    await mongoose.disconnect();
  });

  describe('GET', () => {
    it('/createCar should return createdCar', async () => {
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
      };

      expect(res.body).toEqual(expected);
      expect(res.statusCode).toEqual(200);
    });

    it('/createCar should fail for invalid input', async () => {
      const requestBody: CreateCarMetadata = {
        model: 'someModel',
        color: 'someColor',
        brand: 'someBrand',
        people: 50,
        distance: 5000
      };

      const res = await request(expressServer).post('/createCar').send(requestBody);

      expect(res.statusCode).toEqual(422);
      expect(res.body?.message).toEqual('[{"instancePath":"/people","schemaPath":"#/properties/people/maximum","keyword":"maximum","params":{"comparison":"<=","limit":10},"message":"must be <= 10"}]');
    });
  });
});
