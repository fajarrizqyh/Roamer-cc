const connection = require('../conn/db');
const app = require('../conn/firebase');

const {
    getAuth
} = require("firebase/auth");


const auth = getAuth(app);

// Create a new log
async function createLog(log) {
    const user = await auth.currentUser;
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO logbook (place_id, visited_time, text, user_id) VALUES (?, ?, ?, ?)', [log.place_id, log.visited_time, log.text, user.uid], (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                reject(err);
            } else {
                // console.log(results);
                resolve(results);
            }
        });
    });
}

// Get all logs
async function getLogs() {
    const user = await auth.currentUser;
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM logbook', (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}
// Get a specific log
async function getLog(log_id) {
    const user = await auth.currentUser;
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM logbook WHERE log_id = ?', [log_id], (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                reject(err);
            } else {
                resolve(results);
            }
        }); 
    });
}

// Update a specific log
async function updateLog(log_id, updatedLog) {
    const user = await auth.currentUser;
    try {
        const query = 'UPDATE logbook SET place_id = ?, visited_time = ?, text = ?, user_id = ? WHERE log_id = ?';
        await connection.query(query, [updatedLog.place_id, updatedLog.visited_time, updatedLog.text, user.uid, log_id]);
    } catch (error) {
        console.error('Error updating log:', error);
        throw error;
    }
}

// Delete a specific log
async function deleteLog(log_id) {
    try {
        const query = 'DELETE FROM logbook WHERE log_id = ?';
        await connection.query(query, [log_id]);
    } catch (error) {
        console.error('Error deleting log:', error);
        throw error;
    }
}
module.exports = { createLog, getLogs, getLog, updateLog, deleteLog };