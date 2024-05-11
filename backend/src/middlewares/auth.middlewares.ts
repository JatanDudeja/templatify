import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/user.models";

declare global {
    namespace Express {
        interface Request {
            user?: any; // Define user property
        }
    }
}


const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            res.status(401).json({
                status: "401",
                message: "No token provided."
            })
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

        const user = await User.findById((decodedToken as any)?._id)

        if(!user){
            res.status(401).send('Invalid Access Token');
        }

        req.user = user;

        next();
        
    } catch (error) {
        throw new Error("ERROR: JWT Verifcation could not be done.!")
    }
}


export default verifyJWT;