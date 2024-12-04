import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      multipleStatements: true // 允许执行多条 SQL 语句
    });

    // 创建数据库
    await connection.query(`
      CREATE DATABASE IF NOT EXISTS family_todo;
      USE family_todo;
    `);

    // 创建用户表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        firebase_uid VARCHAR(128) UNIQUE NOT NULL,
        email VARCHAR(255),
        display_name VARCHAR(100),
        photo_url TEXT,
        provider VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_firebase_uid (firebase_uid)
      );
    `);

    console.log('Database and tables created successfully!');
    await connection.end();

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// 改成可导出的方式，这样其他文件可以按需导入
initDatabase();
