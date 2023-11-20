import { config } from "dotenv"
config();

const Config = {
    port: process.env.PORT || 3115,
    wsPort: process.env.WS_PORT || 1990,
    mongoDB: {
        url: process.env.MONGO_DB_URL || 'mongodb://localhost:27017',
        dbName: process.env.MONGO_DB_NAME || 'modern_app'
    },
    JWTSecret: process.env.JWTSECRET || 'mysecret',
    SendgridAPIKey: process.env.SENDGRID_API_KEY || 'SENDGRID_API_KEY',
    fromEmail: process.env.FROM_EMAIL || 'your@example.com',
    userRoles: ['user', 'admin', 'editor'],
    userStatuses: ['new', 'active', 'inactive'],
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET
}

export default Config