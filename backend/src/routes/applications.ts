import { Router } from 'express';
import { z } from 'zod';
import { getDb, persist } from '../db.js';

const router = Router();

const createSchema = z.object({
  user: z.object({ name: z.string().min(2), email: z.string().email().optional(), phone: z.string().optional() }).optional(),
  userId: z.number().int().positive().optional(),
  schemeId: z.number().int().positive(),
  data: z.record(z.any()),
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
    const trackingId = `T-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
    const stmtApp = db.prepare('INSERT INTO applications (tracking_id, user_id, scheme_id, data_json) VALUES (?, ?, ?, ?)');
    stmtApp.run([trackingId, userId ?? null, body.schemeId, JSON.stringify(body.data)]);
    const created = db.exec('SELECT * FROM applications ORDER BY id DESC LIMIT 1')[0]?.values?.[0];
    persist();
    res.status(201).json(created ? { id: created[0], tracking_id: created[1], user_id: created[2], scheme_id: created[3], data_json: created[4], status: created[5], created_at: created[6], updated_at: created[7] } : {});
  } catch (e) {
    next(e);
  }
});

router.get('/track/:trackingId', (req, res) => {
  const resDb = getDb().exec(`SELECT id, tracking_id, status, created_at, updated_at, scheme_id, data_json FROM applications WHERE tracking_id = '${req.params.trackingId.replace(/'/g, "''")}'`);
  const row = resDb[0]?.values?.[0];
  if (!row) return res.status(404).json({ error: 'Application not found' });
  res.json({ id: row[0], tracking_id: row[1], status: row[2], created_at: row[3], updated_at: row[4], scheme_id: row[5], data_json: row[6] });
});

router.get('/', (_req, res) => {
  const resDb = getDb().exec('SELECT id, tracking_id, status, created_at, updated_at, scheme_id FROM applications ORDER BY id DESC');
  const rows = (resDb[0]?.values ?? []).map((r: any[]) => ({ id: r[0] as number, tracking_id: r[1] as string, status: r[2] as string, created_at: r[3] as string, updated_at: r[4] as string, scheme_id: r[5] as number }));
  res.json(rows);
});

const updateSchema = z.object({ status: z.enum(['submitted', 'in_review', 'approved', 'rejected']).optional() });
router.patch('/:id', (req, res, next) => {
  try {
    const body = updateSchema.parse(req.body);
    const existingRes = getDb().exec(`SELECT * FROM applications WHERE id = ${Number(req.params.id)}`);
    const existing = existingRes[0]?.values?.[0];
    if (!existing) return res.status(404).json({ error: 'Application not found' });
    const status = body.status ?? existing[5];
    getDb().run("UPDATE applications SET status = ?, updated_at = DATETIME('now') WHERE id = ?", [status, Number(req.params.id)]);
    const updatedRes = getDb().exec(`SELECT * FROM applications WHERE id = ${Number(req.params.id)}`);
    const u = updatedRes[0]?.values?.[0];
    persist();
    res.json(u ? { id: u[0], tracking_id: u[1], user_id: u[2], scheme_id: u[3], data_json: u[4], status: u[5], created_at: u[6], updated_at: u[7] } : {});
  } catch (e) {
    next(e);
  }
});

export default router;


