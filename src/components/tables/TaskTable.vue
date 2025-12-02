<script setup lang="ts">
import { useColumnResize } from '@/composables/useColumnResize'
import { useTasksStore } from '@/store/tasks'
import type { Task, TaskStatus } from '@/types/task'
import { formatDate } from '@/utils/date'
import { computed, onMounted, ref, watch } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps<{
	projectId: number
	assignees: string[]
	onAdd: () => void
}>()

const tasks = useTasksStore()

const filterAssignee = ref(tasks.filters.assignee)
const filterStatus = ref<TaskStatus | ''>(tasks.filters.status ?? '')

watch([filterAssignee, filterStatus], () => {
	tasks.setFilters({
		assignee: filterAssignee.value,
		status: filterStatus.value ? (filterStatus.value as TaskStatus) : null,
	})
})

type SortKey = 'dueDate' | 'status'
const sortKey = ref<SortKey>(tasks.sort.key as SortKey)
const sortDir = ref<'asc' | 'desc'>(tasks.sort.dir)

function sortBy(key: SortKey) {
	if (sortKey.value === key) {
		sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
	} else {
		sortKey.value = key
		sortDir.value = 'asc'
	}
	tasks.setSort(sortKey.value)
	tasks.sort = { key: sortKey.value, dir: sortDir.value }
}

const visible = computed<Task[]>(() => {
	let list = tasks.byProject(props.projectId)

	if (filterAssignee.value.trim()) {
		const needle = filterAssignee.value.toLowerCase()
		list = list.filter(t => t.assignee.toLowerCase().includes(needle))
	}
	if (filterStatus.value) {
		list = list.filter(t => t.status === filterStatus.value)
	}

	const dir = sortDir.value === 'asc' ? 1 : -1
	if (sortKey.value === 'dueDate') {
		list = [...list].sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1) * dir)
	} else if (sortKey.value === 'status') {
		list = [...list].sort((a, b) => (a.status > b.status ? 1 : -1) * dir)
	}

	list = list.sort((a, b) => a.order - b.order)
	return list
})

function onTableChange(evt: any) {
	if (evt.moved || evt.added || evt.removed) {
		const ids = (evt.to as HTMLElement).querySelectorAll('tr[data-id]')
		const orderedIds = Array.from(ids).map(el => el.getAttribute('data-id'))
		tasks.reorder(props.projectId, orderedIds)
	}
}

const { init } = useColumnResize()
onMounted(() => {
	const table = document.querySelector('.table') as HTMLTableElement
	init(table)
})
</script>

<template>
	<div class="toolbar">
		<div class="filters">
			<label>
				<span>Виконавець:</span>
				<select v-model="filterAssignee">
					<option value="">(всі)</option>
					<option v-for="a in props.assignees" :key="a" :value="a">
						{{ a }}
					</option>
				</select>
			</label>
			<label>
				<span>Статус:</span>
				<select v-model="filterStatus">
					<option value="">(всі)</option>
					<option value="To Do">To Do</option>
					<option value="In Progress">In Progress</option>
					<option value="Done">Done</option>
				</select>
			</label>
		</div>
		<button class="btn btn-primary" @click="props.onAdd()">
			Додати завдання
		</button>
	</div>

	<table>
		<thead>
			<tr>
				<th>ID</th>
				<th>Назва</th>
				<th>Виконавець</th>
				<th @click="sortBy('status')" class="sortable">
					Статус
					<span v-if="sortKey === 'status'">
						{{ sortDir === 'asc' ? '↑' : '↓' }}
					</span>
				</th>
				<th @click="sortBy('dueDate')" class="sortable">
					Термін
					<span v-if="sortKey === 'dueDate'">
						{{ sortDir === 'asc' ? '↑' : '↓' }}
					</span>
				</th>
			</tr>
		</thead>

		<draggable
			v-if="visible.length !== 0"
			tag="tbody"
			:list="visible"
			item-key="id"
			@change="onTableChange"
		>
			<template #item="{ element }">
				<tr :data-id="element.id">
					<td>{{ element.id }}</td>
					<td>{{ element.title }}</td>
					<td>{{ element.assignee }}</td>
					<td>{{ element.status }}</td>
					<td>{{ formatDate(element.dueDate) }}</td>
				</tr>
			</template>
		</draggable>
		<tbody v-else>
			<tr>
				<td colspan="5" class="empty">Немає завдань у цьому проєкті</td>
			</tr>
		</tbody>
	</table>
</template>
