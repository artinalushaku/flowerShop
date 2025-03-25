import mysql from 'mysql2/promise';

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  try {
    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS flowershop');
    console.log('Database created or already exists');
    
    // Switch to the flowershop database
    await connection.query('USE flowershop');
    
    // Create products table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category ENUM('Wedding Flowers', 'Birthday Bouquets', 'Seasonal Specials', 'Custom Arrangements') NOT NULL,
        imageUrl VARCHAR(255) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Products table created or already exists');
    
    // Add some sample data if the table is empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
    
    if (rows[0].count === 0) {
      console.log('Adding sample products...');
      
      await connection.query(`
        INSERT INTO products (name, description, price, category, imageUrl, stock) VALUES
        ('Red Rose Bouquet', 'A beautiful bouquet of red roses, perfect for romantic occasions.', 49.99, 'Wedding Flowers', 'https://images.unsplash.com/photo-1545063328-c8e3faffa811', 10),
        ('Spring Tulips', 'Colorful tulips to brighten any room.', 29.99, 'Seasonal Specials', 'https://images.unsplash.com/photo-1554631995-a1c0316a288c', 15),
        ('Birthday Surprise', 'A mix of colorful flowers perfect for birthdays.', 39.99, 'Birthday Bouquets', 'https://images.unsplash.com/photo-1558684251-d0df8949a127', 8)
      `);
      
      console.log('Sample products added');
    }
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await connection.end();
    console.log('Database setup complete');
  }
}

createDatabase(); 