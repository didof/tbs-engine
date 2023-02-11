import to from "await-to-ts"
import crypto from "crypto"
import { Nullable } from "../../../src/utils/types"
import Hash from "../utils/Hash"

export default class Client {
    public readonly id: string
    private password: Nullable<string> = null
    constructor(public readonly name: string) {
        this.id = crypto.randomUUID()
    }

    static async create(name: string, password: string): Promise<Client> {
        const client = new Client(name)

        const [err, res] = await to(Hash.hash(password))
        if (err) {
            throw err
        }

        client.password = res.hash

        return client
    }
}