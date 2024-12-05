import { getMysqlClient } from '@/lib/mysql'

export interface List {
    id: number  // MySQL 使用 number 类型的 ID
    name: string
    created_at: Date
    user_id: number
}

export const useLists = () => {
    const getLists = async () => {
        try {
            const db = await getMysqlClient()
            const [rows] = await db.query('SELECT * FROM lists WHERE is_archived = FALSE')
            return (rows as any[]).map(row => ({
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

    const addList = async ({ name, user_id }: { name: string, user_id: number }) => {
        try {
            const db = await getMysqlClient()
            const [result] = await db.query(
                'INSERT INTO lists (name, user_id) VALUES (?, ?)',
                [name, user_id]
            )
            
            return {
                id: (result as any).insertId,
                name,
                created_at: new Date(),
                user_id
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
        getLists,
        addList,
        deleteList,
        updateList
    }
}
