import ProjectPage from '@/features/projects/ProjectPage.vue'
import ProjectsPage from '@/features/projects/ProjectsPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'projects',
			component: ProjectsPage,
		},
		{
			path: '/project/:id',
			name: 'project',
			component: ProjectPage,
			props: true,
		},
	],
})
