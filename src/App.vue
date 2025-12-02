<template>
	<div id="app">
		<header class="app-header">
			<h1>Project Manager</h1>
		</header>

		<main>
			<router-view />
		</main>

		<footer class="app-footer">
			<small>
				© 2025 Project Manager · Created by
				<a href="https://github.com/romanbezuhlyi" target="_blank"
					>Roman Bezuhlyi</a
				>
			</small>
		</footer>
	</div>
</template>

<style scoped lang="scss">
#app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}
.app-header {
	display: flex;
	justify-content: center;
	align-content: center;
	background: #2c3e50;
	color: #fff;
	padding: 1rem;
}
main {
	flex: 1;
	padding: 1rem;
}
.app-footer {
	background: #f4f4f4;
	text-align: center;
	padding: 0.5rem;
}
</style>
