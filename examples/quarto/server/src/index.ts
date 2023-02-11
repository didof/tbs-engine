import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { registerRoutes } from "./router"

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
registerRoutes(app)

app.listen(3000, banner)

function banner() {
    console.info("Listening on http://localhost:3000")
}
