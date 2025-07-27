import express from "express";

import auth from "./auth";
import api from "./api";

export default (web: express.Application) => {
    web.use("/auth", auth);

    web.use("/api", express.json());
    web.use("/api", api);
}