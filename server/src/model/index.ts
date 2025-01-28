import path from 'path';
import { Sequelize } from 'sequelize';

const dbPath = path.resolve(__dirname, './todo.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
});

export default sequelize;
