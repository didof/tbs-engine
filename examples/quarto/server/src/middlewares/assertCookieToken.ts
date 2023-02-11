import to from "await-to-ts"
import { Request, Response, NextFunction } from "express"
import JWT, { Payload } from "../utils/jwt"

export type CookieName = "game" | "client"

function createAssertCookie<P extends Payload>(cookieName: CookieName) {
    return function assertCookieOptions(crash = true) {
        return async function assertCookie(req: Request, res: Response, next: NextFunction) {
            const cookie = req.cookies[cookieName]
            if (!cookie && crash) {
                res.status(401).json({ message: "You need to login" })
                return
            }

            const [err, payload] = await to<P>(JWT.verify(cookie))
            if (err && crash) {
                res.status(401).json({ message: "You need to login" })
                return
            }

            if (crash) {
                req.context.payloads[cookieName] = null
            } else {
                // FIXME remove that as any
                req.context.payloads[cookieName] = payload as any
            }

            next()
        }
    }
}

export const assertCookieGame = createAssertCookie("game")
export const assertCookieClient = createAssertCookie("client")