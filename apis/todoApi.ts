import type { Todo } from '~/model/todosMysql'


export const useTodoApi = () => {
  const getTodos = async (uid: string) => {
    const { $token, $user } = useNuxtApp()
    const { data } = await useFetch<{ data: Todo[] }>('/api/todos', {
      query: { uid },
      headers: {
        'Authorization': `Bearer ${$token.value}`
      }
    })
    return data.value?.data || []
  }

  const getTodosByListId = async (listId: number) => {
    const { $token } = useNuxtApp()
    const { data } = await useFetch<{ data: Todo[] }>(`/api/todos?listId=${listId}`, {
      headers: {
        'Authorization': `Bearer ${$token.value}`
      }
    })
    return data.value?.data || []
  }

  const addTodo = async (todo: Partial<Todo>) => {
    const { $token, $user } = useNuxtApp()
    const { data } = await useFetch<{ data: Todo }>('/api/todos', {
      method: 'POST',
      body: {...todo, firebaseUid: $user?.value?.uid},
      headers: {
        'Authorization': `Bearer ${$token.value}`
      }
    })
    return data.value?.data
  }

  const updateTodo = async (id: number, is_completed: boolean) => {
    const { $token } = useNuxtApp()
    const { data } = await useFetch<{ data: Todo }>(`/api/todos/${id}`, {
      method: 'PATCH',
      body: { is_completed },
      headers: {
        'Authorization': `Bearer ${$token.value}`
      }
    })
    return data.value?.data
  }

  const deleteTodo = async (id: number) => {
    const { $token } = useNuxtApp()
    await useFetch(`/api/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${$token.value}`
      }
    })
  }

  return {
    getTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    getTodosByListId
  }
}