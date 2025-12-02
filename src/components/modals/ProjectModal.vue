<script setup lang="ts">
import { useProjectsStore } from '@/store/projects'
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'close'): void }>()

const projects = useProjectsStore()
const newProjectName = ref('')
const newProjectDesc = ref('')

function addProject() {
	if (!newProjectName.value.trim()) return
	projects.add({
		name: newProjectName.value,
		description: newProjectDesc.value,
		status: 'active',
	})
	newProjectName.value = ''
	newProjectDesc.value = ''
	emit('close')
}
</script>

<template>
	<div class="modal">
		<div class="modal-content">
			<button class="btn btn-outline modal-close" @click="emit('close')">
				<img src="../../assets/close.svg" alt="" />
			</button>
			<h3>Новий проєкт</h3>
			<input v-model="newProjectName" placeholder="Назва (обов'язково)" />
			<textarea v-model="newProjectDesc" placeholder="Опис"></textarea>
			<button class="btn btn-primary" @click="addProject">Зберегти</button>
		</div>
	</div>
</template>
