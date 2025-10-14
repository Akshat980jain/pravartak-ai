export function notFoundHandler(_req, res) {
    res.status(404).json({ error: 'Not found' });
}
export function errorHandler(err, _req, res, _next) {
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    const status = err?.status || 500;
    const message = err?.message || 'Internal server error';
    res.status(status).json({ error: message });
}
