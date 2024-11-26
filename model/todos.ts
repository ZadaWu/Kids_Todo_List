import { getSupabaseClient } from '~/lib/superbase'

// 定义Todo类型接口
export interface Todo {
  id: number
  title: string
  is_completed: boolean
  created_at: Date
  user_id: string
}

// 创建todos相关的CRUD操作
export const useTodos = () => {
  // 获取Supabase客户端实例
  const supabase = getSupabaseClient()

  // 查询所有todos
  const getTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching todos:', error)
      throw error
    }
    return data as Todo[]
  }

  // 创建新的todo
  const addTodo = async ({title, is_completed, created_at}: {title: string, is_completed: boolean, created_at: Date}) => {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ 
        title,
        is_completed,
        created_at: created_at
      }])
      .select()
      .single()

    if (error) {
      console.error('Error adding todo:', error)
      throw error
    }
    return data as Todo
  }

  // 更新todo状态
  const updateTodo = async (id: string, is_completed: boolean) => {
    const { data, error } = await supabase
      .from('todos')
      .update({ 
        is_completed,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating todo:', error)
      throw error
    }
    return data as Todo
  }

  // 删除todo
  const deleteTodo = async (id: number) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting todo:', error)
      throw error
    }
  }

  // 返回所有CRUD操作方法
  return {
    getTodos,
    addTodo, 
    updateTodo,
    deleteTodo
  }
}

