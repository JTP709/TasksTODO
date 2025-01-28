const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const connectToDatabase = (app) => {
  const db = new sqlite3.Database(path.resolve(__dirname, './todo.db'), (err) => {
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

module.exports = connectToDatabase;
