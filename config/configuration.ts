export default () => ({
    port: process.env.PORT || 3000,
    database: {
        url: process.env.DATABASE_URL,
        db_host: process.env.DB_HOST,
        db_port: process.env.DB_PORT,
        db_username: process.env.DB_USERNAME,
        db_password: process.env.DB_PASSWORD,
        db_name: process.env.DB_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    mail: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
    exchange: {
        apiKey: process.env.EXCHANGE_RATE_KEY,
    },
});
