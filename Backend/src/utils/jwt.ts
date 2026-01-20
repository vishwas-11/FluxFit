import jwt from 'jsonwebtoken';

export const generateToken = (payLoad: object) =>{
    return jwt.sign(payLoad, process.env.JWT_SECRET!,{
        expiresIn: '7d'
    })
}

export const verifyToken = (token: string) =>{
    return jwt.verify(token, process.env.JWT_SECRET!);
}
