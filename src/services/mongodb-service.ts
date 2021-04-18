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

  private async existsInDatabase(id: string): Promise<boolean> {
    const carExists = await this.CarModel.exists({ id });

    if (!carExists) {
      throw new Error(`Car with id ${id} does not exist in the database`);
    }

    return true;
  }

  public async store(car: Car): Promise<void>{
    logger.debug(`MongoDBService::store with id ${car.id}`);
    try {
      const newCar = new this.CarModel(car);
      await newCar.save();
    } catch (error) {
      logger.error('MongoDBService::store, error occured whilst storing new Car', error);
      throw new GeneralError({ message: error.message });
    }
  }

  public async update(car: Car): Promise<void> {
    logger.debug(`MongoDBService::update with id ${car.id}`);
    try {
      let itemsToUpdate = {
        model: car.model,
        brand: car.brand,
        people: car.people,
        distance: car.distance,
        color: car.color,
      };

      await this.existsInDatabase(car.id);

      Object.keys(itemsToUpdate).forEach(key => itemsToUpdate[key] === undefined && delete itemsToUpdate[key]);

      const updated = await this.CarModel.findOneAndUpdate({ id: car.id }, itemsToUpdate, { upsert: false });

      if (!updated) {
        throw new Error('Database update unsuccessful');
      }

    } catch (error) {
      logger.error('MongoDBService::update, error occured whilst updating existing Car', error);
      throw new GeneralError({ message: error.message });
    }
  }

  public async get(id: string): Promise<Car[]>{
    logger.debug(`MongoDBService::get with id ${id}`);
    try {

      let cars;

      if (id) {
        await this.existsInDatabase(id);

        cars = await this.CarModel.find({ id });
      } else {
        cars = await this.CarModel.find({});
      }

      cars =  cars.map((storedCar) => {
        return Car.create(storedCar);
      });

      return cars;
    } catch (error) {
      logger.error('MongoDBService::get, error occured whilst getting car', error);
      throw new GeneralError({ message: error.message });
    }
  }
}
