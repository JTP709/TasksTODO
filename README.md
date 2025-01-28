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

On the FIRST time running the application, open `/server/src/app.ts` and uncomment out lines 37 and 38:

```typescript
await sequelize.sync({ alter: true });
console.log('All models were synchronized successfully');
```

For some reason, on subsequent starts, `sequelize` would run into errors trying to overwrite the database. I haven't solved this problem other than to prevent it from syncing the database on start unless the database is fresh.

Run the application with `npm run dev`.