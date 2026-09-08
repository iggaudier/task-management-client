export interface Task {
  id: number
  user_id: number
  title: string
  description: string | null
  completed: boolean
  created_at: string
}

interface PaginatedTasks {
  data: Task[]
  current_page: number
  last_page: number
  total: number
}

export function useTasks() {
  const api = useApi()

  function fetchTasks(page = 1, search = '') {
    return api<PaginatedTasks>('/tasks', {
      query: { page, search: search || undefined },
    })
  }

  function createTask(payload: { title: string; description?: string }) {
    return api<Task>('/tasks', { method: 'POST', body: payload })
  }

  function updateTask(id: number, payload: Partial<Pick<Task, 'title' | 'description' | 'completed'>>) {
    return api<Task>(`/tasks/${id}`, { method: 'PUT', body: payload })
  }

  function deleteTask(id: number) {
    return api(`/tasks/${id}`, { method: 'DELETE' })
  }

  return { fetchTasks, createTask, updateTask, deleteTask }
}