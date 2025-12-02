<script setup lang="ts">
import { useTasksStore } from '@/store/tasks'
import type { TaskStatus } from '@/types/task'
import { formatDate } from '@/utils/date'
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps<{ projectId: number }>()
const tasks = useTasksStore()

const lanes = ref<Record<TaskStatus, any[]>>({
	'To Do': [],
	'In Progress': [],
	Done: [],
})

watch(
	() => [tasks.items, tasks.filters],
	() => {
		const list = tasks.items.filter(t => t.projectId === props.projectId)

		let filtered = list
		if (tasks.filters.assignee.trim()) {
			const needle = tasks.filters.assignee.toLowerCase()
			filtered = filtered.filter(t => t.assignee.toLowerCase().includes(needle))
		}
		if (tasks.filters.status) {
			filtered = filtered.filter(t => t.status === tasks.filters.status)
		}

		lanes.value['To Do'] = filtered
			.filter(t => t.status === 'To Do')
			.sort((a, b) => a.order - b.order)
		lanes.value['In Progress'] = filtered
			.filter(t => t.status === 'In Progress')
			.sort((a, b) => a.order - b.order)
		lanes.value['Done'] = filtered
			.filter(t => t.status === 'Done')
			.sort((a, b) => a.order - b.order)
	},
	{ immediate: true, deep: true }
)

async function onChange(evt: any, status: TaskStatus) {
	const added = evt.added?.element
	if (added) {
		await tasks.patch(added.id, { status })
	}
	const lane = lanes.value[status]
	const ids = lane.map(t => t.id)
	await tasks.moveToStatus(added ? added.id : ids[0], status, 0)
}
</script>

<template>
	<div class="board">
		<div
			v-for="status in ['To Do', 'In Progress', 'Done']"
			:key="status"
			class="lane"
		>
			<h3>{{ status }}</h3>
			<draggable
				v-model="lanes[status as TaskStatus]"
				item-key="id"
				group="tasks"
				@change="evt => onChange(evt, status as TaskStatus)"
			>
				<template #item="{ element }">
					<div class="card">
						<strong>{{ element.title }}</strong>
						<div class="meta">
							{{ element.assignee }} · {{ formatDate(element.dueDate) }}
						</div>
					</div>
				</template>
			</draggable>
		</div>
	</div>
</template>

<style scoped>
.board {
	display: flex;
	gap: 1rem;
}
.lane {
	flex: 1;
	background: #f4f4f4;
	padding: 1rem;
	border-radius: 8px;
	min-height: 320px;
}
.card {
	background: #fff;
	border: 1px solid #ddd;
	padding: 0.5rem;
	margin-bottom: 0.5rem;
	border-radius: 6px;
	cursor: grab;
}
.meta {
	color: #666;
	font-size: 0.9em;
}
</style>
