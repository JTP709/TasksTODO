import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import authentication from './middleware/authentication';
import taskRoutes from './routes/tasks';
import sequelize from './model';
import dotenv from 'dotenv';
import path from 'path';

const envFile = {
  development: '.env',
  test: '.env.test',
  production: '.env.production',
}[process.env.NODE_ENV || 'development'];

dotenv.config({ path: path.resolve(__dirname, (envFile as string)) });

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes)
app.use('/api/tasks', authentication);
app.use('/api/tasks', taskRoutes);


(async function Main() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    if (process.env.NODE_ENV !== 'production') {
      // await sequelize.sync({ alter: true });
      // console.log('All models were synchronized successfully');
    }

    app.listen(4000, () => {
      console.log('Server is running on port 4000');
    });

    process.on('exit', () => {
      sequelize.close()
        .then(() => console.log('Closed the database connection.'))
        .catch((err) => console.error('Error closing database connection', err.message));
    });
  } catch (err) {
    console.error('Unable to connect to the database', err);
  }
})();
