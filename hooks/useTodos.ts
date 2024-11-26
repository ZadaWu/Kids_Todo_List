import { ref } from "vue";
import { useTodos as useBaseTodos } from "~/services/todos";


interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
// 这是一个Vue的组合式函数(Composable),用于管理todos的状态和操作
export const useTodos = () => {
  // 使用ref创建一个响应式数组,用于存储todos数据
  // 这样当todos.value改变时,使用这个composable的组件会自动更新
  const todos = ref<Todo[]>([]);

  // 从services层获取getTodos方法
  const { getTodos } = useBaseTodos();

  // fetchTodos函数用于从后端获取最新的todos数据
  // 并更新到响应式的todos中
  const fetchTodos = async () => {
    const data = await getTodos();
    todos.value = data;
    return todos.value;
  };

  // 返回:
  // - todos: 响应式的todos数组,组件可以直接使用它来渲染列表
  // - fetchTodos: 获取/刷新todos数据的方法,组件可以在需要时调用(如首次加载、添加/删除todo后)
  return {
    fetchTodos
  }
};
