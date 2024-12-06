import { getMysqlClient } from '@/lib/mysql'

export interface List {
    id: number
    name: string
    created_at: Date
    user_id: string
}

export const useLists = () => {
    const getLists = async (firebaseUid: string) => {
        try {
            const db = await getMysqlClient()
            
            // 先通过 firebase_uid 查询用户 ID
            const [userRows] = await db.query(
                'SELECT id FROM users WHERE firebase_uid = ?', 
                [firebaseUid]
            )
            
            if (!(userRows as any[]).length) {
                throw new Error('User not found')
            }
            
            const userId = (userRows as any[])[0].id

            // 使用用户 ID 查询列表
            const [listRows] = await db.query(
                'SELECT * FROM lists WHERE is_archived = FALSE AND user_id = ?', 
                [userId]
            )

            return (listRows as any[]).map(row => ({
                id: row.id,
                name: row.name,
                created_at: new Date(row.created_at),
                user_id: row.user_id
            })) as List[]
        } catch (error) {
            console.error('Error fetching lists:', error)
            throw error
        }
    }

    const getList = async (id: number) => {
        try {
            const db = await getMysqlClient()
            const [listRows] = await db.query(
                'SELECT * FROM lists WHERE id = ?', 
                [id]
            )
            return (listRows as any[])[0] as List
        } catch (error) {
            console.error('Error fetching list:', error)
            throw error
        }
    }

    const addList = async ({ name, firebaseUid }: { name: string, firebaseUid: string }) => {
        try {
            const db = await getMysqlClient()
        
            // 使用用户 ID 创建列表
            const [result] = await db.query(
                'INSERT INTO lists (name, firebaseUid) VALUES (?, ?)',
                [name, firebaseUid]
            )
            
            return {
                id: (result as any).insertId,
                name,
                created_at: new Date(),
                user_id: firebaseUid
            } as List
        } catch (error) {
            console.error('Error adding list:', error)
            throw error
        }
    }

    const deleteList = async (id: number) => {
        try {
            const db = await getMysqlClient()
            await db.query(
                'UPDATE lists SET is_archived = TRUE WHERE id = ?',
                [id]
            )
        } catch (error) {
            console.error('Error deleting list:', error)
            throw error
        }
    }

    const updateList = async (id: number, name: string) => {
        try {
            const db = await getMysqlClient()
            await db.query(
                'UPDATE lists SET name = ? WHERE id = ?',
                [name, id]
            )
            
            const [rows] = await db.query(
                'SELECT * FROM lists WHERE id = ?',
                [id]
            )
            const list = (rows as any[])[0]
            
            return {
                id,
                name,
                created_at: new Date(list.created_at),
                user_id: list.user_id
            } as List
        } catch (error) {
            console.error('Error updating list:', error)
            throw error
        }
    }

    return {
        getList,
        getLists,
        addList,
        deleteList,
        updateList
    }
}
