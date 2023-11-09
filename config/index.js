import { config } from "dotenv"
config();

const Config = {
    port: process.env.PORT || 3115,
    mongoDB: {
        url: process.env.MongoDB_URL || 'mongodb://localhost:27017',
        dbName: 'modern_app'
    },
    JWTSecret: process.env.JWTSECRET || 'mysecret',
    SendgridAPIKey: process.env.SENDGRID_API_KEY || 'SENDGRID_API_KEY',
    fromEmail: process.env.FROM_EMAIL || 'your@example.com',
    userRoles: ['user', 'admin', 'editor'],
    userStatuses: ['new', 'active', 'inactive']
}

export default Config