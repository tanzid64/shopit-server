import { NextFunction, Request, Response } from "express";

export interface newUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: "male" | "female";
  dob: Date;
  _id: string;
}

export type controllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void |Response<any, Record<string, any>>>;
