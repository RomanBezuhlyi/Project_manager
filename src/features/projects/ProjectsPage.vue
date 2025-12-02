<script setup lang="ts">
import ProjectModal from '@/components/modals/ProjectModal.vue'
import ProjectsTable from '@/components/tables/ProjectsTable.vue'
import { useProjectsStore } from '@/store/projects'
import { useTasksStore } from '@/store/tasks'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const projects = useProjectsStore()
const tasks = useTasksStore()
const router = useRouter()

const showModal = ref(false)

onMounted(async () => {
	await projects.fetchAll()
	await tasks.fetchAll()
})

function goToProject(id: number) {
	router.push(`/project/${id}`)
}
</script>

<template>
	<div class="container">
		<h2>Список проєктів</h2>

		<ProjectsTable @go="goToProject" />

		<button class="btn btn-primary" @click="showModal = true">
			Додати проєкт
		</button>

		<ProjectModal v-if="showModal" @close="showModal = false" />
	</div>
</template>
