import mysql from 'mysql2/promise';

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  try {
    await connection.query('CREATE DATABASE IF NOT EXISTS flowershop');
    console.log('Database created or already exists');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await connection.end();
  }
}

createDatabase(); 