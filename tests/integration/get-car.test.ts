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

  describe('GET', () => {

    beforeAll(async (done) => {
      const requestBody: CreateCarMetadata = {
        model: 'someModel',
        color: 'someColor',
        brand: 'someBrand',
        people: 5,
        distance: 5000
      };
      uuidSpy.mockReturnValue('mocked_uuid');
      await request(expressServer).post('/createCar').send(requestBody);

      uuidSpy.mockReturnValue('mocked_uuid2');
      await request(expressServer).post('/createCar').send(requestBody);

      // wait till items are in database to avoid race condition
      setTimeout(() => {
        done();
      }, 1000);
    });

    it('/getCars should retrieve all Existing Cars', async () => {
      const res = await request(expressServer).get('/getCars');;

      const expected = [
        {
          id: 'mocked_uuid',
          color: 'someColor',
          model: 'someModel',
          brand: 'someBrand',
          people: 5,
          distance: 5000
        },
        {
          id: 'mocked_uuid2',
          color: 'someColor',
          model: 'someModel',
          brand: 'someBrand',
          people: 5,
          distance: 5000
        },
      ];

      expect(res.body).toEqual(expected);
      expect(res.statusCode).toEqual(200);
    });

    it('/getCars should retrieve an existing Car', async () => {
      const res = await request(expressServer).get('/getCars?id=mocked_uuid');;

      const expected = [
        {
          id: 'mocked_uuid',
          color: 'someColor',
          model: 'someModel',
          brand: 'someBrand',
          people: 5,
          distance: 5000
        }
      ];

      expect(res.body).toEqual(expected);
      expect(res.statusCode).toEqual(200);
    });

    it('/getCars should retrieve an existing Car', async () => {
      const res = await request(expressServer).get('/getCars?id=unknownID');;

      expect(res.body?.message).toEqual('Car with id unknownID does not exist in the database');
      expect(res.statusCode).toEqual(500);
    });
  });
});
