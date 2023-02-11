import { Request, Response, NextFunction } from "express"
import { Nullable } from "../../../src/utils/types"
import Game from "../model/Game"
import { PayloadClient, PayloadGame } from "../utils/jwt"

declare global {
    namespace Express {
        interface Request {
            context: {
                game?: Game
                payloads: {
                    game?: Nullable<PayloadGame>
                    client?: Nullable<PayloadClient>
                }
            }
        }
    }
}

export function context(req: Request, res: Response, next: NextFunction) {
    req.context = {
        payloads: {}
    }
    next()
}