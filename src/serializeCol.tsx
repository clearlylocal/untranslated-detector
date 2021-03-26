export function serializeCol(col: string[]) {
	return col
		.map(cell =>
			/[\t\n"]/.test(cell) ? `"${cell.split('"').join('""')}"` : cell,
		)
		.join('\n')
}
