import axios, { AxiosResponse } from "axios"
import { POST_REQUEST_CREATE, POST_RESPONSE_CREATE, POST_RESPONSE_GAME_LIST } from "../../server/src/router"
import { POST_REQUEST_LOGIN, POST_RESPONSE_LOGIN } from "../../server/src/router/auth"
import { GET_RESPONSE_SINGLE } from "../../server/src/router/game/single"

const instance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

instance.interceptors.response.use(response => response, error => {
    if (error.response?.data?.message) {
        alert(error.response.data.message)
    } else {
        // console.error("[NEED ATTENTION]", error)
    }
    return Promise.reject(error)
})

type AxiosPromise<T> = Promise<AxiosResponse<T>>

export const server = {
    async gameList(): AxiosPromise<POST_RESPONSE_GAME_LIST> {
        return await instance.get("/game/list")
    },
    async gameCreate(data: POST_REQUEST_CREATE): AxiosPromise<POST_RESPONSE_CREATE> {
        return await instance.post("/game/create", data)
    },
    async getGame(id: string): AxiosPromise<GET_RESPONSE_SINGLE> {
        return await instance.get(`/game/${id}`)
    },
    async refresh(): AxiosPromise<void> {
        return await instance.get("/auth/refresh")
    },
    async login(data: POST_REQUEST_LOGIN): AxiosPromise<POST_RESPONSE_LOGIN> {
        return await instance.post("/auth/login", data)
    },
    async logout(): AxiosPromise<void> {
        return await instance.delete("/auth/logout")
    }
}