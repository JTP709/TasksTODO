import sqlite3 from 'sqlite3';
import { Express } from 'express';
import path from 'path';

const connectToDatabase = (app: Express) => {
  const dbPath = path.resolve(__dirname, './todo.db');
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error connecting to the database', err);
    } else {
      console.log('Connected to the database');
      app.listen(4000, () => {
        console.log('Server is running on port 4000');
      });
    }
  });

  process.on('exit', () => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database connection', err.message);
      } else {
        console.log('Closed the database connection.');
      }
    });
  });

  return db;
};

export default connectToDatabase;
