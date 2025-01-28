const getTasksControllers = (db) => ({
  get_tasks: (req, res) => {
    const userId = req.userId;
  
    db.all('SELECT * FROM tasks WHERE userId = ?', [userId], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
        return;
      }
  
      res.json(rows);
    });
  },
  post_tasks: (req, res) => {
    const userId = req.userId;
    const { title } = req.body;
  
    db.run('INSERT INTO tasks (userId, title, completed) VALUES (?, ?, ?)', [userId, title, false], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'An error has occurred' });
      } else {
        db.get('SELECT last_insert_rowid() AS id', (err, row) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: err.message || 'Internal server error' });
          } else {
            res.status(201).json({ id: row.id, title, completed: false });
          }
        });
      }
    });
  },
  put_tasks: (req, res) => {
    const userId = req.userId;
    const { title, completed } = req.body;
    const { id } = req.params;
  
    db.run(`
      UPDATE tasks 
      SET title = COALESCE(?, title), completed = COALESCE(?, completed)
      WHERE userId = ? AND id in (?);
    `, [title, completed, userId, id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Internal server error" });
      } else {
        db.get("SELECT last_insert_rowid() AS id", (err, row) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: err.message || 'Internal server error' });
          } else {
            res.status(201).json({ message: `Task ${row.id} has been updated` });
          }
        });
      }
    });
  },
  delete_tasks: (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
  
    db.run(`
      DELETE FROM tasks WHERE userId = ? AND id IN (?);
    `, [userId, id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Internal server error" });
      } else {
        res.status(204).end();
      }
    });
  },
});

module.exports = getTasksControllers;
