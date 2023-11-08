import { config } from "dotenv"
config();

const Config = {
    port: process.env.PORT || 3115,
    mongoDB: {
        url: process.env.MongoDB_URL || 'mongodb://localhost:27017',
        dbName: 'modern_app'
    },
    JWTSECRET: process.env.JWTSECRET || 'mysecret',
}

export default Config