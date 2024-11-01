import  { Request, Response, NextFunction } from 'express';


type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;



export const catchAsyncErrors = (thefunction:AsyncMiddleware) =>{

    return (req:Request , res:Response , next:NextFunction)=>{
        Promise.resolve(thefunction(req , res , next)).catch(next);
    }
}

