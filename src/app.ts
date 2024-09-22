import express, { Request, Response, NextFunction } from 'express';

import user from "../router/user/user";

const app = express();
app.use(express.json());

app.get("/welcome", (req: Request, res: Response) => {
  res.send("welcome!");
});

app.use("/user", user);

app.listen('1234', () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: 1234🛡️
  ################################################
`);
});