import express, { Express } from "express"
import { registerCreate } from "./create"
import { registerList } from "./list"
import { registerSingle } from "./single"

export function registerGameRoutes(app: Express) {
    const router = express.Router()

    registerCreate(router)
    registerList(router)
    registerSingle(router)

    app.use("/game", router)
}

export * from "./create"
export * from "./list"
