<script setup lang="ts">
const { user, isAdmin, logout } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <NuxtLink to="/dashboard" class="font-semibold text-gray-900">
            TaskApp
          </NuxtLink>
          <NuxtLink to="/tasks" class="text-sm text-gray-600 hover:text-gray-900">
            Tasks
          </NuxtLink>
          <NuxtLink v-if="isAdmin" to="/admin" class="text-sm text-gray-600 hover:text-gray-900">
            Admin
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500">{{ user?.name }}</span>
          <button
            class="text-sm text-gray-600 hover:text-gray-900"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <main class="max-w-5xl mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>