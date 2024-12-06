import type { List } from '~/model/listMysql'


export const useListApi = () => {
  const getLists = async (firebaseUid: string) => {
    const { $token } = useNuxtApp()
    const { data } = await useFetch<{ data: List[] }>('/api/lists', {
      query: { firebaseUid },
      headers: {
        'Authorization': `Bearer ${$token.value}`
      }
    })
    return data.value?.data || []
  }

  const getList = async (id: number) => {
    const { $token } = useNuxtApp()
    const { data } = await useFetch<{ data: List }>(`/api/lists/${id}`, {
      headers: {
        'Authorization': `Bearer ${$token.value}`
      }
    })
    return data.value?.data
  }

  const addList = async ({ name, firebaseUid }: { name: string, firebaseUid: string }) => {
    const { $token } = useNuxtApp()
    const { data } = await useFetch<{ data: List }>('/api/lists', {
      method: 'POST',
      body: { name, firebaseUid },
      headers: {
        'Authorization': `Bearer ${$token.value}`
      }
    })
    return data.value?.data
  }

  const updateList = async (id: number, name: string) => {
    const { $token } = useNuxtApp()
    const { data } = await useFetch<{ data: List }>(`/api/lists/${id}`, {
      method: 'PATCH',
      body: { name },
      headers: {
        'Authorization': `Bearer ${$token.value}`
      }
    })
    return data.value?.data
  }

  const deleteList = async (id: number) => {
    const { $token } = useNuxtApp()
    await useFetch(`/api/lists/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${$token.value}`
      }
    })
  }

  return {
    getLists,
    getList,
    addList,
    updateList,
    deleteList
  }
} 