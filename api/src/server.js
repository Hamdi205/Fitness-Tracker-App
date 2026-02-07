const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

const {
    DB_HOST = "mariadb",
    DB_PORT = "3306",
    DB_USER = "fitness_user",
    DB_PASSWORD = "user_password",
    DB_NAME = "fitness_db",
} = process.env;

// Lag en liten "pool" (bedre enn å åpne ny connection hver request)
const pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

app.get("/health", (req, res) => res.json({ ok: true, message: "API running" }));

app.get("/db-check", async (req, res) => {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ db: rows[0].ok });
});

/**
 * Workouts
 * - POST /workouts  { date: "2026-02-06", note?: "..." }
 * - GET  /workouts
 */
app.post("/workouts", async (req, res) => {
    try {
        const { date, note = null } = req.body;

        if (!date) {
            return res.status(400).json({ ok: false, error: "date is required (YYYY-MM-DD)" });
        }

        const [result] = await pool.execute(
            "INSERT INTO workouts (date, note) VALUES (?, ?)",
            [date, note]
        );

        res.status(201).json({ ok: true, id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Failed to create workout" });
    }
});

app.get("/workouts", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, date, note, created_at FROM workouts ORDER BY date DESC, id DESC"
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Failed to fetch workouts" });
    }
});

/**
 * Exercises
 * - POST /workouts/:id/exercises  { name, sets, reps, weight? }
 * - GET  /workouts/:id/exercises
 */
app.post("/workouts/:id/exercises", async (req, res) => {
    try {
        const workoutId = Number(req.params.id);
        const { name, sets, reps, weight = null } = req.body;

        if (!workoutId) return res.status(400).json({ ok: false, error: "Invalid workout id" });
        if (!name || sets == null || reps == null) {
            return res.status(400).json({
                ok: false,
                error: "name, sets, reps are required",
            });
        }

        const [result] = await pool.execute(
            "INSERT INTO exercises (workout_id, name, sets, reps, weight) VALUES (?, ?, ?, ?, ?)",
            [workoutId, name, Number(sets), Number(reps), weight === null ? null : Number(weight)]
        );

        res.status(201).json({ ok: true, id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Failed to create exercise" });
    }
});

app.get("/workouts/:id/exercises", async (req, res) => {
    try {
        const workoutId = Number(req.params.id);
        if (!workoutId) return res.status(400).json({ ok: false, error: "Invalid workout id" });

        const [rows] = await pool.execute(
            "SELECT id, workout_id, name, sets, reps, weight FROM exercises WHERE workout_id = ? ORDER BY id ASC",
            [workoutId]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Failed to fetch exercises" });
    }
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

// Example:
// curl -X POST http://localhost:3000/workouts \
//   -H "Content-Type: application/json" \
//   -d '{"date":"2026-02-06","note":"Push day"}'

