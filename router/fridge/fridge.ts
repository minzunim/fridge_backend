import { Router, Request, Response } from "express";
import db from "../../src/database";

const router = Router();

// 아이템 등록
router.post("/create", async (req: Request, res: Response) => {

    const { title, expire_date, memo, register, count, position } = req.body;

    try {

        // 같은 이름의 상품이 있는지 확인
        const findSql = `SELECT idx FROM product WHERE title LIKE '%${title}%'`;

        const findRes = await db.query(findSql);

        if (findRes.length) return res.json({ code: 400, msg: `동일한 상품명이 있어요!`, data: null });

        const insertSql = `INSERT INTO product(title, expire_date, register_date, memo, register, count, position)
                            VALUES ('${title}', '${expire_date}', NOW(), '${memo}',${1}, ${count}, ${position})`;

        const insertRes = await db.query(insertSql);

        if (!insertRes) return res.json({ code: 401, msg: `등록 도중 에러 발생`, data: null });

        res.json({ code: 200, msg: `등록 완료`, data: null });

    } catch (err) {
        console.log(err);
        res.json({ code: 500, msg: `서버 오류`, data: null });
    }
});

// 냉장고 칸별 아이템 리스트 조회
router.get("/list/:position", async (req: Request, res: Response) => {

    const position = req.params.position;
    const register = 1; // 하드코딩 (나중에 req.body로 바꿔야 함)

    try {

        const findSql = `SELECT * FROM product 
                            WHERE register = ${register}
                            AND position = ${position}
                            AND is_deleted = 'N'
                            ORDER BY expire_date ASC`;

        const findRes = await db.query(findSql);

        if (!findRes.length) return [];

        return res.json({ code: 200, msg: `리스트 조회 성공`, data: findRes });

    } catch (err) {
        console.log(err);
        res.json({ code: 500, msg: `서버 오류`, data: null });
    }
});

// 개별 아이템 상세 정보 조회
router.get("/detail/:product_no", async (req: Request, res: Response) => {

    const product_no = req.params.product_no;
    const register = 1; // 하드코딩 (나중에 req.body로 바꿔야 함)

    try {

        const findSql = `SELECT * FROM product 
                            WHERE idx = ${product_no}`;

        const findRes = await db.query(findSql);

        if (!findRes.length) return [];

        return res.json({ code: 200, msg: `아이템 상세 조회 성공`, data: findRes[0] });

    } catch (err) {
        console.log(err);
        res.json({ code: 500, msg: `서버 오류`, data: null });
    }
});

// 개별 아이템 상세 수정
router.put("/detail/:product_no", async (req: Request, res: Response) => {

    const product_no = req.params.product_no;
    const { title, expire_date, memo, count, position } = req.body;
    const register = 1; // 하드코딩 (나중에 req.body로 바꿔야 함)

    try {

        // 같은 이름이 있는지 확인
        const findSql = `SELECT * FROM product 
                            WHERE register = ${product_no}
                            AND is_deleted = 'N'
                            AND title LIKE '%${title}%'`;

        const findRes = await db.query(findSql);

        if (findRes.length) return res.json({ code: 401, msg: `동일한 상품명이 있습니다!`, data: null });

        const updateSql = `UPDATE product SET 
                            title = '${title}', 
                            expire_date = '${expire_date}', 
                            memo = '${memo}',
                            count = ${count},
                            position = ${position}
                            WHERE idx = ${product_no}`;

        const updateRes = await db.query(updateSql);

        if (!updateRes.length) return res.json({ code: 402, msg: `아이템 상세 수정 실패`, data: null });

        return res.json({ code: 200, msg: `아이템 상세 수정 성공`, data: null });

    } catch (err) {
        console.log(err);
        res.json({ code: 500, msg: `서버 오류`, data: null });
    }
});


// 개별 아이템 삭제
router.put("/delete/:product_no", async (req: Request, res: Response) => {

    const product_no = req.params.product_no;
    // const register = 1; // 하드코딩 (나중에 req.body로 바꿔야 함)

    try {

        const updateSql = `UPDATE product SET is_deleted = 'Y' WHERE idx = ${product_no};`;

        const updateRes = await db.query(updateSql);

        if (!updateRes) return [];

        return res.json({ code: 200, msg: `아이템 삭제 성공`, data: null });

    } catch (err) {
        console.log(err);
        res.json({ code: 500, msg: `서버 오류`, data: null });
    }
});

export default router;