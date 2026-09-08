<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import type { Task } from '~/composables/useTasks'

const { fetchTasks, createTask, updateTask, deleteTask } = useTasks()

const tasks = ref<Task[]>([])
const currentPage = ref(1)
const lastPage = ref(1)
const search = ref('')
const loading = ref(false)

const newTitle = ref('')
const newDescription = ref('')
const creating = ref(false)

const editingId = ref<number | null>(null)
const editTitle = ref('')
const editDescription = ref('')

async function load(page = 1) {
  loading.value = true
  try {
    const res = await fetchTasks(page, search.value)
    tasks.value = res.data
    currentPage.value = res.current_page
    lastPage.value = res.last_page
  } finally {
    loading.value = false
  }
}

let searchTimeout: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => load(1), 400)
})

async function handleCreate() {
  if (!newTitle.value.trim()) return
  creating.value = true
  try {
    await createTask({ title: newTitle.value, description: newDescription.value || undefined })
    newTitle.value = ''
    newDescription.value = ''
    await load(currentPage.value)
  } finally {
    creating.value = false
  }
}

async function toggleCompleted(task: Task) {
  await updateTask(task.id, { completed: !task.completed })
  task.completed = !task.completed
}

function startEdit(task: Task) {
  editingId.value = task.id
  editTitle.value = task.title
  editDescription.value = task.description || ''
}

function cancelEdit() {
  editingId.value = null
}

async function saveEdit(task: Task) {
  const updated = await updateTask(task.id, {
    title: editTitle.value,
    description: editDescription.value || undefined,
  })
  task.title = updated.title
  task.description = updated.description
  editingId.value = null
}

async function handleDelete(task: Task) {
  if (!confirm(`Delete "${task.title}"?`)) return
  await deleteTask(task.id)
  await load(currentPage.value)
}

onMounted(() => load())
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">Tasks</h1>

    <!-- Create form -->
    <form class="bg-white rounded-lg shadow p-4 mb-6 space-y-3" @submit.prevent="handleCreate">
      <div class="flex gap-3">
        <input
          v-model="newTitle"
          type="text"
          placeholder="New task title"
          required
          class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <button
          type="submit"
          :disabled="creating"
          class="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          Add
        </button>
      </div>
      <input
        v-model="newDescription"
        type="text"
        placeholder="Description (optional)"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
    </form>

    <!-- Search -->
    <input
      v-model="search"
      type="text"
      placeholder="Search tasks..."
      class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >

    <div v-if="loading" class="text-gray-500 text-sm">Loading...</div>

    <div v-else class="space-y-2">
      <p v-if="tasks.length === 0" class="text-gray-500 text-sm">No tasks found.</p>

      <div
        v-for="task in tasks"
        :key="task.id"
        class="bg-white rounded-lg shadow p-4"
      >
        <div v-if="editingId === task.id" class="space-y-2">
          <input
            v-model="editTitle"
            type="text"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
          <input
            v-model="editDescription"
            type="text"
            placeholder="Description"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
          <div class="flex gap-2">
            <button
              class="text-sm bg-blue-600 text-white rounded-md px-3 py-1.5 hover:bg-blue-700"
              @click="saveEdit(task)"
            >
              Save
            </button>
            <button
              class="text-sm text-gray-600 border border-gray-300 rounded-md px-3 py-1.5"
              @click="cancelEdit"
            >
              Cancel
            </button>
          </div>
        </div>

        <div v-else class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-3">
            <input
              type="checkbox"
              :checked="task.completed"
              class="mt-1"
              @change="toggleCompleted(task)"
            >
            <div>
              <p
                class="text-sm font-medium"
                :class="task.completed ? 'line-through text-gray-400' : 'text-gray-900'"
              >
                {{ task.title }}
              </p>
              <p v-if="task.description" class="text-sm text-gray-500 mt-0.5">
                {{ task.description }}
              </p>
            </div>
          </div>

          <div class="flex gap-3 shrink-0">
            <button class="text-sm text-blue-600 hover:underline" @click="startEdit(task)">
              Edit
            </button>
            <button class="text-sm text-red-600 hover:underline" @click="handleDelete(task)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="lastPage > 1" class="flex items-center justify-center gap-4 mt-6">
      <button
        :disabled="currentPage === 1"
        class="text-sm text-gray-600 disabled:opacity-40"
        @click="load(currentPage - 1)"
      >
        Previous
      </button>
      <span class="text-sm text-gray-500">Page {{ currentPage }} of {{ lastPage }}</span>
      <button
        :disabled="currentPage === lastPage"
        class="text-sm text-gray-600 disabled:opacity-40"
        @click="load(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>