import jwt from 'jsonwebtoken'
import { SECRET_KEY } from './config'

export const generateToken = (data: {}) => {
    return jwt.sign({ data, exp: '365d' }, SECRET_KEY);
}

export const decodeToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY)
}