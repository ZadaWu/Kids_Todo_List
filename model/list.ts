import { getSupabaseClient } from '~/lib/superbase'

// 定义Todo类型接口
export interface List {
    id: number
    name: string
    created_at: Date
}

export const useLists = () => {
    const supabase = getSupabaseClient()

    const getLists = async () => {
        const { data, error } = await supabase.from('lists').select('*')

        if (error) {
            console.error('Error fetching lists:', error)
            throw error
        }
        return data as List[]
    }

    const addList = async ({name}: {name: string}) => {
        const { data, error } = await supabase.from('lists').insert({name})

        if (error) {
            console.error('Error adding list:', error)
            throw error
        }
        return data as List
    }

    const deleteList = async (id: number) => {
        const { error } = await supabase.from('lists').delete().eq('id', id)

        if (error) {
            console.error('Error deleting list:', error)
            throw error
        }
    }

    const updateList = async (id: number, name: string) => {
        const { data, error } = await supabase.from('lists').update({name}).eq('id', id)

        if (error) {
            console.error('Error updating list:', error)
            throw error
        }
        return data as List
    }

    return {
        getLists,
        addList,
        deleteList,
        updateList
    }
}