export function useColumnResize() {
	function enableResize(th: HTMLElement) {
		const handle = document.createElement('span')
		handle.className = 'col-resize-handle'
		handle.setAttribute('aria-hidden', 'true')

		th.style.position = 'relative'
		handle.style.position = 'absolute'
		handle.style.right = '0'
		handle.style.top = '0'
		handle.style.width = '6px'
		handle.style.cursor = 'col-resize'
		handle.style.height = '100%'
		handle.style.userSelect = 'none'

		th.appendChild(handle)

		let startX = 0
		let startW = 0

		const onMouseDown = (e: MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()
			startX = e.clientX
			startW = th.offsetWidth

			const onMove = (ev: MouseEvent) => {
				const delta = ev.clientX - startX
				th.style.width = Math.max(80, startW + delta) + 'px'
			}
			const onUp = () => {
				window.removeEventListener('mousemove', onMove)
				window.removeEventListener('mouseup', onUp)
			}
			window.addEventListener('mousemove', onMove)
			window.addEventListener('mouseup', onUp)
		}

		handle.addEventListener('mousedown', onMouseDown)
	}

	function init(tableEl: HTMLTableElement | null) {
		if (!tableEl) return
		tableEl
			.querySelectorAll<HTMLTableCellElement>('thead th')
			.forEach(th => enableResize(th))
	}

	return { init }
}
