export default {
    mongodb: "mongodb://localhost:27017",

    web: {
        auth: {
            login: "example",
            pwd: "pwd"
        },
        http: {
            port: 80,
        },
        https: {
            port: 443,
            enabled: false,
            key: "",
            cert: ""
        },
    },

    /* Тестировалось с RSA ключом */
    security: {
        publicKey: "GENERATE",
        privateKey: "GENERATE",
        privatePwd: "GENERATE",
    }
};