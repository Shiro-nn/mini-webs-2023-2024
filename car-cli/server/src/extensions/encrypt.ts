import * as crypto from "node:crypto";
import config from "../config";
import express from "express";

enum DecryptAnswer {
    Success,
    InvalidPwd,
    InvalidToken,
}

class Keys {
    static publicKey: string = config.security.publicKey;
    static privateKey: string = config.security.privateKey;
    static privatePwd: string = config.security.privatePwd;

    static checkPrivateDecrypt(encrypted: string, source: string): DecryptAnswer {
        try {
            const decrypted = crypto.privateDecrypt({
                key: this.privateKey,
                passphrase: this.privatePwd,
                oaepHash: "SHA512",
                padding: 4
            }, Buffer.from(encrypted, "base64"));

            if (decrypted.toString("utf8") !== source) {
                return DecryptAnswer.InvalidPwd;
            }

            return DecryptAnswer.Success;
        } catch {
            return DecryptAnswer.InvalidToken;
        }
    }

    static authExpress(req: express.Request, res: express.Response): boolean {
        if (this.checkPrivateDecrypt(
            (req.headers.authorization ?? "").substring("Bearer ".length),
            config.web.auth.login + ":" + config.web.auth.pwd
        ) !== DecryptAnswer.Success) {
            res.sendStatus(401);
            return false;
        }

        return true;
    }
}

export default {
    Keys, DecryptAnswer
};


Init();

function Init() {
    if (Keys.publicKey.includes("RSA") &&
        Keys.privateKey !== "GENERATE" &&
        Keys.privatePwd !== "GENERATE")
        return;

    const pwd = crypto.randomBytes(99).toString("hex");

    const keyPair = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "pkcs1",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
            cipher: "aes-256-cbc",
            passphrase: pwd
        }
    });

    Keys.publicKey = keyPair.publicKey;
    Keys.privateKey = keyPair.privateKey;
    Keys.privatePwd = pwd;
}