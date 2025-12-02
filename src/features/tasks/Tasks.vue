<script setup lang="ts">
import TaskModal from '@/components/modals/TaskModal.vue'
import TaskTable from '@/components/tables/TaskTable.vue'
import { ref } from 'vue'

const props = defineProps<{
	projectId: number
	assignees: string[]
}>()

const showModal = ref(false)

function openModal() {
	showModal.value = true
}
function closeModal() {
	showModal.value = false
}
</script>

<template>
	<TaskTable
		:project-id="props.projectId"
		:assignees="props.assignees"
		:on-add="openModal"
	/>

	<TaskModal
		:project-id="props.projectId"
		:assignees="props.assignees"
		:show="showModal"
		:on-close="closeModal"
	/>
</template>
