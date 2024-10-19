import exp from "constants";
import {RequestHandler, Request, Response, NextFunction} from "express";

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.log("err from catchasync: ", err);
      next(err);
    }
  };
};

export default catchAsync;
