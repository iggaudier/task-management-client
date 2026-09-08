<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

interface AdminUser {
  id: number
  name: string
  email: string
  role: 'user' | 'admin'
  tasks_count: number
  created_at: string
}

interface PaginatedUsers {
  data: AdminUser[]
  current_page: number
  last_page: number
}

const api = useApi()
const currentPage = ref(1)
const lastPage = ref(1)
const users = ref<AdminUser[]>([])
const loading = ref(true)

async function load(page = 1) {
  loading.value = true
  try {
    const res = await api<PaginatedUsers>('/admin/users', { query: { page } })
    users.value = res.data
    currentPage.value = res.current_page
    lastPage.value = res.last_page
  } finally {
    loading.value = false
  }
}

onMounted(() => load())
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">Users</h1>

    <div v-if="loading" class="text-gray-500 text-sm">Loading...</div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-4 py-2 font-medium text-gray-600">Name</th>
            <th class="text-left px-4 py-2 font-medium text-gray-600">Email</th>
            <th class="text-left px-4 py-2 font-medium text-gray-600">Role</th>
            <th class="text-left px-4 py-2 font-medium text-gray-600">Tasks</th>
            <th class="text-left px-4 py-2 font-medium text-gray-600">Joined</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="user in users" :key="user.id">
            <td class="px-4 py-2 text-gray-900">{{ user.name }}</td>
            <td class="px-4 py-2 text-gray-600">{{ user.email }}</td>
            <td class="px-4 py-2">
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                :class="user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-4 py-2 text-gray-600">{{ user.tasks_count }}</td>
            <td class="px-4 py-2 text-gray-500">{{ new Date(user.created_at).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>

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