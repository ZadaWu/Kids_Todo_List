import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore'

export interface List {
    id: string  // Firebase 使用 string 类型的 ID
    name: string
    created_at: Date
}

export const useLists = () => {
    const { $firebaseDb: db } = useNuxtApp()
    const listsCollection = collection(db, 'lists')

    const getLists = async () => {
        try {
            const querySnapshot = await getDocs(listsCollection)
            console.log(16, querySnapshot);
            return querySnapshot.docs.map(doc => {
                console.log('doc data:', doc.data(), doc.id);
                return {
                    id: doc.id,
                    ...doc.data(),
                    created_at: doc.data().created_at?.toDate() // Firestore Timestamp 转 Date
                }
            }) as List[]
        } catch (error) {
            console.error('Error fetching lists:', error)
            throw error
        }
    }

    const addList = async ({ name }: { name: string }) => {
        try {
            const docRef = await addDoc(listsCollection, {
                name,
                created_at: new Date()
            })
            
            return {
                id: docRef.id,
                name,
                created_at: new Date()
            } as List
        } catch (error) {
            console.error('Error adding list:', error)
            throw error
        }
    }

    const deleteList = async (id: string) => {
        try {
            const docRef = doc(db, 'lists', id)
            await deleteDoc(docRef)
        } catch (error) {
            console.error('Error deleting list:', error)
            throw error
        }
    }

    const updateList = async (id: string, name: string) => {
        try {
            const docRef = doc(db, 'lists', id)
            await updateDoc(docRef, { name })
            return {
                id,
                name,
                created_at: new Date() // 如果需要保持原始创建时间，需要先获取文档
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