import { Request, Response, NextFunction } from "express"
import { gamesDB } from "../db"

export function assertGameExists(req: Request, res: Response, next: NextFunction) {
    if (gamesDB.has(req.params.id)) {
        req.context.game = gamesDB.get(req.params.id)
        next()
        return
    }

    res.status(404).json({ message: "Cannot access this game" })
}