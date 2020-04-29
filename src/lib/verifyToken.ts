import { JWT_SECRET } from '../keys';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface IPayload {
    _id: string,
    iat: number,
    exp: number
}

export const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('auth-token');
    if(!token || typeof token === 'undefined') {
        return res.status(400).json({message: 'Acceso denegado'});
    }

    const splitToken = token.split(' ');
    const bearer = splitToken[0];
    const sendedToken = splitToken[1];

    if(!bearer || bearer !== 'Bearer' || typeof bearer === 'undefined' || !sendedToken || typeof sendedToken === 'undefined') {
        return res.status(400).json({message: 'Acceso denegado'});
    }

    const payload = jwt.verify(sendedToken, process.env.JWT_SECRET || JWT_SECRET) as IPayload;
    req.userId = payload._id;

    next();
}