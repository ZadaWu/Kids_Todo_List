import { useLists as useListsModel } from '@/model/list'

export const useListService = () => {
    const ListsModel = useListsModel();

    const getLists = async () => {
        try {
            return await ListsModel.getLists()
        } catch (error) {
            console.error('Error fetching lists:', error)
            throw error
        }
    }

    const addList = async ({name}: {name: string}) => {
        try {
            return await ListsModel.addList({name})
        } catch (error) {
            console.error('Error adding list:', error)
            throw error
        }
    }

    const deleteList = async (id: number) => {
        try {
            return await ListsModel.deleteList(id)
        } catch (error) {
            console.error('Error deleting list:', error)
            throw error
        }
    }

    const updateList = async (id: number, name: string) => {
        try {
            return await ListsModel.updateList(id, name)
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