import to from "await-to-ts"
import { defineStore } from 'pinia'
import { server } from "../utils/axios"
import { SerializedGame } from "../../server/src/model/Game"
import router from "../router"
import { Nullable } from "../utils/types"

export enum Store {
    AvailableRooms = "available-rooms",
    Client = "client"
}

type StateAvailableRooms = {
    list: SerializedGame[]
}

export const useAvailableRoomsStore = defineStore(Store.AvailableRooms, {
    state: (): StateAvailableRooms => ({ list: [] }),

    getters: {
        size: (state) => state.list.length
    },

    actions: {
        async init() {
            const [err, res] = await to(server.gameList())
            if (err) {
                throw err
            }

            this.list.push(...res.data.games)

        },
        async create(username: string, gamename: string) {
            const [err, res] = await to(
                server.gameCreate({ gamename, username })
            )
            if (err) {
                return
            }
            this.list.push(res.data.game)

            router.push({ name: "Game", params: { id: res.data.game.id } })
        },
        async get(id: string): Promise<Nullable<SerializedGame>> {
            const [err, res] = await to(server.getGame(id))
            if (err) {
                throw err
            }

            const index = this.list.findIndex(item => item.id === res.data.game.id)
            if (~!index) {
                this.list.push(res.data.game)
            } else {
                this.list.splice(index, 1, res.data.game)
            }

            return res.data.game
        }
    }
})

type StateClient = {
    id: Nullable<string>
    name: Nullable<string>
    hasToken: boolean
}

export const useClient = defineStore(Store.Client, {
    state: (): StateClient => ({ id: null, name: null, hasToken: false }),

    getters: {
        isLoggedIn(): boolean {
            return this.hasToken
        }
    },

    actions: {
        async init(): Promise<void> {
            const [err] = await to(server.refresh())
            if (err) {
                router.replace("/")
                return
            }
            this.hasToken = true
        },
        async login(name: string, password: string): Promise<void> {
            const [err, res] = await to(
                server.login({ name, password })
            )
            if (err) {
                router.replace("/")
                return
            }

            this.id = res.data.id
            this.name = res.data.name
            this.hasToken = true
        },
        async logout(): Promise<void> {
            const [err, res] = await to(server.logout())
            if (err) {
                router.replace("/")
                return
            }

            this.id = null
            this.name = null
            this.hasToken = false

            router.replace("/")
        }
    }
})