import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { ENV } from './config.js';
import { ensureDatabase } from './db.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
const app = express();
// Security & middleware
app.use(helmet());
app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
}));
// Health
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api', routes);
// 404 and error handling
app.use(notFoundHandler);
app.use(errorHandler);
async function start() {
    ensureDatabase();
    app.listen(ENV.PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Backend listening on http://localhost:${ENV.PORT}`);
    });
}
start();
