import crypto from "crypto"

const PASSWORD_LENGTH = 256
const SALT_LENGTH = 64
const ITERATIONS = 10000
const DIGEST = "sha256"
const BYTE_TO_STRING_ENCODING = "hex"

class HashError extends Error {
    constructor(message: string) {
        super(`[hash] ${message}`)
    }
}

class HashErrorhash extends HashError {
    constructor(message: string, err?: Error) {
        super(`[sing] ${message}${err ? ` ${err}` : ''}`)
    }
}

export type HashResponse = {
    salt: string
    hash: string
}

export default class Hash {
    static hash(input: string): Promise<HashResponse> {
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(SALT_LENGTH).toString(BYTE_TO_STRING_ENCODING)
            crypto.pbkdf2(input, salt, ITERATIONS, PASSWORD_LENGTH, DIGEST, (err, hash) => {
                if (err) {
                    reject(new HashErrorhash("could not hash the input", err))
                }
                resolve({
                    salt,
                    hash: hash.toString(BYTE_TO_STRING_ENCODING)
                })
            })
        })
    }
}