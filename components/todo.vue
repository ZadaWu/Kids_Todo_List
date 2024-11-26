<template>
  <div class="group mb-2 flex items-center gap-3 rounded-md border border-gray-200 px-4 py-3 hover:bg-gray-50">
    <div 
      @click="toggleCompleted"
      class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border"
      :class="[todo.is_completed ? 'bg-red-400 border-red-400' : 'border-gray-300']"
    >
      <svg
        v-if="todo.is_completed"
        xmlns="http://www.w3.org/2000/svg"
        class="h-3 w-3 text-white"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    
    <span :class="{ 'line-through text-gray-400': todo.is_completed }">
      {{ todo.title }}
    </span>
    
    <button 
      @click="emit('edit', todo.id)"
      class="ml-auto opacity-0 group-hover:opacity-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-400 hover:text-gray-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Todo {
    id: number;
    title: string;
    is_completed: boolean;
}

interface Props {
    todo: Todo;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    'update:completed': [boolean]
    'edit': [number]
}>();

const toggleCompleted = () => {
    emit('update:completed', props.todo.id, !props.todo.is_completed);
}
</script>