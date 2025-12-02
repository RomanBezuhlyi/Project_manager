<script setup lang="ts">
import { useTasksStore } from '@/store/tasks'
import { ref } from 'vue'

const props = defineProps<{
	projectId: number
	assignees: string[]
	show: boolean
	onClose: () => void
}>()

const tasks = useTasksStore()

const newTitle = ref('')
const newAssignee = ref(props.assignees[0] ?? '')
const newDueDate = ref('')
const errors = ref<Record<string, string>>({})

function validate() {
	errors.value = {}
	if (!newTitle.value.trim()) errors.value.title = 'Назва обов’язкова'
	if (!newAssignee.value.trim()) errors.value.assignee = 'Оберіть виконавця'
	if (!newDueDate.value.trim()) errors.value.dueDate = 'Вкажіть термін'
	return Object.keys(errors.value).length === 0
}

async function addTask() {
	if (!validate()) return
	await tasks.add({
		projectId: props.projectId,
		title: newTitle.value.trim(),
		assignee: newAssignee.value.trim(),
		status: 'To Do',
		dueDate: newDueDate.value,
	})
	newTitle.value = ''
	newAssignee.value = props.assignees[0] ?? ''
	newDueDate.value = ''
	props.onClose()
}
</script>

<template>
	<div v-if="props.show" class="modal">
		<div class="modal-content">
			<button class="btn btn-outline modal-close" @click="props.onClose()">
				<img src="../../assets/close.svg" alt="" />
			</button>
			<h3>Нове завдання</h3>

			<label>
				<span>Назва:</span>
				<input v-model="newTitle" placeholder="Назва" />
				<small v-if="errors.title" class="err">{{ errors.title }}</small>
			</label>

			<label>
				<span>Виконавець:</span>
				<select v-model="newAssignee">
					<option value="">Оберіть</option>
					<option v-for="a in props.assignees" :key="a" :value="a">
						{{ a }}
					</option>
				</select>
				<small v-if="errors.assignee" class="err">{{ errors.assignee }}</small>
			</label>

			<label>
				<span>Термін:</span>
				<input type="date" v-model="newDueDate" />
				<small v-if="errors.dueDate" class="err">{{ errors.dueDate }}</small>
			</label>

			<button class="btn btn-primary" @click="addTask">Зберегти</button>
		</div>
	</div>
</template>
