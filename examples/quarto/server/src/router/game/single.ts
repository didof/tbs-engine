import { gamesDB } from "../../db"
import { SerializedGame } from "../../model/Game"
import { Router } from "express"
import { assertGameExists } from "../../middlewares/assertGameExists"
import { assertCookieClient } from "../../middlewares/assertCookieToken"

export type GET_RESPONSE_SINGLE = {
    game: SerializedGame
}

export function registerSingle(router: Router) {
    router.get("/:id", assertGameExists, assertCookieClient(true), (req, res) => {
        // Safe to assume it already exist because of gameExist middleware
        const game = gamesDB.get(req.params.id)!

        const payload: GET_RESPONSE_SINGLE = { game: game.serialize() }
        res.status(200).json(payload)
    })
}