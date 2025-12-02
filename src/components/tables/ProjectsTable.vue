<script setup lang="ts">
import { useColumnResize } from '@/composables/useColumnResize'
import { useProjectsStore } from '@/store/projects'
import { useTasksStore } from '@/store/tasks'
import { formatDate } from '@/utils/date'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits<{ (e: 'go', id: number): void }>()
const projects = useProjectsStore()
const tasks = useTasksStore()

const filterName = ref('')
const filterStatus = ref('')

const sortKey = ref<'id' | 'name' | 'taskCount' | 'status'>('id')
const sortDir = ref<'asc' | 'desc'>('asc')

function sortBy(key: typeof sortKey.value) {
	if (sortKey.value === key) {
		sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
	} else {
		sortKey.value = key
		sortDir.value = 'asc'
	}
}

const filteredProjects = computed(() => {
	return projects.items
		.map(p => {
			const projectTasks = tasks.items.filter(
				t => String(t.projectId) === String(p.id)
			)
			const taskCount = projectTasks.length

			let status = 'active'
			if (taskCount > 0 && projectTasks.every(t => t.status === 'Done')) {
				status = 'completed'
			}

			return { ...p, taskCount, status }
		})
		.filter(p => {
			const matchName = p.name
				.toLowerCase()
				.includes(filterName.value.toLowerCase())
			const matchStatus = filterStatus.value
				? p.status === filterStatus.value
				: true
			return matchName && matchStatus
		})
})

const sortedProjects = computed(() => {
	return [...filteredProjects.value].sort((a, b) => {
		const va = a[sortKey.value] as any
		const vb = b[sortKey.value] as any
		if (va < vb) return sortDir.value === 'asc' ? -1 : 1
		if (va > vb) return sortDir.value === 'asc' ? 1 : -1
		return 0
	})
})

const tableRef = ref<HTMLTableElement | null>(null)
const { init } = useColumnResize()
onMounted(() => init(tableRef.value))
</script>

<template>
	<div class="toolbar">
		<div class="filters">
			<input v-model="filterName" placeholder="Пошук за назвою" />
			<select v-model="filterStatus">
				<option value="">Всі статуси</option>
				<option value="active">Active</option>
				<option value="completed">Completed</option>
			</select>
		</div>
	</div>

	<table ref="tableRef">
		<thead>
			<tr>
				<th @click="sortBy('id')">ID</th>
				<th @click="sortBy('name')">Назва</th>
				<th @click="sortBy('taskCount')">Кількість завдань</th>
				<th @click="sortBy('status')">Статус</th>
				<th>Дата створення</th>
			</tr>
		</thead>
		<tbody>
			<tr v-if="sortedProjects.length === 0">
				<td colspan="5" class="empty">Немає проєктів</td>
			</tr>

			<tr v-for="p in sortedProjects" :key="p.id" @click="emit('go', p.id)">
				<td>{{ p.id }}</td>
				<td>{{ p.name }}</td>
				<td>{{ p.taskCount }}</td>
				<td>{{ p.status }}</td>
				<td>{{ formatDate(p.createdAt) }}</td>
			</tr>
		</tbody>
	</table>
</template>
