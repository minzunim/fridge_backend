import express, { Request, Response, NextFunction } from 'express';
const bcrypt = require('bcrypt');

const app = express();


app.get("/welcome", (req: Request, res: Response, next: NextFunction) => {
    res.send("welcome!");
});

app.post("/join", async (req: Request, res: Response) => {

    const { id, password } = req.body;

    try {
        const salt = await bcrypt.gensalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        let userData = [];

        // # TODO: DB 연결 필요
        userData.push({ id, hashPassword });

        res.json({ code: 200, msg: `회원가입 완료`, data: null });

    } catch (err) {
        res.json({ code: 500, msg: `서버 오류`, data: null });
    }
});

app.listen('1234', () => {
    console.log(`
  ################################################
  🛡️  Server listening on port: 1234🛡️
  ################################################
`);
});