import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "@tavo/shared";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  if (err instanceof ZodError) {
    const errorResponse: ApiError = {
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      details: err.flatten().fieldErrors,
    };
    return res.status(400).json(errorResponse);
  }

  const errorResponse: ApiError = {
    message: err.message || "Internal Server Error",
    code: err.code || "INTERNAL_ERROR",
  };

  res.status(err.status || 500).json(errorResponse);
};
