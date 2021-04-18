import mongoose from 'mongoose';
import config from 'config';

import { Car, MongooseCarSchema } from '../entities/car';
import { IDatabaseService } from '../entities/database-i';
import { GeneralError } from '../entities/error';

import { logger } from '../utils/logger';

export class MongoDBService implements IDatabaseService {
  private mongoDBUri: string = config.get('MONGODB_URL');

  private db;
  private CarModel;

  constructor() {}

  public async initializeDBConnection() {
    logger.info('MongoDBService::constructor, initializing mongodb connection');
    mongoose.connect(this.mongoDBUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    return new Promise((resolve, reject) => {
      this.db = mongoose.connection;

      this.db.on('error', (err) => {
        logger.error('MongoDBService::constructor Error occured during mongodb connection', err);
        reject(new GeneralError({ message: err.message }));
      });
      this.db.once('open', () => {
        logger.info('MongoDBService::constructor Connection to mongodb successfull. Initialising model');

        this.CarModel = mongoose.model('Car', MongooseCarSchema);
        resolve(true);
      });
    });
  }

  public async store(car: Car): Promise<void>{
    logger.debug('MongoDBService::store');
    try {
      const newCar = new this.CarModel(car);
      await newCar.save();
    } catch (error) {
      logger.error('MongoDBService::store, error occured whilst storing new Car', error);
      throw new GeneralError({ message: error.message });
    }
  }

  public async update(car: Car): Promise<void> {
    logger.debug('MongoDBService::update');
    try {
      let itemsToUpdate: any = {
        model: car.model,
        brand: car.brand,
        people: car.people,
        distance: car.distance,
        color: car.color,
      };

      Object.keys(itemsToUpdate).forEach(key => itemsToUpdate[key] === undefined && delete itemsToUpdate[key]);

      const updated = await this.CarModel.findOneAndUpdate({ id: car.id }, itemsToUpdate, { upsert: false });

      if (!updated) {
        throw new Error('Update Unsuccessful');
      }

    } catch (error) {
      logger.error('MongoDBService::update, error occured whilst updating existing Car', error);
      throw new GeneralError({ message: error.message });
    }
  }
}
