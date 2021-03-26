const DELIM = ','

export function parseCsv(csv: string) {
	const out: string[][] = []
	let idx = 0
	let isLineStart = true

	while (idx < csv.length) {
		if (csv[idx] === DELIM) {
			idx++
		} else if (csv[idx] === '\n') {
			isLineStart = true

			idx++
		} else {
			if (isLineStart) {
				out.push([])

				isLineStart = false
			}

			const line = out[out.length - 1]
			let cell = ''

			if (csv[idx] === '"') {
				// is escaped cell
				idx++

				let isCellEnd = false

				while (!isCellEnd) {
					if (csv[idx] === '"') {
						if (csv[idx + 1] === '"') {
							cell += '"'

							idx++
						} else {
							isCellEnd = true
						}

						idx++
					} else {
						cell += csv[idx]

						idx++
					}
				}
			} else {
				while (csv[idx] && ![DELIM, '\n'].includes(csv[idx])) {
					cell += csv[idx]

					idx++
				}
			}

			line.push(cell)
		}
	}

	let maxLineLength = out.reduce(
		(acc, cur) => (cur.length > acc ? cur.length : acc),
		0,
	)

	return out.reduce((acc, cur) => {
		while (cur.length < maxLineLength) {
			cur.push('')
		}

		return acc as string[][]
	}, out)
}

export const serializeCsv = (rows: string[][]) =>
	rows
		.map(cells =>
			cells
				.map(cell =>
					/[,\n"]/.test(cell)
						? `"${cell.split('"').join('""')}"`
						: cell,
				)
				.join(DELIM),
		)
		.join('\n')

// const parseCsv = (csv: string): string[][] => {
// 	const reviver = function (r, c, v) {
// 		return v
// 	}
// 	var chars = csv.split(''),
// 		c = 0,
// 		cc = chars.length,
// 		start,
// 		end,
// 		table = [],
// 		row
// 	while (c < cc) {
// 		table.push((row = []))
// 		while (c < cc && '\r' !== chars[c] && '\n' !== chars[c]) {
// 			start = end = c
// 			if ('"' === chars[c]) {
// 				start = end = ++c
// 				while (c < cc) {
// 					if ('"' === chars[c]) {
// 						if ('"' !== chars[c + 1]) {
// 							break
// 						} else {
// 							chars[++c] = '' // unescape ""
// 						}
// 					}
// 					end = ++c
// 				}
// 				if ('"' === chars[c]) {
// 					++c
// 				}
// 				while (
// 					c < cc &&
// 					'\r' !== chars[c] &&
// 					'\n' !== chars[c] &&
// 					',' !== chars[c]
// 				) {
// 					++c
// 				}
// 			} else {
// 				while (
// 					c < cc &&
// 					'\r' !== chars[c] &&
// 					'\n' !== chars[c] &&
// 					',' !== chars[c]
// 				) {
// 					end = ++c
// 				}
// 			}
// 			row.push(
// 				reviver(
// 					table.length - 1,
// 					row.length,
// 					chars.slice(start, end).join(''),
// 				),
// 			)
// 			if (',' === chars[c]) {
// 				++c
// 			}
// 		}
// 		if ('\r' === chars[c]) {
// 			++c
// 		}
// 		if ('\n' === chars[c]) {
// 			++c
// 		}
// 	}
// 	return table
// }
