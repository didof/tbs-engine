import { gamesDB } from "../../db"
import Game, { SerializedGame } from "../../model/Game"
import { Router } from "express"
import JWT, { PayloadGame } from "../../utils/jwt"

export type POST_REQUEST_CREATE = {
    username: string
    gamename: string
}

export type POST_RESPONSE_CREATE = {
    game: SerializedGame
}

export function registerCreate(router: Router) {
    router.post("/create", async (req, res) => {
        const { gamename, username } = req.body

        if (gamesDB.has(gamename)) {
            res.status(400).json({ message: `The game name ${gamename} is already taken.` })
            return
        }

        const [game, owner] = Game.create(gamename, username)

        gamesDB.set(game.id, game)

        const token = await JWT.sign<PayloadGame>({
            id: game.id,
            ownerName: owner.name
        })

        const payload: POST_RESPONSE_CREATE = { game: game.serialize() }
        res.status(201).cookie('game', token, { maxAge: 86400000, httpOnly: true, sameSite: "lax" }).json(payload)
    })
}