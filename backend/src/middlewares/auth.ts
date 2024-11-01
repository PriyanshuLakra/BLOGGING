import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { $Enums, PrismaClient, Role } from '@prisma/client';
import { ErrorHandler } from "../middlewares/error";
import { catchAsyncErrors } from './catchAsyncErrors';
import { User } from '@prisma/client'; // Adjust import based on your User model


// to give type to req.user as our Database User model
declare global {
    namespace Express {
        interface Request {
            user?: User; // Add the user property here
        }
    }
}

const prisma = new PrismaClient();

export const isAuthenticated = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token; // Get the token from the cookie

    if (!token) {
        return next(new ErrorHandler('Please log in to access this resource', 401));
    }

    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET!) as { id: number };

    // Find the user in the database
    const user = await prisma.user.findFirst({
        where: { id: decoded.id },
    });

    if (!user) {
        return next(new ErrorHandler('Invalid token or user does not exist', 401));
    }
    // Store user information in request
    req.user = user;
    next();

});



export const isAuthorised = (...roles: (string | undefined)[]) =>{

    return (req:Request , res:Response , next:NextFunction)=>{
        if(!roles.includes(req.user?.role)){
            return next(new ErrorHandler(`user with role ${req.user?.role} cannot access this resourse` , 400));
        }
        next();
    }
}


