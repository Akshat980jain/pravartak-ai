import { Router } from 'express';
import { z } from 'zod';
import { getDb, persist } from '../db.js';

const router = Router();

const createSchema = z.object({
  user: z.object({ name: z.string().min(2), email: z.string().email().optional(), phone: z.string().optional() }).optional(),
  userId: z.number().int().positive().optional(),
  subject: z.string().min(3),
  description: z.string().min(5),
});

router.post('/', (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const db = getDb();
    let userId = body.userId;
    if (!userId && body.user) {
      const stmt = db.prepare('INSERT INTO users (name, email, phone) VALUES (?, ?, ?)');
      stmt.run([body.user.name, body.user.email ?? null, body.user.phone ?? null]);
      const row = db.exec('SELECT id FROM users ORDER BY id DESC LIMIT 1')[0]?.values?.[0]?.[0];
      userId = Number(row);
    }
    const stmtG = db.prepare('INSERT INTO grievances (user_id, subject, description) VALUES (?, ?, ?)');
    stmtG.run([userId ?? null, body.subject, body.description]);
    const created = db.exec('SELECT * FROM grievances ORDER BY id DESC LIMIT 1')[0]?.values?.[0];
    persist();
    res.status(201).json(created ? { id: created[0], user_id: created[1], subject: created[2], description: created[3], status: created[4], created_at: created[5], updated_at: created[6] } : {});
  } catch (e) {
    next(e);
  }
});

router.get('/', (_req, res) => {
  const resDb = getDb().exec('SELECT * FROM grievances ORDER BY id DESC');
  const rows = (resDb[0]?.values ?? []).map((g: any[]) => ({ id: g[0] as number, user_id: g[1] as number, subject: g[2] as string, description: g[3] as string, status: g[4] as string, created_at: g[5] as string, updated_at: g[6] as string }));
  res.json(rows);
});

const updateSchema = z.object({ status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional() });
router.patch('/:id', (req, res, next) => {
  try {
    const body = updateSchema.parse(req.body);
    const existingRes = getDb().exec(`SELECT * FROM grievances WHERE id = ${Number(req.params.id)}`);
    const existing = existingRes[0]?.values?.[0];
    if (!existing) return res.status(404).json({ error: 'Grievance not found' });
    const status = body.status ?? existing[4];
    getDb().run("UPDATE grievances SET status = ?, updated_at = DATETIME('now') WHERE id = ?", [status, Number(req.params.id)]);
    const updatedRes = getDb().exec(`SELECT * FROM grievances WHERE id = ${Number(req.params.id)}`);
    const u = updatedRes[0]?.values?.[0];
    persist();
    res.json(u ? { id: u[0], user_id: u[1], subject: u[2], description: u[3], status: u[4], created_at: u[5], updated_at: u[6] } : {});
  } catch (e) {
    next(e);
  }
});

const feedbackSchema = z.object({ rating: z.number().int().min(1).max(5), comments: z.string().optional() });
router.post('/:id/feedback', (req, res, next) => {
  try {
    const body = feedbackSchema.parse(req.body);
    const existingRes = getDb().exec(`SELECT * FROM grievances WHERE id = ${Number(req.params.id)}`);
    const existing = existingRes[0]?.values?.[0];
    if (!existing) return res.status(404).json({ error: 'Grievance not found' });
    const stmt = getDb().prepare('INSERT INTO grievance_feedback (grievance_id, rating, comments) VALUES (?, ?, ?)');
    stmt.run([Number(req.params.id), body.rating, body.comments ?? null]);
    const created = getDb().exec('SELECT * FROM grievance_feedback ORDER BY id DESC LIMIT 1')[0]?.values?.[0];
    persist();
    res.status(201).json(created ? { id: created[0], grievance_id: created[1], rating: created[2], comments: created[3], created_at: created[4] } : {});
  } catch (e) {
    next(e);
  }
});

export default router;


