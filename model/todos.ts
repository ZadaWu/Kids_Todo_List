import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore'

export interface Todo {
    id: string
    title: string
    is_completed: boolean
    created_at: Date
    list_id: string
}

export const useTodos = () => {
    const { $firebaseDb: db } = useNuxtApp()
    const todosCollection = collection(db, 'todos')

    const getTodos = async () => {
        try {
            const querySnapshot = await getDocs(todosCollection)
            return querySnapshot.docs.map(doc => {
                console.log(19, 'todo doc data:', doc.data());
                return {
                    id: doc.id,
                    ...doc.data(),
                    created_at: doc.data().created_at?.toDate()
                }
            }) as Todo[]
        } catch (error) {
            console.error('Error fetching todos:', error)
            throw error
        }
    }

    const addTodo = async ({ title, is_completed, created_at, list_id }: { title: string, is_completed: boolean, created_at: Date, list_id: string }) => {
        try {
            const docRef = await addDoc(todosCollection, {
                title,
                is_completed,
                created_at,
                list_id: doc(db, 'lists', list_id)
            })
            
            return {
                id: docRef.id,
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

    const updateTodo = async (id: string, is_completed: boolean) => {
        try {
            const docRef = doc(db, 'todos', id)
            await updateDoc(docRef, { 
                is_completed,
                updated_at: new Date()
            })
            return {
                id,
                is_completed,
                updated_at: new Date()
            } as Partial<Todo>
        } catch (error) {
            console.error('Error updating todo:', error)
            throw error
        }
    }

    const deleteTodo = async (id: string) => {
        try {
            const docRef = doc(db, 'todos', id)
            await deleteDoc(docRef)
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
