export default {
    persistence: process.env.PERSISTENCE,
    port: process.env.SERVER_PORT || 8080,
    db: {
        mongodbURL: process.env.DB_MONGO_ATLAS
    },
    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    github: {
        urlCallbackGithub: process.env.URL_CALLBACK_GITHUB,
        clientGithub: process.env.CLIENT_GITHUB,
        secretGithub: process.env.SECRET_GITHUB
    }
}