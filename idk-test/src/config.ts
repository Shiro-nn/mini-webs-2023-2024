export default {
    postgres: 'postgresql://postgres:pwd@localhost:5432/database',

    http: {
        port: 80,
    },
    https: {
        port: 443,
        enabled: false,
        key: "",
        cert: ""
    },

    /* Тестировалось с RSA ключом */
    security: {
        publicKey: "GENERATE",
        privateKey: "GENERATE",
        privatePwd: "GENERATE",
    }
}