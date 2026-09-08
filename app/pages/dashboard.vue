<script setup lang="ts">
definePageMeta({ 
    middleware: 'auth',
})

const { isAdmin } = useAuth()
const api = useApi()

interface Stats {
  total_users: number
  total_tasks: number
  completed_tasks: number
  pending_tasks: number
}

const { data: stats, pending } = await useAsyncData<Stats>(
  'admin-stats',
  () => api('/stats'),
  { immediate: isAdmin.value }
)
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

    <div v-if="isAdmin">
      <div v-if="pending" class="text-gray-500 text-sm">Loading stats...</div>

      <div v-else-if="stats" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Total Users</p>
          <p class="text-2xl font-semibold text-gray-900">{{ stats.total_users }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Total Tasks</p>
          <p class="text-2xl font-semibold text-gray-900">{{ stats.total_tasks }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Completed</p>
          <p class="text-2xl font-semibold text-green-600">{{ stats.completed_tasks }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Pending</p>
          <p class="text-2xl font-semibold text-yellow-600">{{ stats.pending_tasks }}</p>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-600">
        Welcome back! Head to
        <NuxtLink to="/tasks" class="text-blue-600 hover:underline">your tasks</NuxtLink>
        to get started.
      </p>
    </div>
  </div>
</template>