import { Router } from 'express';
import { getDb, persist } from '../db.js';

const router = Router();

router.post('/seed-applications', (_req, res) => {
  const db = getDb();

  // Ensure at least one scheme exists
  let schemeId: number | null = null;
  const s = db.exec('SELECT id FROM schemes ORDER BY id ASC LIMIT 1');
  if (s[0]?.values?.[0]?.[0]) {
    schemeId = Number(s[0].values[0][0]);
  } else {
    db.run('INSERT INTO schemes (title, description, department) VALUES (?, ?, ?)', [
      'General Assistance',
      'Seeded scheme for demo data',
      'General',
    ]);
    const s2 = db.exec('SELECT id FROM schemes ORDER BY id DESC LIMIT 1');
    schemeId = Number(s2[0].values[0][0]);
  }

  const applicants = [
    { name: 'Aarav Sharma', category: 'SC', amount: 50000 },
    { name: 'Priya Verma', category: 'ST', amount: 75000 },
    { name: 'Vikram Singh', category: 'OBC', amount: 60000 },
    { name: 'Ananya Iyer', category: 'SC', amount: 45000 },
    { name: 'Rohan Gupta', category: 'OBC', amount: 52000 },
    { name: 'Neha Patel', category: 'ST', amount: 68000 },
    { name: 'Siddharth Rao', category: 'SC', amount: 40000 },
    { name: 'Ishita Bose', category: 'OBC', amount: 55000 },
    { name: 'Kunal Mehta', category: 'SC', amount: 61000 },
    { name: 'Meera Nair', category: 'ST', amount: 70000 },
    { name: 'Devansh Kulkarni', category: 'OBC', amount: 48000 },
  ];

  // First requested tracking id + generate more
  const trackingIds: string[] = ['DBT-PCR-5K7M2N9P'];
  while (trackingIds.length < applicants.length) {
    const tid = `DBT-PCR-${Math.random().toString(36).toUpperCase().slice(2, 10)}`;
    if (!trackingIds.includes(tid)) trackingIds.push(tid);
  }

  db.run('BEGIN');
  for (let i = 0; i < applicants.length; i++) {
    const a = applicants[i];
    // Insert user
    db.run('INSERT INTO users (name) VALUES (?)', [a.name]);
    const u = db.exec('SELECT id FROM users ORDER BY id DESC LIMIT 1');
    const userId = Number(u[0].values[0][0]);

    // Application payload stored in data_json
    const appliedDate = new Date(Date.now() - (i + 1) * 86400000).toISOString().slice(0, 10);
    const data = {
      applicantName: a.name,
      category: a.category,
      appliedDate,
      amount: a.amount,
    } as any;

    db.run('INSERT INTO applications (tracking_id, user_id, scheme_id, data_json, status) VALUES (?, ?, ?, ?, ?)', [
      trackingIds[i],
      userId,
      schemeId,
      JSON.stringify(data),
      i % 3 === 0 ? 'in_review' : 'submitted',
    ]);
  }
  db.run('COMMIT');

  persist();
  res.json({ inserted: applicants.length, trackingIds });
});

export default router;

// Dangerous cleanup helpers (dev only)
router.post('/delete-john-doe', (_req, res) => {
  const db = getDb();
  db.run('BEGIN');
  // Remove applications that mention John Doe in embedded JSON
  db.run("DELETE FROM applications WHERE data_json LIKE ?", ['%John Doe%']);
  // Null out application user references for John Doe users, then delete the users
  const usersRes = db.exec("SELECT id FROM users WHERE name = 'John Doe'");
  const userIds = (usersRes[0]?.values ?? []).map((r: any[]) => Number(r[0]));
  for (const uid of userIds) {
    db.run('UPDATE applications SET user_id = NULL WHERE user_id = ?', [uid]);
  }
  db.run("DELETE FROM users WHERE name = 'John Doe'");
  db.run('COMMIT');
  persist();
  res.json({ removedUsers: userIds.length });
});


