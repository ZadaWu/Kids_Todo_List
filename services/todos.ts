import { useTodos as useBaseTodos, type Todo } from '~/model/todosMysql.js'

// 是的,这是一个Vue的自定义Composition API Hook
// 使用use前缀命名是Vue的约定,表示这是一个可复用的组合式函数
// 它返回todos相关的状态和方法,可以在组件中通过组合式API的方式使用
export const useTodos = () => {
  const baseTodos = useBaseTodos()

  // 查询所有todos，添加错误处理
  const getTodos = async () => {
    try {
      return await baseTodos.getTodos()
    } catch (error) {
      console.error('Service error fetching todos:', error)
      throw error
    }
  }

  // 创建todo，添加标题验证
  const addTodo = async ({title, is_completed, created_at, list_id}: {title: string, is_completed: boolean, created_at: Date, list_id: number}) => {
    // 验证标题
    if (!title || title.trim().length === 0) {
      throw new Error('Todo title cannot be empty')
    }
    if (title.length > 100) {
      throw new Error('Todo title cannot exceed 100 characters')
    }

    try {
      return await baseTodos.addTodo({title, is_completed, created_at, list_id})
    } catch (error) {
      console.error('Service error adding todo:', error)
      throw error
    }
  }

  // 更新todo状态，添加参数验证
  const updateTodo = async (id: string, is_completed: boolean) => {
    if (typeof id !== 'string') {
      throw new Error('Invalid todo id')
    }
    if (typeof is_completed !== 'boolean') {
      throw new Error('Completed status must be boolean')
    }

    try {
      return await baseTodos.updateTodo(id, is_completed)
    } catch (error) {
      console.error('Service error updating todo:', error)
      throw error
    }
  }

  // 删除todo，添加参数验证
  const deleteTodo = async (id: string) => {
    if (typeof id !== 'string') {
      throw new Error('Invalid todo id')
    }

    try {
      await baseTodos.deleteTodo(id)
    } catch (error) {
      console.error('Service error deleting todo:', error)
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
