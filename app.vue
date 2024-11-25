<script setup>
  import { ref, onMounted } from "vue";
  import { getSupabaseClient } from "@/lib/superbase";
  import EmptyList from "@/components/emptyList.vue";
  const supabase = getSupabaseClient();
  const todos = ref([]);
  async function fetchTodos() {
    const { data, error } = await supabase.from("todos").select("*").order("created_at", { ascending: false });
    if(error) {
      console.error(error);
      return
    }
    todos.value = data;
  }

  fetchTodos();
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <div class="todo-container">
      <h1>Todo List</h1>
      <EmptyList v-if="todos.length === 0">No todos found</EmptyList>
      <ul v-else>
        <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
      </ul>
    </div>
  </div>
</template>
