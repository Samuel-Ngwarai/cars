process.env.NODE_CONFIG_DIR = require('path').resolve(__dirname, 'config');
import { Express } from 'express';
import { Server } from './server';

import { CarsManagementController } from './controllers/cars-management-controller';
import { MongoDBService } from './services/mongodb-service';
import { Routes } from './routes';
import { logger } from './utils/logger';

export default class App {
  public expressServer: Express;
  private server: Server;
  public mongoDBService: MongoDBService;

  public constructor(private readonly listen: boolean) {}

  public async init(initializeDBConnection: boolean): Promise<void> {
    this.server = new Server();

    this.mongoDBService = new MongoDBService();
    if (initializeDBConnection) {
      await this.mongoDBService.initializeDBConnection();
    }

    const carsManagementController = new CarsManagementController(this.mongoDBService);
    const routes = new Routes();

    this.server.addExtensions();
    this.server.addRoutes(routes, carsManagementController);
    this.server.addErrorHandler();

    this.expressServer = await this.server.init(this.listen);

    logger.info('App::init - Application started');
  }
}

if (require.main === module) {
  const app = new App(true);
  app.init(true);
}
