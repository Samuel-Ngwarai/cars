import * as express from "express";

export const register = (app: express.Application) => {
  app.get("/ready", (req: any, res: any) => {
    console.log("default route");
    console.log(req.body);
    res.json({ ready: true });
  });

  app.get("/healthy", (req: any, res: any) => {
    console.log("I am working");
    console.log(req.body);
    res.json({ healthy: true });
  });

  app.get("/", (req: any, res: any) => {
    console.log("Handle default route");
    console.log(req.body);
    res.json("handle default route");
  });
};
