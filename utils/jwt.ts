const jwt = require("jsonwebtoken");
import { PayloadModel } from "../model/jwt";

// jwt 생성
export const generateToken = (payload: PayloadModel, tokenType: 'access' | 'refresh') => {

    const expiresIn = tokenType === "access" ? "5m" : "1h";

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });

    return token;
};