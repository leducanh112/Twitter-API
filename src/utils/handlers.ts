import { RequestHandler, Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export function wrapRequestHandler<
  P extends ParamsDictionary = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  handler: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => Promise<any>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return (req, res, next) => {
    Promise.resolve(handler(req as Request<P, ResBody, ReqBody, ReqQuery>, res, next)).catch(next)
  }
}
