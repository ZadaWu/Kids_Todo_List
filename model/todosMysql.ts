import { getMysqlClient } from '~/lib/mysql'

export interface Todo {
  id: number
  title: string
  is_completed: boolean
  created_at: Date
  list_id: number
}

export const useTodos = () => {
  const getTodos = async (uid: string) => {
    try {
      const mysql = await getMysqlClient()
      const [rows] = await mysql.execute('SELECT * FROM todos WHERE list_id IN (SELECT id FROM lists WHERE firebase_uid = ?)', [uid])
      return rows as Todo[]
    } catch (error) {
      console.error('Error fetching todos:', error)
      throw error
    }
  }

  const addTodo = async ({ title, is_completed, created_at, list_id }: { 
    title: string, 
    is_completed: boolean, 
    created_at: Date,
    list_id: number 
  }) => {
    try {
      const mysql = await getMysqlClient()
      const [result] = await mysql.execute(
        'INSERT INTO todos (title, is_completed, created_at, list_id) VALUES (?, ?, ?, ?)',
        [title, is_completed, created_at, list_id]
      )
      const insertId = (result as any).insertId
      return {
        id: insertId,
        title,
        is_completed,
        created_at,
        list_id
      } as Todo
    } catch (error) {
      console.error('Error adding todo:', error)
      throw error
    }
  }

  const updateTodo = async (id: number, is_completed: boolean) => {
    try {
      const mysql = await getMysqlClient()
      await mysql.execute(
        'UPDATE todos SET is_completed = ? WHERE id = ?',
        [is_completed, id]
      )
      return { id, is_completed }
    } catch (error) {
      console.error('Error updating todo:', error)
      throw error
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      const mysql = await getMysqlClient()
      await mysql.execute('DELETE FROM todos WHERE id = ?', [id])
    } catch (error) {
      console.error('Error deleting todo:', error)
      throw error
    }
  }

  return {
    getTodos,
    addTodo,
    updateTodo,
    deleteTodo
  }
}
