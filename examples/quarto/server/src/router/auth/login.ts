import { clientsDB } from "../../db"
import { Router } from "express"
import Client from "../../model/Client"
import JWT, { PayloadClient } from "../../utils/jwt"

export type POST_REQUEST_LOGIN = {
    name: string
    password: string
}

export type POST_RESPONSE_LOGIN = {
    name: string
    id: string
}

export function registerLogin(router: Router) {
    router.post("/login", async (req, res) => {
        const { name, password } = req.body as POST_REQUEST_LOGIN

        if (clientsDB.has(name)) {
            res.status(400).json({ message: "username already taken" })
            return
        }

        const client = await Client.create(name, password)
        clientsDB.set(name, client)

        const payload: POST_RESPONSE_LOGIN = {
            id: client.id,
            name
        }
        const token = await JWT.sign<PayloadClient>(payload)
        res
            .status(201)
            .cookie('client', token, { maxAge: 86400000, httpOnly: true, sameSite: "lax" })
            .json(payload)
    })
}