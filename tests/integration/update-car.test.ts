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


  beforeAll(async () => {
    app = new App(false);
    await app.init(true);

    expressServer = app.expressServer;
    mongoDBDatabase = app.mongoDBService;

    const uuidSpy = jest.spyOn(uuid, 'v4');
    uuidSpy.mockReturnValue('mocked_uuid');

    // clean database
    await mongoDBDatabase['CarModel'].remove({});
  });

  afterAll(async() => {
    // clean database
    await mongoDBDatabase['CarModel'].remove({});

    mongoose.disconnect();
  });

  describe('GET', () => {

    beforeAll(async () => {
      const requestBody: CreateCarMetadata = {
        model: 'someModel',
        color: 'someColor',
        brand: 'someBrand',
        people: 5,
        distance: 5000
      };
      await request(expressServer).post('/createCar').send(requestBody);
    });

    it('/updateCar should update Existing Car', async () => {
      const requestBody = {
        id: 'mocked_uuid',
        model: 'newCarModel',
        people: 2,
        distance: 5000
      };
      const res = await request(expressServer).put('/updateCar').send(requestBody);;

      expect(res.body).toEqual({ message: 'Update Successful' });
      expect(res.statusCode).toEqual(200);
    });

    it('/updateCar should fail for invalid input', async () => {
      const requestBody = {
        id: 'mocked_uuid',
        model: 'someModel',
        color: 'someColor',
        brand: 'someBrand',
        people: 50,
        distance: 5000
      };

      const res = await request(expressServer).put('/updateCar').send(requestBody);

      expect(res.statusCode).toEqual(422);
      expect(res.body?.message).toEqual('[{"instancePath":"/people","schemaPath":"#/properties/people/maximum","keyword":"maximum","params":{"comparison":"<=","limit":10},"message":"must be <= 10"}]');
    });

    it('/update should fail for a car ID that does not exist', async () => {
      const id = 'UnknownID';
      const requestBody = {
        id,
        model: 'newCarModel',
        people: 2,
        distance: 5000
      };
      const res = await request(expressServer).put('/updateCar').send(requestBody);;

      expect(res.statusCode).toEqual(500);
      expect(res.body?.message).toEqual(`Car with id ${id} does not exist in the database`);
    });
  });
});
