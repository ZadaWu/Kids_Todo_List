import mysql from 'mysql2/promise';
import type { Pool, PoolOptions } from 'mysql2/promise';
import { useRuntimeConfig } from '#imports'

let mysqlInstance: Pool | null = null;


export const getMysqlClient = async () => {
  if (mysqlInstance) {
    return mysqlInstance;
  }

  try {
    const config = useRuntimeConfig();
    
    const poolConfig: PoolOptions = {
      host: config.public.mysqlHost as string || 'localhost',
      user: config.public.mysqlUser as string || 'root',
      password: config.public.mysqlPassword as string || '',
      database: config.public.mysqlDatabase as string || 'family_todo',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    mysqlInstance = mysql.createPool(poolConfig);

    // 测试连接
    await mysqlInstance.getConnection();
    console.log('MySQL connection established');

    return mysqlInstance;
  } catch (error) {
    console.error('Error creating MySQL connection:', error);
    throw error;
  }
};

// 优雅关闭连接
process.on('SIGINT', async () => {
  if (mysqlInstance) {
    try {
      await mysqlInstance.end();
      console.log('MySQL connection closed');
    } catch (error) {
      console.error('Error closing MySQL connection:', error);
    }
    process.exit(0);
  }
});