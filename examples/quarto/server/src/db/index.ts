import Client from "../model/Client"
import Game from "../model/Game"

export const gamesDB = new Map<string, Game>()

export const clientsDB = new Map<string, Client>()