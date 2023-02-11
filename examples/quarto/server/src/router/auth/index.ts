import express, { Express } from "express"
import { registerLogin } from "./login"
import { registerLogout } from "./logout"
import { registerRefresh } from "./refresh"

export function registerAuthRoutes(app: Express) {
    const router = express.Router()

    registerRefresh(router)
    registerLogin(router)
    registerLogout(router)

    app.use("/auth", router)
}

export * from "./login"
