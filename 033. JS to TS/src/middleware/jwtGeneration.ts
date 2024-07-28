import jwt from 'jsonwebtoken'
import {Err, codeError} from '../util/statusCode'
const CODE = new codeError();

export const generateAccessToken = (payload: {userId: string}) => {
    try {
        const accessToken: string = jwt.sign(payload, process.env.SECRET_KEY_JWT as string, { expiresIn: '10m' })
        return accessToken;
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        throw error;
    }
}

export const generateRefreshToken = (payload: {userId: string}) => {
    try {
        const refreshToken: string = jwt.sign(payload, process.env.SECRET_KEY_JWT as string, { expiresIn: '3d' })
        return refreshToken;
    } catch (err: any) {
        const error = new Err(err, CODE.INTERNALSERVERERROR);
        throw error;
    }
}