# Tasks TODO!

This is a quick one day project to practice full stack development with Express, Next.js, SQLite, Sequelize ORM, and Typescript.

I tried to keep this as vanilla as possible, only reaching for libraries and patterns as necessary for an app of this size, but with some more focus on practicing building an API that supports CRUD operations and authentication.

## Running Locally

### Client:
Change the directory into the `/client` directory with `cd client`.

Install the node packages with `npm install`.

Run the application with `npm run dev`.

### Server:
Open a new terminal window (or tab depending on your terminal application).

Change the directory into the `/server`.

Install the node packages with `npm install`.

Rename the file `_todo.sqlite` in the `/server/model` to `todo.sqlite` (remove the underscore).

Run the application with `npm run dev`.

**Troubleshooting:**
Sometimes the sequelize ORM will run into some errors when trying to sync the database.

If this happens, easiest way to recover is to:
1. Delete the database and create a fresh one. Delete the file `todo.sqlite` in the `/server/model` directory and create a new one with the same name.
2. Restart the server.

If this continues to happen, you can comment out lines 37 and 38 in `/server/src/app.ts`.
```typescript
await sequelize.sync({ alter: true });
console.log('All models were synchronized successfully');
```
