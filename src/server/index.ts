import http from 'http';

import express, { Express } from "express";
import * as routes from "../routes/routes";

const port = 3000;

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes.register(app);

function serverSpinup(server: Express): Promise<http.Server> {
  return new Promise((resolve, reject) => {
    const runningServer = server.listen(port, (): void => {
      console.log(`Server started to listen on: ${port}`);
    });

    runningServer.on("error", (err: any) => {
      err.message = `Server is unable to start: ${err.message}`;
      console.error(err);

      return reject(err);
    });

    return resolve(runningServer);
  });
}

let server: any;
const connections: any = {};

app.on('connection', (conn: any) => {
  const key = `${conn.remoteAddress}:${conn.remotePort}`;
  connections[key] = conn;
  conn.on('close', () => {
    delete connections[key];
  });
});


export const start = async (): Promise<void> => {
  server = await serverSpinup(app);
};

export const stop = (): void => {
  if (server) {
    // close the server for incoming connections
    server.close();
    // destroy still existing connections
    Object.keys(connections).forEach((connection) =>
      connections[connection].destroy()
    );
  }
};
