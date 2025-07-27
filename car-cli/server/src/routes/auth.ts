import express from "express";
import config from "../config";
import encrypt from "../extensions/encrypt";

const router = express.Router();


const getPublicKey = (_: express.Request, res: express.Response) => {
    if (!encrypt.Keys.publicKey.includes("PUBLIC KEY")) {
        console.error("Public key missing: " + encrypt.Keys.publicKey);
        res.status(500).send("Public key missing");
        return;
    }

    res.send(encrypt.Keys.publicKey);
}

const checkAuth = (req: express.Request, res: express.Response) => {
    if (!req.headers.authorization) {
        res.status(400).send("Invalid auth header");
        return;
    }

    switch (encrypt.Keys.checkPrivateDecrypt(
        req.headers.authorization.substring("Bearer ".length),
        config.web.auth.login + ":" + config.web.auth.pwd
    )) {
        case encrypt.DecryptAnswer.Success: {
            res.sendStatus(200);
            return;
        }
        case encrypt.DecryptAnswer.InvalidPwd: {
            res.status(401).send("Password is invalid");
            return;
        }
        case encrypt.DecryptAnswer.InvalidToken: {
            res.status(400).send("Token is invalid");
            return;
        }
    }

}


router.get("/publicKey", getPublicKey);
router.get("/checkAuth", checkAuth);

export default router;