import { Express } from "express"
import { context } from "../middlewares/context"
import { registerAuthRoutes } from "./auth"
import { registerGameRoutes } from "./game"

export function registerRoutes(app: Express) {
    app.use(context)
    registerAuthRoutes(app)
    registerGameRoutes(app)
}

export * from "./game"