import { Router, Request, Response } from "express";
import db from "../../src/database";

const router = Router();

// 아이템 등록
router.post("/create", async (req: Request, res: Response) => {

    const { title, expire_date, memo, register, count, position } = req.body;

    try {

        // 같은 이름의 상품이 있는지 확인
        const findSql = `SELECT idx FROM product WHERE title LIKE '%${await db.ec(title)}%'`;

        const findRes = await db.query(findSql);

        if (findRes.length) return res.json({ code: 400, msg: `동일한 상품명이 있어요!`, data: null });

        const insertSql = `INSERT INTO product(title, expire_date, register_date, memo, register, count, position)
                            VALUES ('${title}', '${expire_date}', NOW(), '${memo}',${1}, ${count}, ${position})`;
        console.log("🚀 insertSql:", insertSql);

        const insertRes = await db.query(insertSql);
        console.log("🚀 insertRes:", insertRes);

        if (!insertRes) return res.json({ code: 401, msg: `등록 도중 에러 발생`, data: null });

        res.json({ code: 200, msg: `등록 완료`, data: null });

    } catch (err) {
        console.log(err);
        res.json({ code: 500, msg: `서버 오류`, data: null });
    }
});

// 아이템 리스트 조회
router.get("/list", async (req: Request, res: Response) => {

    const register = 1; // 하드코딩 (나중에 req.body로 바꿔야 함)

    try {

        const findSql = `SELECT * FROM product 
                            WHERE register = ${register} 
                            AND is_deleted = 'N'
                            ORDER BY position ASC`;

        const findRes = await db.query(findSql);

        if (!findRes.length) return [];

        const uniquePostion = [...new Set(findRes.map((item: any) => item.position))];
        console.log("🚀 ~ router.get ~ uniquePostion:", uniquePostion);

        let list = [];

        for (const position of uniquePostion) {
            console.log("🚀 ~ router.get ~ position:", position);
            const filterItemList = findRes.filter((item: any) => item.position === position);
            console.log("🚀 ~ router.get ~ filterItemList:", filterItemList);

            list.push({
                position,
                list: filterItemList
            });
        }

        /*{
            position: 1,
                list: [
                {
                    idx: 1,
                    title: '사과',
                    expire_date: '2024-09-25',
                    register_date: '2024-09-25 00:00:00',
                    modify_date: null,
                    memo: '',
                    regitser: 1.
                    count: 1,
                    position: 1
                    is_deleted: 'N'
                }, ...
            ], ...
        }*/

        res.json({ code: 200, msg: `리스트 조회 성공`, data: list });

    } catch (err) {
        console.log(err);
        res.json({ code: 500, msg: `서버 오류`, data: null });
    }
});



export default router;