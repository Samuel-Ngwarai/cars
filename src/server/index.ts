import http from 'http';

import express, { Express } from "express";
import { IRoute } from '../routes/routes-i';

const port = 3000;
export class Server {
  private server: Express;

  public constructor() {
      this.server = express();
  }

  public async init(listen: boolean): Promise<http.Server> {
      try {
          if (listen) {
              await this.server.listen(port);
          }
          console.log('Server::init - Server running at:', { uri: `localhost:${port}` });
      } catch (error) {
          console.error('Server::init - Server failed to start', { error });
          process.exit(1);
      }

      return this.server;
  }

  public addRoutes(routes: IRoute): void {
      routes.register(this.server);
  }
}
