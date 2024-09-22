import express, { Request, Response, NextFunction } from 'express';
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import sessionFileStore from "session-file-store";
import cors from "cors";

import user from "../router/user/user";

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

dotenv.config();

// session 객체 타입 설정
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

app.use(cors({
  origin: true,
  credentials: true
}));

const fileStore = sessionFileStore(session);

app.use(session({
  secret: process.env.COOKIE_SECRET as string, // 암호화하는 데 쓰일 키
  resave: false, // 세션을 언제나 저장할지 설정함
  saveUninitialized: false, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정
  cookie: {	//세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
    httpOnly: true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
    // secure: true // https 에서만 사용 가능 (개발 시에는 false)
  },
  name: 'session-cookie', // 세션 쿠키명 디폴트값은 connect.sid이지만 다른 이름을 줄수도 있다.
  store: new fileStore()
}));

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