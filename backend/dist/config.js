export const ENV = {
    PORT: Number(process.env.PORT) || 4000,
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    DB_FILE: process.env.DB_FILE || 'data.sqlite',
};
