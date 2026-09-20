import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.method === "GET") {
        req.query = await schema.parseAsync(req.query);
      } else {
        req.body = await schema.parseAsync(req.body);
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
