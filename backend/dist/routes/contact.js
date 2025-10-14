import { Router } from 'express';
import { z } from 'zod';
import { getDb, persist } from '../db.js';
const router = Router();
const messageSchema = z.object({ name: z.string().min(2), email: z.string().email().optional(), message: z.string().min(5) });
router.post('/', (req, res, next) => {
    try {
        const body = messageSchema.parse(req.body);
        const stmt = getDb().prepare('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)');
        stmt.run([body.name, body.email ?? null, body.message]);
        const created = getDb().exec('SELECT * FROM contact_messages ORDER BY id DESC LIMIT 1')[0]?.values?.[0];
        persist();
        res.status(201).json(created ? { id: created[0], name: created[1], email: created[2], message: created[3], created_at: created[4] } : {});
    }
    catch (e) {
        next(e);
    }
});
router.get('/', (_req, res) => {
    const resDb = getDb().exec('SELECT * FROM contact_messages ORDER BY id DESC');
    const rows = (resDb[0]?.values ?? []).map((m) => ({ id: m[0], name: m[1], email: m[2], message: m[3], created_at: m[4] }));
    res.json(rows);
});
export default router;
