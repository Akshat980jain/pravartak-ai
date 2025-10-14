import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

router.get('/benefit-distribution', (_req, res) => {
  const db = getDb();
  const result = db.exec(`
    SELECT COALESCE(s.department, 'Uncategorized') AS sector,
           COUNT(a.id) AS count
    FROM schemes s
    LEFT JOIN applications a ON a.scheme_id = s.id
    GROUP BY sector
    ORDER BY count DESC, sector ASC;
  `);
  const rows = (result[0]?.values ?? []).map((r: any[]) => ({
    sector: String(r[0]),
    count: Number(r[1])
  }));
  res.json(rows);
});

export default router;


