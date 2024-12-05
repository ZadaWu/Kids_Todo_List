
import { getMysqlClient } from '~/lib/mysql'

export const upsertUser = async (userData: any) => {
  const mysqlClient = await getMysqlClient();
  await mysqlClient.query(
    `INSERT INTO users (firebase_uid, email, display_name, photo_url, provider) 
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE 
     firebase_uid = VALUES(firebase_uid),
     email = VALUES(email),
     display_name = VALUES(display_name), 
     photo_url = VALUES(photo_url),
     provider = VALUES(provider)`,
    [
      userData.firebaseUid,
      userData.email,
      userData.displayName,
      userData.photoUrl,
      userData.provider
    ]
  );
}