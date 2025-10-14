import initSqlJs from 'sql.js';
import { ENV } from './config.js';
import fs from 'fs';
let db = null;
export function getDb() {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
}
export function ensureDatabase() {
    if (db)
        return;
    const SQL = initSqlJs({ locateFile: (file) => `node_modules/sql.js/dist/${file}` });
    // sql.js init returns a promise; block via deasync-like pattern is not ideal; instead, we lazily sync using then().
    // But our server startup is synchronous here; convert to sync via Atomics wait using a small helper.
    const sab = new SharedArrayBuffer(4);
    const ia = new Int32Array(sab);
    let error = null;
    SQL
        .then((SQLModule) => {
        let buffer = undefined;
        if (fs.existsSync(ENV.DB_FILE)) {
            buffer = fs.readFileSync(ENV.DB_FILE);
        }
        const database = buffer ? new SQLModule.Database(buffer) : new SQLModule.Database();
        database.run('PRAGMA foreign_keys = ON;');
        migrateAndSeed(database);
        db = database;
        persist();
        Atomics.store(ia, 0, 1);
        Atomics.notify(ia, 0, 1);
    })
        .catch((e) => {
        error = e;
        Atomics.store(ia, 0, 1);
        Atomics.notify(ia, 0, 1);
    });
    // Wait until init done
    while (Atomics.load(ia, 0) === 0) {
        Atomics.wait(ia, 0, 0, 100);
    }
    if (error)
        throw error;
}
function migrateAndSeed(database) {
    // Users (citizens)
    database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
    );
  `);
    // Schemes
    database.run(`
    CREATE TABLE IF NOT EXISTS schemes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      department TEXT,
      created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
    );
  `);
    // Applications (for schemes)
    database.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_id TEXT NOT NULL UNIQUE,
      user_id INTEGER,
      scheme_id INTEGER,
      data_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'submitted',
      created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
      updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE SET NULL
    );
  `);
    // Grievances
    database.run(`
    CREATE TABLE IF NOT EXISTS grievances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
      updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);
    // Feedback for grievances
    database.run(`
    CREATE TABLE IF NOT EXISTS grievance_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grievance_id INTEGER NOT NULL,
      rating INTEGER CHECK (rating BETWEEN 1 AND 5),
      comments TEXT,
      created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
      FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE
    );
  `);
    // Contact messages
    database.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
    );
  `);
    seedIfEmpty(database);
}
function seedIfEmpty(database) {
    const [{ c }] = database.exec('SELECT COUNT(*) as c FROM schemes')[0]?.values.map((row) => ({ c: Number(row[0]) })) ?? [{ c: 0 }];
    if (c === 0) {
        const stmt = database.prepare('INSERT INTO schemes (title, description, department) VALUES (?, ?, ?)');
        database.run('BEGIN');
        stmt.run(['Farmers Support Scheme', 'Subsidies and financial assistance for farmers', 'Agriculture']);
        stmt.run(['Healthcare Assistance', 'Financial support for critical healthcare', 'Health']);
        stmt.run(['Education Scholarship', 'Scholarships for higher education', 'Education']);
        database.run('COMMIT');
    }
}
export function persist() {
    if (!db)
        return;
    const data = Buffer.from(db.export());
    fs.writeFileSync(ENV.DB_FILE, data);
}
