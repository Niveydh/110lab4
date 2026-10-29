
import express from "express";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

type LeaderboardEntry = {
    score: number;
    timestamp: string;
};

const LEADERBOARD_FILE = new URL("./leaderboard.json", import.meta.url);

const app = express();

app.use(express.json());

// Load leaderboard from JSON file
function loadLeaderboard(): LeaderboardEntry[] {
    if (!existsSync(LEADERBOARD_FILE)) {
        return [];
    }

    const text = readFileSync(LEADERBOARD_FILE, "utf8");
    return JSON.parse(text) as LeaderboardEntry[];
}

// Save leaderboard to JSON file
function saveLeaderboard(entries: LeaderboardEntry[]): void {
    const jsonString = JSON.stringify(entries);
    writeFileSync(LEADERBOARD_FILE, jsonString, "utf8");
}

// GET route to retrieve leaderboard
app.get("/api/leaderboard", (_req, res) => {
    const entries = loadLeaderboard();
    res.json(entries);
});

// POST route to save leaderboard
app.post("/api/leaderboard", (req, res) => {
    saveLeaderboard(req.body);
    res.json({ message: "Saved" });
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
