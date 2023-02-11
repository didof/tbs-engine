import { gamesDB } from "../../db"
import { SerializedGame } from "../../model/Game"
import { Router } from "express"

export type POST_RESPONSE_GAME_LIST = {
    games: SerializedGame[]
}

export function registerList(router: Router) {
    router.get("/list", (req, res) => {
        const games: SerializedGame[] = []
        for (const [, game] of gamesDB) {
            games.push(game.serialize())
        }

        const payload: POST_RESPONSE_GAME_LIST = { games }
        res.status(200).json(payload)
    })
}