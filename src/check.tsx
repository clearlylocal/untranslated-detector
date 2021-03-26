const WORD_REGEX = /([\p{Letter}\p{Mark}]+)/gu
const EXCLUDE_REGEX = /[%${}[\]#:<>]/
const MIN_LENGTH_ANYCASE = 2
const MIN_LENGTH_LOWERCASE = 3

export function check(src: string, trg: string, comment: string) {
	const srcSepsAndWords = src.split(WORD_REGEX)

	const iter = srcSepsAndWords.entries()[Symbol.iterator]()

	const dupes: string[] = []

	while (true) {
		let n = iter.next()

		if (n.done) break

		const [idx, seg] = n.value

		if (idx % 2 === 0) {
			// is separator
			continue
		}

		if (trg.includes(seg)) {
			let strs = [seg]

			while (true) {
				n = iter.next()

				if (n.done) break

				// prettier-ignore
				const [/* idx */, nextSeg] = n.value;

				if (trg.includes(strs.join('') + nextSeg)) {
					strs.push(nextSeg)
				} else {
					break
				}
			}

			let last = ''

			while (last === '') {
				last = strs.pop()
			}

			if (WORD_REGEX.test(last)) {
				strs.push(last)
			}

			dupes.push(strs.join(''))
		}
	}

	return dupes.filter(dupe => {
		const meetsMinLength =
			dupe.length >= MIN_LENGTH_LOWERCASE ||
			(dupe !== dupe.toLowerCase() && dupe.length >= MIN_LENGTH_ANYCASE)

		return (
			meetsMinLength &&
			!EXCLUDE_REGEX.test(dupe) &&
			!comment.includes(dupe)
		)
	})
}
