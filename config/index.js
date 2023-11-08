import { config } from "dotenv"
config();

const Config = {
    port: process.env.PORT || 3115
}

export default Config