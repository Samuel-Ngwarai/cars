import { Express, Request, Response, NextFunction } from 'express';

import { IRoute } from './routes-i';
import { CarsManagementController } from '../controllers/cars-management-controller';
import { Car } from '../entities/car';

export class Routes implements IRoute {
  private carsManagementController = new CarsManagementController();
  constructor() {}

  public register(app: Express): void {
    app.get('/', async () => {
      throw new Error('Uknown route called. Try "/createCar" for example')
    });

    app.get('/readyz', async (req: Request, res: Response) => {
      console.log(req.body);
      res.json({ ready: true });
    });

    app.get('/healthz', async (req: Request, res: Response) => {
      console.log('ReqBody  - ', req.body);
      res.json({ healthy: true });
    });

    app.post('/createCar', async (req: Request, res: Response, next: NextFunction) => {
      let newCar: Car;
      try {
        newCar = await this.carsManagementController.createCar(req.body);
      } catch (error) {
        next(error);
      }
      res.json(newCar);
    });
  }
}
