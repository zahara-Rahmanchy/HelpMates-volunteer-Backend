import {NextFunction, Request, Response} from "express";
import {AnyZodObject} from "zod";
// this is used as a middleware to validate the req body according to zod schema
const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      if ("body" in schema.shape) {
        const result = await schema.parseAsync({body: req.body});
      } else {
        const result = await schema.parseAsync(req.body);
        console.log({result});
      }
      next();
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

export default validateRequest;
