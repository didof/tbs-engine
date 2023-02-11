import { Router } from "express"

export function registerLogout(router: Router) {
    router.delete("/logout", async (req, res) => {
        res.status(200).clearCookie("client").send()
    })
}