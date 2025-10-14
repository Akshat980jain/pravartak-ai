import { Router } from 'express';
import { z } from 'zod';
import { getDb, persist } from '../db.js';
const router = Router();
router.get('/', (_req, res) => {
    const result = getDb().exec('SELECT id, title, description, department, created_at FROM schemes ORDER BY id DESC');
    const rows = (result[0]?.values ?? []).map((r) => ({ id: r[0], title: r[1], description: r[2], department: r[3], created_at: r[4] }));
    res.json(rows);
});
const createSchema = z.object({
    title: z.string().min(2),
    description: z.string().min(5),
    department: z.string().optional().nullable(),
});
router.post('/', (req, res, next) => {
    try {
        const body = createSchema.parse(req.body);
        const db = getDb();
        const stmt = db.prepare('INSERT INTO schemes (title, description, department) VALUES (?, ?, ?)');
        stmt.run([body.title, body.description, body.department ?? null]);
        const row = db.exec('SELECT * FROM schemes ORDER BY id DESC LIMIT 1')[0]?.values?.[0];
        persist();
        res.status(201).json(row ? { id: row[0], title: row[1], description: row[2], department: row[3], created_at: row[4] } : {});
    }
    catch (e) {
        next(e);
    }
});
router.get('/:id', (req, res) => {
    const result = getDb().exec(`SELECT * FROM schemes WHERE id = ${Number(req.params.id)}`);
    const row = result[0]?.values?.[0];
    if (!row)
        return res.status(404).json({ error: 'Scheme not found' });
    res.json({ id: row[0], title: row[1], description: row[2], department: row[3], created_at: row[4] });
});
router.put('/:id', (req, res, next) => {
    try {
        const body = createSchema.partial().parse(req.body);
        const existingRes = getDb().exec(`SELECT * FROM schemes WHERE id = ${Number(req.params.id)}`);
        const existing = existingRes[0]?.values?.[0];
        if (!existing)
            return res.status(404).json({ error: 'Scheme not found' });
        const merged = {
            title: body.title ?? existing[1],
            description: body.description ?? existing[2],
            department: body.department ?? existing[3],
        };
        getDb().run('UPDATE schemes SET title = ?, description = ?, department = ? WHERE id = ?', [
            merged.title,
            merged.description,
            merged.department ?? null,
            Number(req.params.id),
        ]);
        const updatedRes = getDb().exec(`SELECT * FROM schemes WHERE id = ${Number(req.params.id)}`);
        const updated = updatedRes[0]?.values?.[0];
        persist();
        res.json({ id: updated[0], title: updated[1], description: updated[2], department: updated[3], created_at: updated[4] });
    }
    catch (e) {
        next(e);
    }
});
router.delete('/:id', (req, res) => {
    const before = getDb().exec(`SELECT COUNT(*) FROM schemes WHERE id = ${Number(req.params.id)}`)[0]?.values?.[0]?.[0] ?? 0;
    getDb().run('DELETE FROM schemes WHERE id = ?', [Number(req.params.id)]);
    const after = getDb().exec(`SELECT COUNT(*) FROM schemes WHERE id = ${Number(req.params.id)}`)[0]?.values?.[0]?.[0] ?? 0;
    if (before === 0 || after === before)
        return res.status(404).json({ error: 'Scheme not found' });
    persist();
    res.status(204).send();
});
export default router;
