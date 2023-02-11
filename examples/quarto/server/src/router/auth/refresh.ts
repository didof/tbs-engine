import { Router } from "express"
import { clientsDB } from "../../db"
import { assertCookieClient } from "../../middlewares/assertCookieToken"

export function registerRefresh(router: Router) {
    router.get("/refresh", assertCookieClient(false), async (req, res) => {
        if (!req.context.payloads.client) {
            res.status(401).clearCookie("client").send()
            return
        }

        if (!clientsDB.has(req.context.payloads.client.name)) {
            res.status(401).clearCookie("client").json({ message: "You need to login again" })
            return
        }

        // TODO Use Hash.validate to confirm
        // Reference <https://stackoverflow.com/questions/17201450/salt-and-hash-password-in-nodejs-w-crypto>

        res.status(200).send()
    })
}