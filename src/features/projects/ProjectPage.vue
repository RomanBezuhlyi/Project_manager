<script setup lang="ts">
import TaskBoard from '@/features/tasks/TaskBoard.vue'
import TaskTable from '@/features/tasks/Tasks.vue'
import { useTasksStore } from '@/store/tasks'
import { useUsersStore } from '@/store/users'
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{ id: number }>()
const tasks = useTasksStore()

const loading = ref(false)
const error = ref<string | null>(null)

const users = useUsersStore()
const assignees = computed(() => users.assignees)

onMounted(async () => {
	try {
		loading.value = true
		await tasks.fetchAll()
	} catch (e: any) {
		error.value = e?.message ?? 'Помилка завантаження'
	} finally {
		loading.value = false
	}
})
</script>

<template>
	<div class="container">
		<h2>Список завдань (Проєкт #{{ props.id }})</h2>

		<div v-if="loading">Завантаження...</div>
		<div v-else-if="error" class="error">{{ error }}</div>
		<div v-else>
			<TaskTable :project-id="props.id" :assignees="assignees" />

			<hr class="divider" />

			<TaskBoard :project-id="props.id" />
		</div>
	</div>
</template>

<style scoped>
.error {
	color: #b00020;
}
.divider {
	margin: 2rem 0;
}
</style>
