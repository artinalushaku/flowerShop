import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('flowershop', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

export default sequelize;