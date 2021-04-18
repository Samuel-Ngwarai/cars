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
  let uuidSpy;


  beforeAll(async () => {
    app = new App(false);
    await app.init(true);

    expressServer = app.expressServer;
    mongoDBDatabase = app.mongoDBService;

    uuidSpy = jest.spyOn(uuid, 'v4');

    // clean database
    await mongoDBDatabase['CarModel'].deleteMany({});
  });

  afterAll(async() => {
    await mongoDBDatabase['CarModel'].deleteMany({});
    await mongoose.disconnect();
  });

  describe('DELETE', () => {

    beforeAll(async (done) => {
      const requestBody: CreateCarMetadata = {
        model: 'someModel',
        color: 'someColor',
        brand: 'someBrand',
        people: 5,
        distance: 5000
      };
      uuidSpy.mockReturnValue('mocked_uuid');
      await request(expressServer).post('/car').send(requestBody);

      // wait till items are in database to avoid race condition
      setTimeout(() => {
        done();
      }, 1000);
    });

    it('/car should delete car', async () => {
      const res = await request(expressServer).delete('/car').send({ id: 'mocked_uuid' });

      expect(res.body).toEqual({ message: 'Deletion Successful' });
      expect(res.statusCode).toEqual(200);
    });

    it('/car should fail for non-existing car', async () => {
      const res = await request(expressServer).delete('/car').send({ id: 'unknownID' });

      expect(res.body?.message).toEqual('Car with id unknownID does not exist in the database');
      expect(res.statusCode).toEqual(500);
    });


    it('/car should fail for invalid input', async () => {
      const res = await request(expressServer).delete('/car').send({ model: 'model' });

      expect(res.body?.message).toEqual('[{"instancePath":"","schemaPath":"#/required","keyword":"required","params":{"missingProperty":"id"},"message":"must have required property \'id\'"}]');
      expect(res.statusCode).toEqual(422);
    });
  });
});
