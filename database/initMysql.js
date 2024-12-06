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


    // 创建清单表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS lists (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        cover_image TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        is_archived BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id)
      );
    `);


    // 创建待办事项表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        list_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
        INDEX idx_list_id (list_id)
      );
    `);

    // 添加 firebase_uid 字段到 lists 表
    await connection.query(`
      ALTER TABLE lists
      ADD COLUMN firebase_uid VARCHAR(128) DEFAULT NULL,
      ADD INDEX idx_firebase_uid (firebase_uid),
      ADD CONSTRAINT fk_lists_firebase_uid 
      FOREIGN KEY (firebase_uid) 
      REFERENCES users(firebase_uid) 
      ON DELETE CASCADE;
    `);

    // 添加 firebase_uid 字段到 todos 表
    await connection.query(`
      ALTER TABLE todos
      ADD COLUMN firebase_uid VARCHAR(128) DEFAULT NULL,
      ADD INDEX idx_firebase_uid (firebase_uid),
      ADD CONSTRAINT fk_todos_firebase_uid 
      FOREIGN KEY (firebase_uid) 
      REFERENCES users(firebase_uid) 
      ON DELETE CASCADE;
    `);

    console.log('Database and tables created successfully!');
    await connection.end();

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// 创建一个单独的函数来添加新字段
async function addFirebaseUidColumns() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: 'family_todo',
      multipleStatements: true
    });

    // 检查列是否存在，如果不存在则添加
    const addColumnIfNotExists = async (table, column) => {
      const [columns] = await connection.query(
        `SELECT COLUMN_NAME 
         FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = 'family_todo' 
         AND TABLE_NAME = ? 
         AND COLUMN_NAME = ?`,
        [table, column]
      );
      
      if (!columns.length) {
        await connection.query(`
          ALTER TABLE ${table}
          ADD COLUMN ${column} VARCHAR(128) DEFAULT NULL,
          ADD INDEX idx_${column} (${column}),
          ADD CONSTRAINT fk_${table}_${column}
          FOREIGN KEY (${column}) 
          REFERENCES users(firebase_uid) 
          ON DELETE CASCADE;
        `);
        console.log(`Added ${column} to ${table}`);
      } else {
        console.log(`Column ${column} already exists in ${table}`);
      }
    };

    // 添加列到两个表
    await addColumnIfNotExists('lists', 'firebase_uid');
    await addColumnIfNotExists('todos', 'firebase_uid');

    console.log('Firebase UID columns check completed!');
    await connection.end();

  } catch (error) {
    console.error('Error adding Firebase UID columns:', error);
    process.exit(1);
  }
}

// 导出函数供其他文件使用
export { initDatabase, addFirebaseUidColumns };

// 根据命令行参数执行不同的操作
const command = process.argv[2];
if (command === 'init') {
  initDatabase();
} else if (command === 'add-firebase-uid') {
  addFirebaseUidColumns();
} else {
  console.log('Please specify a command: init or add-firebase-uid');
}
