import jwt from "jsonwebtoken"
import { Go } from "./types"

// TODO get from .env
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEwAIBADANBgkqhkiG9w0BAQEFAASCBKowggSmAgEAAoIBAQDoZ8rd+haYSk/3
UeZz+rWF/C9emOtMzN8WnQp2h3/5KZjVqorncQ21xGSXEJ751Udhpt100ktHO/ue
p1PiR+uj9/JGylmuIqt7GzPOEMa/bm/wtIP8ayohFx9fP7DnkXj5xIJkmeEEzftl
cQuInNW67OLVofK3At0bL7rPbIaS7iefyEGQpPsnpwyI4hEieS8udh1kvK4yd9L3
mqV7sxOQu1aG5FTGhNzZyqMA4TwznGJM/VRBfj8QSeJBAgR9CgCWKOQIWz9T/PyD
LluTRGnNPX2iMtmw+CBC22eZ90C0d5fGka9XtIzRqLep8UboHdeXPleLdymhFXIV
W9R3pZ3/AgMBAAECggEBAIYRCfhPgqVLiSHU/yo8oGaweesKMALX1IHJCfYiaHKl
ymLHxOWKVCxdJOH4Vp0sqcbtaacwgPiQ47A8Oqm4b3jhWcP4iw9nNKEJqjLffqeD
39Ntbw44C8+W9SQPK9AKHU2ITOgX1LTe1n1IXyzpvGneqWQvzkJAxqgeOpfZtTAg
VQ71C7Qg5N6QAagoojg8CGAPQPUBZZJ9GqEXBCvzKJTeARZEoade4ab2m6Njo9sO
0CSZfZOw8YeCV83UW1O7yssGTirNcU2f1UK/WXcKVJy+7dJvARm6rzBACip+9cnW
N+L3sn8HB+pbiV27TiJAip6GtZ/rl785ZQD1wjvdaQECgYEA9tI8BJHzBOfeKbJF
gHJOZ8Na6QO64QglEY3A+htOZ2XMLqdC5ZfGjaTgsM808qAM/8REbDo7oenAC3M5
EOU1/vUcABFE49cfazPq+lHvw/RiTcS8JpATWOVbsqJyZeT8iifxDyNAjISxRC4p
b8QSMN0/3J5A06kGzv8ZFGYhZj8CgYEA8QxRbkvfJcZMteACIkEL6ScmoLu6X2bJ
kpuwtRf/cypxVGaIVwklF66ijsoringJW2MvHtd6RECb9spzzMrSpgUY6I/vLWF5
Zh4ctrUw3ruznGpGv2uf2mZtxfyQFG4GxsFr+ZUm76WpioZaX+mr3tq0W/ocPbVP
dwsVLyK7WEECgYEAqS+k2lEc7wDtRVGg2JIB8phzaYQYBoapuiWb4RT0omWiF1yp
u21VOeSJ7Eisd5+EKZHkgPdNxwfOj0q1FEK5x4FGZzlvKmpcbASTjnC51G1hMQOp
IRnjWS0mtQUrO3NCNIV6dLDqXyfZxu2Jk8Yn3fza+KQ1taCIPT2ZeGUlgcsCgYEA
2LuIpDFX7LEF3CoUARSXTwXCt5bTll/nMgkGs21mY/hvecHPKOKyFT8SLm0dBR20
3BSsE4EPEDs/gIC76hEboebHZKO2HAmei/DbRHRaAoqmjicIgaiVTFv4q6HRMm1T
bnYPTZOMNMGxVTpEHCUQQgpHTMPvjJRvZMv0OjNyW4ECgYEAmolx3i55ja+3Nd+r
YeKWZrcGm591WBHhQALPO8EgZ4crJGySv7QmsvRsceIHRT7DqAtzTVCAMq8eOWzZ
p0+FhEEXjyzOMOFI17YBhiaB0jdFswfeuGlx0qSVb6t32ELhK9dhqV3YjkwFqU+4
Pnk9lKnf1tgSuu+kyjZd7nlkZv4=
-----END PRIVATE KEY-----
`
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6GfK3foWmEpP91Hmc/q1
hfwvXpjrTMzfFp0Kdod/+SmY1aqK53ENtcRklxCe+dVHYabddNJLRzv7nqdT4kfr
o/fyRspZriKrexszzhDGv25v8LSD/GsqIRcfXz+w55F4+cSCZJnhBM37ZXELiJzV
uuzi1aHytwLdGy+6z2yGku4nn8hBkKT7J6cMiOIRInkvLnYdZLyuMnfS95qle7MT
kLtWhuRUxoTc2cqjAOE8M5xiTP1UQX4/EEniQQIEfQoAlijkCFs/U/z8gy5bk0Rp
zT19ojLZsPggQttnmfdAtHeXxpGvV7SM0ai3qfFG6B3Xlz5Xi3cpoRVyFVvUd6Wd
/wIDAQAB
-----END PUBLIC KEY-----`

export interface Payload { }

export interface PayloadGame extends Payload {
    id: string
    ownerName: string
}

export interface PayloadClient extends Payload {
    id: string
    name: string
}

class JWTError extends Error {
    constructor(message: string) {
        super(`[jwt] ${message}`)
    }
}

class JWTErrorSign extends JWTError {
    constructor(message: string, err?: Error) {
        super(`[sing] ${message}${err ? ` ${err}` : ''}`)
    }
}

class JWTErrorVerify extends JWTError {
    constructor(message: string, err?: Error) {
        super(`[verify] ${message}${err ? ` ${err}` : ''}`)
    }
}

const options: jwt.SignOptions = {
    algorithm: "RS256"
}


export default class JWT {
    static async sign<P extends Payload>(payload: P): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, privateKey, options, (err, token) => {
                if (err) {
                    reject(new JWTErrorSign("could not sign", err))
                    return
                }

                if (!token) {
                    reject(new JWTErrorSign("token empty"))
                    return
                }

                resolve(token)
            })
        })
    }

    static async verify<P extends Payload>(token: string): Promise<P> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, publicKey, options, (err, token) => {
                if (err) {
                    reject(new JWTErrorVerify("invalid token", err))
                    return
                }

                resolve(token as P)
            })
        })
    }
}