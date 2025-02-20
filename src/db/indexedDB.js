import { openDB } from "idb";

const DB_NAME = "quizDB";
const STORE_NAME = "quizHistory";

// Initialize the IndexedDB
async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if(!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, {keyPath : "id" , autoIncrement : true});
            }
        },
    });
}

// Save quiz attempts
export async function saveQuizAttempt(score, total) {
    const db = await initDB();
    await db.add(STORE_NAME, {
      timestamp: new Date().toISOString(),
      score,
      total,
    });
    console.log("Quiz attempt saved!"); // Add a log to confirm save
  }
  

// Get Quiz History
export async function getQuizHistory() {
    const db = await initDB();
    return db.getAll(STORE_NAME);
}