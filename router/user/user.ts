import { Router, Request, Response } from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import db from "../../src/database";
import { generateToken } from "../../utils/jwt";

const router = Router();

// 회원가입
router.post("/join", async (req: Request, res: Response) => {

    const { id, password } = req.body;

    try {

        const findSql = `SELECT idx FROM user WHERE id LIKE '${id}'`;
        const findRes = await db.query(findSql);

        if (findRes[0]) return res.json({ code: 400, msg: `동일한 아이디가 존재합니다.`, data: null });

        const salt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(password, salt);

        const joinSql = `INSERT INTO user
                            SET id = '${id}',
                                password = '${hashPassword}'`;

        const joinRes = await db.query(joinSql);
        if (!joinRes) return res.json({ code: 401, msg: `회원 가입 도중 에러 발생`, data: null });

        res.json({ code: 200, msg: `회원가입 완료`, data: null });

    } catch (err) {
        console.log(err);
        res.json({ code: 500, msg: `서버 오류`, data: null });
    }
});

// 로그인
router.post("/login", async (req: Request, res: Response) => {

    const { id, password } = req.body;

    const findPasswordSql = `SELECT password FROM user WHERE id = '${id}'`;

    try {
        const passwordRes = await db.query(findPasswordSql);

        if (!passwordRes.length) return res.json({ code: 400, msg: `아이디 또는 비밀번호를 확인해주세요.`, data: null });

        const hashPassword = passwordRes[0].password;

        const isMatchPassword = await bcrypt.compare(password, hashPassword);

        if (!isMatchPassword) return res.json({ code: 401, msg: `아이디 또는 비밀번호를 확인해주세요.`, data: null });

        // req.session.userId = id;

        const payload = { userId: `${id}` };

        const accessToken = generateToken(payload, 'access');
        const refreshToken = generateToken(payload, 'refresh');

        const data = { accessToken, refreshToken };

        res.cookie("fridge_refresh", refreshToken, { httpOnly: true });
        res.json({ code: 200, msg: `로그인 성공`, data });

    } catch (err) {
        console.log(err);
        res.json({ code: 500, msg: `서버 오류`, data: null });
    }
});

// 로그아웃
router.post("/logout", async (req: Request, res: Response) => {

    /*if (req.session) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
    */

    try {
        res.cookie("fridge_refresh", null, {
            maxAge: 0
        });

        res.json({ code: 200, msg: `로그아웃 성공`, data: null });

    } catch (err) {
        console.log(err);
        res.json({ code: 500, msg: `서버 오류`, data: null });
    }
});

export default router;