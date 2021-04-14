import express, { Express } from 'express';
import bodyparser from 'body-parser';
import config from 'config';

import { CarsManagementController } from '../controllers/cars-management-controller';
import { IRoute } from '../routes/routes-i';

import { logger } from '../utils/logger';

export class Server {
  private server: Express;
  private port = config.get('PORT');

  public constructor() {
    this.server = express();
  }

  public async init(listen: boolean): Promise<Express> {
    try {
      if (listen) {
        await this.server.listen(this.port);
      }
      logger.info('Server::init - Server running at:', {
        uri: `localhost:${this.port}`,
      });
    } catch (error) {
      logger.error('Server::init - Server failed to start', { error });
      process.exit(1);
    }

    return this.server;
  }

  public addExtensions() {
    this.server.use(bodyparser.json());
  }

  public addRoutes(routes: IRoute, carsManagementController: CarsManagementController): void {    
    routes.register(this.server, carsManagementController);
  }

  public addErrorHandler() {
    this.server.use((err, req, res, next) => {
      // TODO: Extend error handler
      logger.error(err);
      res.status(500).send('Something broke!')
    })
  }
}
