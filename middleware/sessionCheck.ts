import { NextFunction, Request, Response } from "express";

const sessionChecker = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

export default sessionChecker;